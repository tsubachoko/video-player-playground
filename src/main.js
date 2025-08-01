import { initVideoJS, loadVideoJS, sampleVideoJS, sampleVideoJSHLS, togglePiP } from './videojs/player.js';
import { initHLSJS, loadHLSJS, sampleHLSJS } from './hlsjs/player.js';
import { initShaka, loadShaka, sampleShaka, sampleShakaHLS } from './shaka/player.js';

// タブ切り替え機能
window.switchTab = (tabName) => {
    // すべてのタブボタンからactiveクラスを削除
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // すべてのタブコンテンツを非表示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 選択されたタブボタンにactiveクラスを追加
    event.target.classList.add('active');

    // 選択されたタブコンテンツを表示
    document.getElementById(`${tabName}-tab`).classList.add('active');
};

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
