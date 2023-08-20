# Gmail to Notion

定期的にGmailを検索し、検索結果をNotionに記録する

## ユースケース

- 特定のラベルをつけたメールをNotionに記録する

## 設定

```
NOTION_TOKEN="secret_XXXXXXXXXXX"
NOTION_DATABASE_ID="xxxxxxxxxxxxxxxxxxxxx"
NOTION_PROJECTS_ID="xxxxxxxxxxxxxxxxxxxxx"
```

- `.env` に記録する
- `op run`で読み込んで利用する

## 仕組み

- 検索して、その結果をNotionに記録
- 一度記録したものは、再度記録しない
- <https://www.notion.so/Gmail-f1151e0266594e8aae47fe2b30dad98f?pvs=4> に紐付けられる
