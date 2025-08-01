import { initVideoJS, loadVideoJS, sampleVideoJS, sampleVideoJSHLS, togglePiP } from './videojs/player.js';
import { initHLSJS, loadHLSJS, sampleHLSJS } from './hlsjs/player.js';
import { initShaka, loadShaka, sampleShaka, sampleShakaHLS } from './shaka/player.js';

// グローバル関数として公開
window.loadVideoJS = loadVideoJS;
window.sampleVideoJS = sampleVideoJS;
window.sampleVideoJSHLS = sampleVideoJSHLS;
window.togglePiP = togglePiP;

window.loadHLSJS = loadHLSJS;
window.sampleHLSJS = sampleHLSJS;

window.loadShaka = loadShaka;
window.sampleShaka = sampleShaka;
window.sampleShakaHLS = sampleShakaHLS;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initVideoJS();
    initHLSJS();
    initShaka();
});
