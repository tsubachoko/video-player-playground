import videojs from 'video.js';
import Hls from 'hls.js';
import shaka from 'shaka-player/dist/shaka-player.ui.js';

// グローバル変数
let videojsPlayer;
let hlsjsInstance;
let shakaPlayer;

// サンプル動画URL
const SAMPLE_URLS = {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hls: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    dash: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
};

// Video.js の初期化
function initVideoJS() {
    videojsPlayer = videojs('videojs-player', {
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        html5: {
            vhs: {
                enableLowInitialPlaylist: true,
                smoothQualityChange: true,
                overrideNative: true
            }
        }
    });

    videojsPlayer.ready(() => {
        console.log('Video.js player is ready');
        console.log('Video.js HLS support:', videojsPlayer.tech().vhs ? 'Enabled' : 'Disabled');
    });

    // プレイリスト変更時の情報更新
    videojsPlayer.on('loadstart', () => {
        setTimeout(() => updateVideoJSInfo(), 3000);
    });
}

// HLS.js の初期化
function initHLSJS() {
    const video = document.getElementById('hlsjs-player');

    if (Hls.isSupported()) {
        hlsjsInstance = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
        });

        hlsjsInstance.attachMedia(video);

        hlsjsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed');
            updateHLSInfo();
        });

        hlsjsInstance.on(Hls.Events.LEVEL_SWITCHED, () => {
            updateHLSInfo();
        });

        hlsjsInstance.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS.js error:', data);
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('HLS native support');
    } else {
        console.error('HLS not supported');
    }
}

// Shaka Player の初期化
async function initShaka() {
    // Shaka Player のポリフィルをインストール
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
        const video = document.getElementById('shaka-player');
        shakaPlayer = new shaka.Player(video);

        // エラーハンドリング
        shakaPlayer.addEventListener('error', (event) => {
            console.error('Shaka Player error:', event.detail);
        });

        // アダプテーション情報の更新
        shakaPlayer.addEventListener('adaptation', () => {
            updateShakaInfo();
        });

        console.log('Shaka Player initialized');
    } else {
        console.error('Browser not supported by Shaka Player');
    }
}

// HLS.js 情報の更新
function updateHLSInfo() {
    if (!hlsjsInstance) return;

    const infoDiv = document.getElementById('hlsjs-info');
    const levelsSpan = document.getElementById('hlsjs-levels');
    const currentLevelSpan = document.getElementById('hlsjs-current-level');

    if (hlsjsInstance.levels.length > 0) {
        infoDiv.style.display = 'block';

        const levels = hlsjsInstance.levels.map((level, index) =>
            `${index}: ${level.width}x${level.height} (${Math.round(level.bitrate / 1000)}kbps)`
        ).join(', ');

        levelsSpan.textContent = levels;
        currentLevelSpan.textContent = hlsjsInstance.currentLevel >= 0 ?
            `Level ${hlsjsInstance.currentLevel}` : 'Auto';
    }
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

// Video.js でビデオをロード
window.loadVideoJS = () => {
    const url = document.getElementById('videojs-url').value;
    if (url && videojsPlayer) {
        videojsPlayer.src({
            src: url,
            type: getVideoType(url)
        });

        // HLS情報の更新
        if (url.includes('.m3u8')) {
            setTimeout(() => updateVideoJSInfo(), 2000);
        }
    }
};

// サンプル動画をVideo.jsでロード
window.sampleVideoJS = () => {
    document.getElementById('videojs-url').value = SAMPLE_URLS.mp4;
    window.loadVideoJS();
};

// Video.jsでサンプルHLSをロード
window.sampleVideoJSHLS = () => {
    document.getElementById('videojs-url').value = SAMPLE_URLS.hls;
    window.loadVideoJS();
};

// Video.js HLS情報の更新
function updateVideoJSInfo() {
    if (!videojsPlayer) return;

    const infoDiv = document.getElementById('videojs-info');
    const hlsInfoSpan = document.getElementById('videojs-hls-info');

    try {
        const tech = videojsPlayer.tech();
        if (tech && tech.vhs) {
            infoDiv.style.display = 'block';
            const vhs = tech.vhs;

            if (vhs.playlists && vhs.playlists.master && vhs.playlists.master.playlists) {
                const playlists = vhs.playlists.master.playlists;
                const info = playlists.map((playlist, index) => {
                    const resolution = playlist.attributes && playlist.attributes.RESOLUTION ?
                        `${playlist.attributes.RESOLUTION.width}x${playlist.attributes.RESOLUTION.height}` : 'Unknown';
                    const bandwidth = playlist.attributes && playlist.attributes.BANDWIDTH ?
                        `${Math.round(playlist.attributes.BANDWIDTH / 1000)}kbps` : 'Unknown';
                    return `${resolution} (${bandwidth})`;
                }).join(', ');

                hlsInfoSpan.textContent = `利用可能な品質: ${info}`;
            } else {
                hlsInfoSpan.textContent = 'HLS ストリーム情報を読み込み中...';
            }
        } else {
            infoDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating Video.js info:', error);
        hlsInfoSpan.textContent = 'HLS情報の取得に失敗しました';
    }
}

// HLS.js でビデオをロード
window.loadHLSJS = () => {
    const url = document.getElementById('hlsjs-url').value;
    if (url && hlsjsInstance) {
        hlsjsInstance.loadSource(url);
        hlsjsInstance.startLoad();
    }
};

// サンプルHLSをロード
window.sampleHLSJS = () => {
    document.getElementById('hlsjs-url').value = SAMPLE_URLS.hls;
    window.loadHLSJS();
};

// Shaka Player でビデオをロード
window.loadShaka = async () => {
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
};

// サンプルDASHをロード
window.sampleShaka = () => {
    document.getElementById('shaka-url').value = SAMPLE_URLS.dash;
    window.loadShaka();
};

// ビデオタイプを判定
function getVideoType(url) {
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    if (url.includes('.mpd')) return 'application/dash+xml';
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    return 'video/mp4'; // デフォルト
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initVideoJS();
    initHLSJS();
    initShaka();
});
