import shaka from 'shaka-player/dist/shaka-player.ui.js';
import { SAMPLE_URLS } from '../common/constants.js';

let shakaPlayer;

// Shaka Player の初期化
export async function initShaka() {
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
