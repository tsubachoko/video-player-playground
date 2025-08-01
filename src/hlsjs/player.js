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
