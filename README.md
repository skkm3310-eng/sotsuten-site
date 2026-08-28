# 卒業展示サイト(Astro + microCMS + Cloudflare Pages)

構成: ページ本体はAstroで静的生成。News/Blogの記事だけmicroCMSで管理し、
記事を公開するとWebhook経由でCloudflare Pagesが自動再ビルドして反映される。

## 1. ローカルで動かす

```bash
npm install
npm run dev   # http://localhost:4321
```

.envが無い状態ではサンプルデータで動きます(デザイン作業を先に進められます)。

## 2. microCMSの設定

1. https://microcms.io/ でサービスを作成(Hobbyプラン=無料のまま)
2. APIを2つ作成する(**エンドポイント名とフィールドIDは下記と完全一致させること**)

### API: news(お知らせ) — 形式: リスト
| フィールドID | 表示名 | 種類 |
|---|---|---|
| title | タイトル | テキストフィールド |
| category | カテゴリ | セレクトフィールド(複数選択オフ推奨。値の例: お知らせ / メディア掲載 / 更新) |
| body | 本文 | リッチエディタ |

### API: blog(ブログ) — 形式: リスト
| フィールドID | 表示名 | 種類 |
|---|---|---|
| title | タイトル | テキストフィールド |
| category | カテゴリ | セレクトフィールド(値の例: 制作日記 / 展示のこと / お知らせ) |
| thumbnail | サムネイル | 画像(任意) |
| body | 本文 | リッチエディタ |

3. `.env.example` をコピーして `.env` を作り、サービスIDとAPIキーを記入

```bash
cp .env.example .env
```

`npm run dev` し直すと実際の記事が表示されます。

## 3. GitHub → Cloudflare Pagesで公開する

1. GitHubに新規リポジトリを作り、このプロジェクトをpush
2. Cloudflareダッシュボード → Workers & Pages → Pages → 「Gitに接続」
3. リポジトリを選び、ビルド設定:
   - フレームワークプリセット: **Astro**
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
4. 環境変数に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を追加(本番・プレビュー両方)
5. デプロイ実行 → `xxx.pages.dev` のURLで公開される

## 4. 記事公開→自動反映(Webhook)の設定

1. Cloudflare Pages → 該当プロジェクト → 設定 → ビルド → **デプロイフック**を作成し、URLをコピー
2. microCMS → news APIの「API設定 → Webhook → カスタム通知」にそのURLを登録
3. blog APIにも同じWebhookを登録

これで、microCMSで「公開」を押すたびに自動で再ビルドされ、数分でサイトに反映されます。

## 5. 独自ドメイン

1. Cloudflare → ドメイン登録(Registrar)で取得(または他社で取得してCloudflareにDNS移管)
2. Pagesプロジェクト → カスタムドメイン → ドメインを追加

## 日々の運用

- **News/Blogを書く**: microCMSの管理画面で記事を書いて公開するだけ(コード不要)
- **作品・出展者を足す**: `src/content/works/` にMarkdownを1ファイル追加し、
  画像を `public/works/` に置いてpush(pushでも自動デプロイされます)
- **画像は圧縮してからアップ**(Hobbyプランは転送量20GB/月。目安: 1枚200〜500KB)

## デザインを差し替える場所

- 色・フォント・余白: `src/styles/tokens.css`(ここだけで全体が変わる)
- サイト名・OGP・会期情報: `src/layouts/Base.astro` と各ページのTODOコメント
- OGP画像: `public/ogp.png` を配置(1200x630px)

## 公開前チェック(最低限)

- [ ] `astro.config.mjs` の `site` を本番URLに変更(OGPの絶対URLに使われる)
- [ ] サイト名・説明文・会期・住所などのTODOをすべて実データに置換
- [ ] `public/ogp.png` を配置し、SNSでシェアプレビューを確認
- [ ] スマホ実機で全ページ確認
- [ ] フォーム送信テスト(自分宛てに届くか)
