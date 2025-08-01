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

// ピクチャーインピクチャー機能
export function togglePiP() {
    if (!videojsPlayer) {
        alert('Video.jsプレイヤーが初期化されていません');
        return;
    }

    const videoElement = videojsPlayer.el().querySelector('video');

    if (!videoElement) {
        alert('ビデオ要素が見つかりません');
        return;
    }

    // Picture-in-Picture APIの対応確認
    if (!document.pictureInPictureEnabled) {
        alert('このブラウザはピクチャーインピクチャーに対応していません');
        return;
    }

    if (videoElement.readyState === 0) {
        alert('動画を読み込んでからピクチャーインピクチャーを使用してください');
        return;
    }

    // 現在PiPモードかどうかを確認
    if (document.pictureInPictureElement) {
        // PiPモードを終了
        document.exitPictureInPicture()
            .then(() => {
                console.log('ピクチャーインピクチャーを終了しました');
            })
            .catch((error) => {
                console.error('PiP終了エラー:', error);
                alert('ピクチャーインピクチャーの終了に失敗しました');
            });
    } else {
        // PiPモードを開始
        videoElement.requestPictureInPicture()
            .then(() => {
                console.log('ピクチャーインピクチャーを開始しました');
            })
            .catch((error) => {
                console.error('PiP開始エラー:', error);
                alert('ピクチャーインピクチャーの開始に失敗しました');
            });
    }
}

// Video.js カスタムプレイヤーのインスタンス管理
let customVideoJSPlayer = null;

// Video.js カスタムプレイヤーの初期化
export async function loadVideoJSCustom(url) {
    const videoElement = document.getElementById('videojs-custom-player');

    // 既存のプレイヤーがあれば破棄
    if (customVideoJSPlayer) {
        customVideoJSPlayer.dispose();
    }

    // Video.js プレイヤーを初期化（コントロールなし）
    customVideoJSPlayer = videojs(videoElement, {
        controls: false,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.5, 2]
    });

    customVideoJSPlayer.ready(() => {
        customVideoJSPlayer.src({
            src: url,
            type: 'application/x-mpegURL'
        });
    });
}

// Video.js カスタム再生/一時停止の切り替え
export function togglePlayVideoJSCustom() {
    const playBtn = document.getElementById('videojs-play-btn');
    const videoElement = customVideoJSPlayer ? customVideoJSPlayer.el().querySelector('video') : null;

    if (!videoElement) return;

    if (videoElement.paused) {
        videoElement.play();
        playBtn.textContent = '⏸️';
    } else {
        videoElement.pause();
        playBtn.textContent = '▶️';
    }
}

// Video.js カスタムミュート/ミュート解除の切り替え
export function toggleMuteVideoJSCustom() {
    const muteBtn = document.getElementById('videojs-mute-btn');
    const volumeSlider = document.getElementById('videojs-volume');
    const videoElement = customVideoJSPlayer ? customVideoJSPlayer.el().querySelector('video') : null;

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

// Video.js カスタム音量設定
export function setVolumeVideoJSCustom(volume) {
    const muteBtn = document.getElementById('videojs-mute-btn');
    const videoElement = customVideoJSPlayer ? customVideoJSPlayer.el().querySelector('video') : null;

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

// Video.js カスタム再生速度設定
export function setSpeedVideoJSCustom(speed) {
    if (customVideoJSPlayer) {
        customVideoJSPlayer.playbackRate(parseFloat(speed));
    }
}

// Video.js カスタムシーク機能
export function seekVideoJSCustom(seconds) {
    if (customVideoJSPlayer) {
        const currentTime = customVideoJSPlayer.currentTime();
        customVideoJSPlayer.currentTime(Math.max(0, currentTime + seconds));
    }
}

// Video.js カスタムサンプル動画をロード
export function loadSampleVideoJSCustom(type) {
    const urlInput = document.getElementById('videojs-custom-url');

    if (type === 'hls') {
        urlInput.value = SAMPLE_URLS.hls;
    } else if (type === 'mp4') {
        urlInput.value = SAMPLE_URLS.mp4;
    }

    loadVideoJSCustom(urlInput.value);
}
