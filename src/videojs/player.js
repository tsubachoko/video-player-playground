import videojs from 'video.js';
import '@videojs/http-streaming';
import { SAMPLE_URLS, getVideoType } from '../common/constants.js';

let videojsPlayer;

// Video.js の初期化
export function initVideoJS() {
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

// Video.js でビデオをロード
export function loadVideoJS() {
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
}

// サンプル動画をVideo.jsでロード
export function sampleVideoJS() {
    document.getElementById('videojs-url').value = SAMPLE_URLS.mp4;
    loadVideoJS();
}

// Video.jsでサンプルHLSをロード
export function sampleVideoJSHLS() {
    document.getElementById('videojs-url').value = SAMPLE_URLS.hls;
    loadVideoJS();
}
