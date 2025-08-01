import { initVideoJS, loadVideoJS, sampleVideoJS, sampleVideoJSHLS } from './videojs/player.js';
import { initHLSJS, loadHLSJS, sampleHLSJS } from './hlsjs/player.js';
import { initShaka, loadShaka, sampleShaka } from './shaka/player.js';

// グローバル関数として公開
window.loadVideoJS = loadVideoJS;
window.sampleVideoJS = sampleVideoJS;
window.sampleVideoJSHLS = sampleVideoJSHLS;

window.loadHLSJS = loadHLSJS;
window.sampleHLSJS = sampleHLSJS;

window.loadShaka = loadShaka;
window.sampleShaka = sampleShaka;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initVideoJS();
    initHLSJS();
    initShaka();
});
