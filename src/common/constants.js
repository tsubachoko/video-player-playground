// サンプル動画URL
export const SAMPLE_URLS = {
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hls: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    dash: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
};

// ビデオタイプを判定
export function getVideoType(url) {
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    if (url.includes('.mpd')) return 'application/dash+xml';
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    return 'video/mp4'; // デフォルト
}
