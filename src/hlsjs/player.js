import Hls from 'hls.js';
import { SAMPLE_URLS } from '../common/constants.js';

let hlsjsInstance;

// HLS.js の初期化
export function initHLSJS() {
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

// HLS.js でビデオをロード
export function loadHLSJS() {
    const url = document.getElementById('hlsjs-url').value;
    if (url && hlsjsInstance) {
        hlsjsInstance.loadSource(url);
        hlsjsInstance.startLoad();
    }
}

// サンプルHLSをロード
export function sampleHLSJS() {
    document.getElementById('hlsjs-url').value = SAMPLE_URLS.hls;
    loadHLSJS();
}

// HLS.js カスタムプレイヤーのインスタンス管理
let customHLSJSPlayer = null;

// HLS.js カスタムプレイヤーの初期化
export async function loadHLSJSCustom(url) {
    const videoElement = document.getElementById('hlsjs-custom-player');

    // 既存のプレイヤーがあれば破棄
    if (customHLSJSPlayer) {
        customHLSJSPlayer.destroy();
    }

    if (Hls.isSupported()) {
        customHLSJSPlayer = new Hls();
        customHLSJSPlayer.loadSource(url);
        customHLSJSPlayer.attachMedia(videoElement);

        customHLSJSPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS.js custom player manifest parsed');
            console.log('HLS.js levels:', customHLSJSPlayer.levels);
            videoElement.play();
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = url;
    } else {
        throw new Error('HLS is not supported in this browser');
    }

    // 動画終了時のイベントリスナーを追加
    videoElement.addEventListener('ended', () => {
        console.log('HLS.js: 動画が終了しました');
        console.log('HLS.js: Video ended');
    });
}

// HLS.js カスタム再生/一時停止の切り替え
export function togglePlayHLSJSCustom() {
    const playBtn = document.getElementById('hlsjs-play-btn');
    const videoElement = document.getElementById('hlsjs-custom-player');

    if (!videoElement) return;

    if (videoElement.paused) {
        videoElement.play();
        playBtn.textContent = '⏸️';
    } else {
        videoElement.pause();
        playBtn.textContent = '▶️';
    }
}

// HLS.js カスタムミュート/ミュート解除の切り替え
export function toggleMuteHLSJSCustom() {
    const muteBtn = document.getElementById('hlsjs-mute-btn');
    const volumeSlider = document.getElementById('hlsjs-volume');
    const videoElement = document.getElementById('hlsjs-custom-player');

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

// HLS.js カスタム音量設定
export function setVolumeHLSJSCustom(volume) {
    const muteBtn = document.getElementById('hlsjs-mute-btn');
    const videoElement = document.getElementById('hlsjs-custom-player');

    if (!videoElement) return;

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

// HLS.js カスタム再生速度設定
export function setSpeedHLSJSCustom(speed) {
    const videoElement = document.getElementById('hlsjs-custom-player');

    if (!videoElement) return;
    videoElement.playbackRate = parseFloat(speed);
}

// HLS.js カスタムシーク機能
export function seekHLSJSCustom(seconds) {
    const videoElement = document.getElementById('hlsjs-custom-player');

    if (!videoElement) return;
    videoElement.currentTime = Math.max(0, videoElement.currentTime + seconds);
}

// HLS.js カスタムサンプル動画をロード
export function loadSampleHLSJSCustom(type) {
    const urlInput = document.getElementById('hlsjs-custom-url');

    if (type === 'hls') {
        urlInput.value = SAMPLE_URLS.hls;
    }

    loadHLSJSCustom(urlInput.value);
}
