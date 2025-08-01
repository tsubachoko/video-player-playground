# Video Player Playground

Video.js、HLS.js、Shaka Playerの3つの動画プレイヤーライブラリをまとめて試せるデモ環境です。

## 🚀 クイックスタート

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 📋 機能

### Video.js
- HTML5ビデオプレイヤーのスタンダード
- 豊富なプラグインエコシステム
- カスタマイズ性が高い
- MP4、WebMなどの基本的な動画フォーマットに対応

### HLS.js
- HTTP Live Streaming (HLS) 対応
- アダプティブストリーミング
- m3u8プレイリストファイルの再生
- 品質レベルの自動切り替え

### Shaka Player
- Googleが開発したアダプティブストリーミングプレイヤー
- DASH、HLS両方に対応
- 高機能なストリーミング機能
- 詳細な品質制御

## 🎯 使い方

1. 各プレイヤーセクションで「サンプル動画」ボタンをクリックしてテスト動画を再生
2. または、独自の動画URLを入力してロード
3. 各プレイヤーの特徴や機能を比較

## 🔧 対応フォーマット

- **Video.js**: MP4, WebM, OGV
- **HLS.js**: HLS (.m3u8)
- **Shaka Player**: DASH (.mpd), HLS (.m3u8)

## 📦 使用ライブラリ

- [Video.js](https://videojs.com/) - HTML5動画プレイヤー
- [HLS.js](https://github.com/video-dev/hls.js/) - HLSストリーミング
- [Shaka Player](https://github.com/shaka-project/shaka-player) - アダプティブストリーミング
- [Vite](https://vitejs.dev/) - ビルドツール

## 🛠️ 開発

```bash
# 開発サーバー
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## 📝 注意事項

- サンプル動画は外部URLを使用しています
- CORS制限により、一部の動画URLは再生できない場合があります
- ブラウザによってサポートされる機能が異なります
