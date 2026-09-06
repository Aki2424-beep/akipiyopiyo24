# akipiyopiyo24

個人用のESS・業界・仕事の学習ツールです。会社・事業の解説、充放電シミュレーション、仕事体験、ESS経営ゲームを含みます。

表示名・プロジェクト名・推奨リポジトリ名は **akipiyopiyo24** です。教材本文には学習対象である企業名と出典を残しています。企業の公式教材・公式ゲームではありません。経営ゲームの数値・案件・会話は学習用の仮定です。

## GitHub Pagesで公開する

1. GitHubで **akipiyopiyo24** という名前のリポジトリを作ります。GitHub FreeでPagesを利用する場合はPublicを選びます。
2. このフォルダーの**中身**を、リポジトリの最上位へ入れます。`package.json` と `.github/workflows/pages.yml` が最上位にあることを確認してください。外側のakipiyopiyo24フォルダーをさらに入れないでください。
3. mainブランチへアップロードします。GitHub DesktopでこのフォルダーをリポジトリにしてPublishすると、`.github`も一緒に送れます。
4. GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
5. **Actions → Publish akipiyopiyo24 → Run workflow** でmainを指定します。以後はmainへ変更をpushすると自動更新します。
6. 完了後、Settings → Pagesに表示されるURLから開きます。

想定URL：`https://<GitHubユーザー名>.github.io/akipiyopiyo24/`
ゲーム：`https://<GitHubユーザー名>.github.io/akipiyopiyo24/game/`

公開作業はご自身のGitHubアカウントで行ってください。この一式を作成した時点では、GitHubへのアップロード・公開は実施していません。

GitHub Pagesは公開Webサイトです。「個人用」は用途を表し、閲覧を本人限定にする仕組みは含んでいません。個人の履歴書・秘密情報等を追加して公開しないでください。

参考：[GitHub Pagesの公開元設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[カスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## パソコンで確認する

Node.js 24を使用します。

```sh
npm ci
npm run dev
```

表示されたlocalhostのURLに `/akipiyopiyo24/` を付けて開きます。ゲームは `/akipiyopiyo24/game/` です。

```sh
npm test
npx tsc --noEmit
npm run build
npm run preview
```

`dist`に静的サイトが作られます。`index.html`を直接ダブルクリックするのではなく、開発サーバーまたはプレビューで確認してください。

## リポジトリ名を変更する場合

現在は `akipiyopiyo24` のプロジェクトサイト向けです。別名・独自ドメイン・`<ユーザー名>.github.io`というルートリポジトリへ変更する場合は、`vite.config.ts`のbaseと、`index.html`、`app/page.tsx`、`app/game/page.tsx`の `/akipiyopiyo24/` を新しいパスへ合わせてください。

## データとセーブ

- 教材：`data/learning.json`
- 仕事体験：`data/work-experience.json`
- シミュレーション：`lib/ess-model.ts`
- 経営ゲーム：`lib/ess-game.ts`
- ゲームの進行は、そのブラウザのlocalStorageに保存します。
- 以前のSites版とはドメインが異なるため、セーブは自動移行されません。
- ソース内の教材の企業名は、ファイル名・サイト表示名とは区別して扱っています。

## 公開用一式について

Sitesの管理ID・管理設定、Git履歴、認証情報、node_modulesは含めていません。APIキーや外部サーバーは不要です。既存の本人限定Sites版は変更していません。

街マップはこの学習ツール用に生成したオリジナル画像です。参考ゲームのスクリーンショットやロゴは収録していません。

検証：静的ビルド、型チェック、ゲーム・電力収支の10テストを実施。実際のGitHub Actions実行は、ご自身のリポジトリで公開する際に行われます。
