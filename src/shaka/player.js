import shaka from 'shaka-player';
import { SAMPLE_URLS } from '../common/constants.js';

let shakaPlayer;
let cmcdConfig = {
    enabled: false,
    sessionId: null,
    contentId: null,
    streamingFormat: 'dash',
    streamType: 'v'
};

// セッションID生成
function generateSessionId() {
    return 'shaka-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Shaka Player の初期化
export async function initShaka() {
    // Shaka Player のポリフィルをインストール
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
        const video = document.getElementById('shaka-player');
        shakaPlayer = new shaka.Player(video);

        // CMCD設定を適用
        configureCMCD(shakaPlayer);

        // エラーハンドリング
        shakaPlayer.addEventListener('error', (event) => {
            console.error('Shaka Player error:', event.detail);
        });

        // アダプテーション情報の更新
        shakaPlayer.addEventListener('adaptation', () => {
            updateShakaInfo();
        });

        // デフォルトでHLSサンプルURLを設定して自動再生
        const urlInput = document.getElementById('shaka-url');
        if (urlInput) {
            urlInput.value = SAMPLE_URLS.hls;
            // 自動的にHLSサンプルを読み込んで再生
            try {
                await shakaPlayer.load(SAMPLE_URLS.hls);
                // ミュート状態で自動再生（ブラウザの自動再生ポリシーに対応）
                video.muted = true;
                await video.play();
                console.log('Shaka Player: HLSサンプルをミュート状態で自動再生開始');
                updateShakaInfo();
            } catch (error) {
                console.error('Shaka Player: 自動再生エラー:', error);
            }
        }

        shakaPlayer.getNetworkingEngine().registerRequestFilter((type, request) => {
            // CMCDが送信されるタイプのリクエスト（セグメント、マニフェストなど）にのみ適用
            const cmcdData = request.cmcd;
            console.log('CMCD Data:', request);
            return

            if (!cmcdData) {
                return;
            }



            // CMCDデータオブジェクトにカスタムキーを追加
            cmcdData['cust-user'] = 'user-12345';

            // 例: 'bl'（バッファ長）キーを送信しないようにする
            delete cmcdData['bl'];

            // 変更したCMCDデータをリクエストヘッダーに適用
            if (player.getConfiguration().cmcd.useHeaders) {
                request.headers['CMCD'] = shaka.util.CmcdManager.serialize(cmcdData);
            }
            // クエリパラメータの場合は、URLを変更するロジックが必要
            // shaka.util.CmcdManager.serialize(cmcdData) は CMCDデータを文字列に変換するヘルパー関数
        });

        console.log('Shaka Player initialized');
    } else {
        console.error('Browser not supported by Shaka Player');
    }
}

// CMCD設定を適用
function configureCMCD(player) {
    if (!cmcdConfig.enabled) {
        player.configure({
            cmcd: {
                enabled: false
            }
        });
        return;
    }

    const cmcdConfiguration = {
        cmcd: {
            enabled: true,
            sessionId: cmcdConfig.sessionId || generateSessionId(),
            contentId: cmcdConfig.contentId || 'video-playground',
            useHeaders: false,
            cmcdData: () => ({
                streamingFormat: cmcdConfig.streamingFormat,
                streamType: cmcdConfig.streamType
            })
        }
    };

    player.configure(cmcdConfiguration);
    console.log('Shaka Player CMCD Configuration:', cmcdConfiguration);
}

// Shaka Player 情報の更新
function updateShakaInfo() {
    if (!shakaPlayer) return;

    const infoDiv = document.getElementById('shaka-info');
    const variantsSpan = document.getElementById('shaka-variants');
    const currentVariantSpan = document.getElementById('shaka-current-variant');

    try {
        const variants = shakaPlayer.getVariantTracks();
        if (variants.length > 0) {
            infoDiv.style.display = 'block';

            const variantInfo = variants.map(v =>
                `${v.width}x${v.height} (${Math.round(v.bandwidth / 1000)}kbps)`
            ).join(', ');

            variantsSpan.textContent = variantInfo;

            const activeVariant = variants.find(v => v.active);
            currentVariantSpan.textContent = activeVariant ?
                `${activeVariant.width}x${activeVariant.height}` : 'Unknown';
        }
    } catch (error) {
        console.error('Error updating Shaka info:', error);
    }
}

// Shaka Player でビデオをロード
export async function loadShaka() {
    const url = document.getElementById('shaka-url').value;
    if (url && shakaPlayer) {
        try {
            await shakaPlayer.load(url);
            console.log('Shaka Player loaded:', url);
            updateShakaInfo();
        } catch (error) {
            console.error('Error loading in Shaka Player:', error);
        }
    }
}

// サンプルDASHをロード
export function sampleShaka() {
    document.getElementById('shaka-url').value = SAMPLE_URLS.dash;
    loadShaka();
}

// サンプルHLSをロード
export function sampleShakaHLS() {
    document.getElementById('shaka-url').value = SAMPLE_URLS.hls;
    loadShaka();
}

// Shaka Player カスタムプレイヤーのインスタンス管理
let customShakaPlayer = null;

// Shaka Player カスタムプレイヤーの初期化
export async function loadShakaCustom(url) {
    const videoElement = document.getElementById('shaka-custom-player');

    // 既存のプレイヤーがあれば破棄
    if (customShakaPlayer) {
        await customShakaPlayer.destroy();
    }

    customShakaPlayer = new shaka.Player(videoElement);

    // CMCD設定を適用
    configureCMCD(customShakaPlayer);

    await customShakaPlayer.load(url);

    // 動画終了時のイベントリスナーを追加
    videoElement.addEventListener('ended', () => {
        console.log('Shaka Player: 動画が終了しました');
        console.log('Shaka Player: Video ended');
    });

    // 時間更新イベントリスナーを追加
    videoElement.addEventListener('timeupdate', () => {
        updateShakaSeekBar();
    });

    // メタデータ読み込み完了時
    videoElement.addEventListener('loadedmetadata', () => {
        updateShakaSeekBar();
    });
}

// Shaka Player カスタム再生/一時停止の切り替え
export function togglePlayShakaCustom() {
    const playBtn = document.getElementById('shaka-play-btn');
    const videoElement = document.getElementById('shaka-custom-player');

    if (!videoElement) return;

    if (videoElement.paused) {
        videoElement.play();
        playBtn.textContent = '⏸️';
    } else {
        videoElement.pause();
        playBtn.textContent = '▶️';
    }
}

// Shaka Player カスタムミュート/ミュート解除の切り替え
export function toggleMuteShakaCustom() {
    const muteBtn = document.getElementById('shaka-mute-btn');
    const volumeSlider = document.getElementById('shaka-volume');
    const videoElement = document.getElementById('shaka-custom-player');

    if (!videoElement) return;

    if (videoElement.muted) {
        videoElement.muted = false;
        muteBtn.textContent = videoElement.volume > 0.5 ? '🔊' : '🔉';
        volumeSlider.value = videoElement.volume;
    } else {
        videoElement.muted = true;
        muteBtn.textContent = '🔇';
    }
}

// Shaka Player カスタム音量設定
export function setVolumeShakaCustom(volume) {
    const muteBtn = document.getElementById('shaka-mute-btn');
    const videoElement = document.getElementById('shaka-custom-player');

    if (!videoElement) return;

    console.log(customShakaPlayer.getMediaElement());
    // customShakaPlayer.ui.setVolume(parseFloat(volume));

    videoElement.volume = parseFloat(volume);
    videoElement.muted = false;

    // 音量に応じてアイコンを変更
    if (volume == 0) {
        muteBtn.textContent = '🔇';
    } else if (volume < 0.5) {
        muteBtn.textContent = '🔉';
    } else {
        muteBtn.textContent = '🔊';
    }
}

// Shaka Player カスタム再生速度設定
export function setSpeedShakaCustom(speed) {
    const videoElement = document.getElementById('shaka-custom-player');

    if (!videoElement) return;
    videoElement.playbackRate = parseFloat(speed);
}

// Shaka Player カスタムシーク機能
export function seekShakaCustom(seconds) {
    const videoElement = document.getElementById('shaka-custom-player');

    if (!videoElement) return;
    videoElement.currentTime = Math.max(0, videoElement.currentTime + seconds);
}

// Shaka Player カスタムサンプル動画をロード
export function loadSampleShakaCustom(type) {
    const urlInput = document.getElementById('shaka-custom-url');

    if (type === 'hls') {
        urlInput.value = SAMPLE_URLS.hls;
    } else if (type === 'dash') {
        urlInput.value = SAMPLE_URLS.dash;
    }

    loadShakaCustom(urlInput.value);
}

// Shaka Player カスタムシークバーの更新
function updateShakaSeekBar() {
    const videoElement = document.getElementById('shaka-custom-player');
    if (!videoElement) return;

    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    if (duration > 0) {
        const percentage = (currentTime / duration) * 100;
        const seekBar = document.getElementById('shaka-seek');
        if (seekBar) seekBar.value = percentage;

        // 時間表示の更新
        const currentTimeSpan = document.getElementById('shaka-current-time');
        const durationSpan = document.getElementById('shaka-duration');
        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(currentTime);
        if (durationSpan) durationSpan.textContent = formatTime(duration);
    }
}

// Shaka Player カスタムシーク位置制御
export function seekToPositionShaka(percentage) {
    const videoElement = document.getElementById('shaka-custom-player');
    if (!videoElement) return;

    const duration = videoElement.duration;
    if (duration > 0) {
        const newTime = (percentage / 100) * duration;
        videoElement.currentTime = newTime;
    }
}

// 時間フォーマット関数
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// CMCD設定を更新
export function updateCMCDConfig(config) {
    cmcdConfig = { ...cmcdConfig, ...config };
    console.log('Shaka Player CMCD Config Updated:', cmcdConfig);

    // 既存のプレイヤーにCMCD設定を適用
    if (shakaPlayer) {
        configureCMCD(shakaPlayer);
    }
    if (customShakaPlayer) {
        configureCMCD(customShakaPlayer);
    }
}

// 現在のCMCD設定を取得
export function getCMCDConfig() {
    return { ...cmcdConfig };
}
