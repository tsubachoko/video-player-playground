import { initVideoJS, loadVideoJS, sampleVideoJS, sampleVideoJSHLS, togglePiP,
         loadVideoJSCustom, togglePlayVideoJSCustom, toggleMuteVideoJSCustom,
         setVolumeVideoJSCustom, setSpeedVideoJSCustom, seekVideoJSCustom, loadSampleVideoJSCustom,
         seekToPositionVideoJS } from './videojs/player.js';
import { initHLSJS, loadHLSJS, sampleHLSJS,
         loadHLSJSCustom, togglePlayHLSJSCustom, toggleMuteHLSJSCustom,
         setVolumeHLSJSCustom, setSpeedHLSJSCustom, seekHLSJSCustom, loadSampleHLSJSCustom,
         seekToPositionHLSJS } from './hlsjs/player.js';
import { initShaka, loadShaka, sampleShaka, sampleShakaHLS,
         loadShakaCustom, togglePlayShakaCustom, toggleMuteShakaCustom,
         setVolumeShakaCustom, setSpeedShakaCustom, seekShakaCustom, loadSampleShakaCustom,
         seekToPositionShaka } from './shaka/player.js';

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

// サブタブ切り替え機能
window.switchSubTab = (playerName, subTabName) => {
    // 該当プレイヤーのサブタブボタンからactiveクラスを削除
    document.querySelectorAll(`#${playerName}-tab .sub-tab-button`).forEach(button => {
        button.classList.remove('active');
    });

    // 該当プレイヤーのサブタブコンテンツを非表示
    document.querySelectorAll(`#${playerName}-tab .sub-tab-content`).forEach(content => {
        content.classList.remove('active');
    });

    // 選択されたサブタブボタンにactiveクラスを追加
    event.target.classList.add('active');

    // 選択されたサブタブコンテンツを表示
    document.getElementById(`${playerName}-${subTabName}`).classList.add('active');
};// グローバル関数として公開
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
    initCustomPlayers();
});

// カスタムプレイヤーの初期化（オーバーレイ機能のみ）
function initCustomPlayers() {
    // オーバーレイの自動非表示機能を追加
    ['videojs', 'hlsjs', 'shaka'].forEach(playerType => {
        const container = document.getElementById(`${playerType}-custom-container`);
        const overlay = document.getElementById(`${playerType}-overlay`);
        let hideTimer;

        if (container && overlay) {
            // マウス移動時にオーバーレイを表示
            container.addEventListener('mousemove', () => {
                overlay.classList.add('visible');
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => {
                    overlay.classList.remove('visible');
                }, 3000); // 3秒後に非表示
            });

            // マウスがコンテナから離れたら即座に非表示
            container.addEventListener('mouseleave', () => {
                overlay.classList.remove('visible');
                clearTimeout(hideTimer);
            });

            // オーバーレイ自体にマウスが乗った時は非表示タイマーをクリア
            overlay.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
            });
        }
    });
}

// カスタムプレイヤーの共通ロード関数
window.loadCustomPlayer = async function(playerType) {
    const urlInput = document.getElementById(`${playerType}-custom-url`);
    const url = urlInput.value.trim();

    if (!url) {
        alert('URLを入力してください');
        return;
    }

    try {
        if (playerType === 'videojs') {
            await loadVideoJSCustom(url);
        } else if (playerType === 'hlsjs') {
            await loadHLSJSCustom(url);
        } else if (playerType === 'shaka') {
            await loadShakaCustom(url);
        }
    } catch (error) {
        console.error(`Error loading ${playerType}:`, error);
        alert(`エラーが発生しました: ${error.message}`);
    }
};

// カスタムプレイヤーの各機能を個別のライブラリ関数に委譲
window.togglePlayCustom = function(playerType) {
    if (playerType === 'videojs') {
        togglePlayVideoJSCustom();
    } else if (playerType === 'hlsjs') {
        togglePlayHLSJSCustom();
    } else if (playerType === 'shaka') {
        togglePlayShakaCustom();
    }
};

window.toggleMuteCustom = function(playerType) {
    if (playerType === 'videojs') {
        toggleMuteVideoJSCustom();
    } else if (playerType === 'hlsjs') {
        toggleMuteHLSJSCustom();
    } else if (playerType === 'shaka') {
        toggleMuteShakaCustom();
    }
};

window.setVolumeCustom = function(playerType, volume) {
    if (playerType === 'videojs') {
        setVolumeVideoJSCustom(volume);
    } else if (playerType === 'hlsjs') {
        setVolumeHLSJSCustom(volume);
    } else if (playerType === 'shaka') {
        setVolumeShakaCustom(volume);
    }
};

window.setSpeedCustom = function(playerType, speed) {
    if (playerType === 'videojs') {
        setSpeedVideoJSCustom(speed);
    } else if (playerType === 'hlsjs') {
        setSpeedHLSJSCustom(speed);
    } else if (playerType === 'shaka') {
        setSpeedShakaCustom(speed);
    }
};

window.seekCustomPlayer = function(playerType, seconds) {
    if (playerType === 'videojs') {
        seekVideoJSCustom(seconds);
    } else if (playerType === 'hlsjs') {
        seekHLSJSCustom(seconds);
    } else if (playerType === 'shaka') {
        seekShakaCustom(seconds);
    }
};

window.loadSampleCustom = function(playerType, type) {
    if (playerType === 'videojs') {
        loadSampleVideoJSCustom(type);
    } else if (playerType === 'hlsjs') {
        loadSampleHLSJSCustom(type);
    } else if (playerType === 'shaka') {
        loadSampleShakaCustom(type);
    }
};

// シークバーによる動画位置制御
window.seekToPosition = function(playerType, percentage) {
    if (playerType === 'videojs') {
        seekToPositionVideoJS(percentage);
    } else if (playerType === 'hlsjs') {
        seekToPositionHLSJS(percentage);
    } else if (playerType === 'shaka') {
        seekToPositionShaka(percentage);
    }
};

// 時間を mm:ss 形式でフォーマット
window.formatTime = function(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};