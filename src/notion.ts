export const sendToNotion = ({
  title,
  body,
  url
}: {
  title: string;
  body: string;
  url: string;
}) => {
  const notion_token = process.env.NOTION_TOKEN;
  const database_id = process.env.NOTION_DATABASE_ID;
  const relation_id = process.env.NOTION_PROJECTS_ID;
  console.log("add to notion", title);

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": `Bearer ${notion_token}`,
    "Notion-Version": "2022-06-28"
  };

  UrlFetchApp.fetch("https://api.notion.com/v1/pages", {
    muteHttpExceptions: true,
    method: "post",
    headers: headers,
    payload: JSON.stringify({
      parent: { database_id: database_id },
      properties: {
        タスク名: {
          title: [
            {
              text: {
                content: title
              }
            }
          ]
        },
        // Relation
        Projects: {
          relation: [
            {
              id: relation_id
            }
          ]
        },
        URL: {
          url: url
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                annotations: {
                  bold: false,
                  strikethrough: false,
                  underline: true,
                  italic: false,
                  code: false,
                  color: "default"
                },
                text: { content: "📤 Open in Gmail", link: { type: "url", url: url } }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: body } }]
          }
        }
      ]
    })
  });
};
