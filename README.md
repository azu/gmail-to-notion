# Gmail to Notion

定期的にGmailを検索し、検索結果をNotionに記録するGoogle Apps Script.

## ユースケース

- 特定のラベルをつけたメールを検索し、その結果をNotionに記録する

## Setup

1. claspでGoogle Apps Scriptのプロジェクトを作成する

```bash
npx clasp login
npx clasp create --rootDir ./dist
cp appsscript.json ./dist/
touch .env
```

2. `.env`ファイルを作成し、以下のように設定する
   - [`op run`](https://developer.1password.com/docs/cli/reference/commands/run)で読み込んで利用することを想定している

```
NOTION_TOKEN="secret_XXXXXXXXXXX"
NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxx"
NOTION_PROJECTS_ID="xxxxxxxxxxxxxxxxxxxxx"
```

3. `npm run deploy`でデプロイする

```sh
npm run deploy
```

## 仕組み

- 検索して、その結果をNotionに記録
- 一度記録したものは、再度記録しない

