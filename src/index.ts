import { search } from "./gmail";
import { addDoneMailId, getDoneMailIds } from "./storage";
import { sendToNotion } from "./notion";
// @ts-expect-error global
global.main = main;
// @ts-expect-error global
global.createTimeTrigger = createTimeTrigger;

// every 10 minutes to fetch new mails
const FETCH_INTERVAL_MINUTES = 10;
const SEARCH_QUERY = `{label:GTD/Action Required OR label:GTD/Waiting OR label:GTD/Read Later}`;

export async function main() {
  const doneMailIds = getDoneMailIds();
  const results = search(SEARCH_QUERY);
  console.log("search result count: " + results.length);
  const newMails = results.filter(result => {
    const id = result.getId();
    return !doneMailIds.some(doneMailId => doneMailId.id === id);
  });
  if (newMails.length === 0) {
    console.log("No new mail");
    return;
  }
  console.log("New mail threads: " + newMails.length);
  for (const mainThreads of newMails) {
    const message = mainThreads.getMessages()?.[0];
    if (!message) {
      return;
    }
    const url = mainThreads.getPermalink();
    const title = message.getSubject();
    const body = message.getPlainBody();
    await sendToNotion({ url, title, body });
  }
  const newMailIds = newMails.map(mail => mail.getId());
  addDoneMailId(newMailIds);
  console.log("Save New mail ids: " + newMailIds);
}

/**
 * Creates time triggers.
 */
export function createTimeTrigger() {
  ScriptApp.newTrigger("main").timeBased().everyMinutes(FETCH_INTERVAL_MINUTES).create();
}
