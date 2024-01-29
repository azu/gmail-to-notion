import { search } from "./gmail";
import { addDoneMailId, getDoneMailIds } from "./storage";
import { sendToNotion } from "./notion";
// @ts-expect-error global
global.main = main;
// @ts-expect-error global
global.createTimeTrigger = createTimeTrigger;

// every 10 minutes to fetch new mails
const FETCH_INTERVAL_MINUTES = 10;
const SEARCH_QUERY = process.env.SEARCH_QUERY;
const searchToNotion = async () => {
  if (!SEARCH_QUERY) {
    throw new Error("SEARCH_QUERY is not set");
  }
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
    const labels = mainThreads.getLabels();
    const labelNames = labels.map(label => label.getName());
    const tags = labelNames.map(labelName => `Gmail::${labelName}`);
    await sendToNotion({ url, title, body, tags });
  }
  const newMailIds = newMails.map(mail => mail.getId());
  addDoneMailId(newMailIds);
  console.log("Save New mail ids: " + newMailIds);
};
const inSentToNotion = async () => {
  const doneMailIds = getDoneMailIds();
  // search in:sent
  const results = search("in:sent");
  console.log("sent result count: " + results.length);
  const newMails = results.filter(result => {
    const id = result.getId();
    return !doneMailIds.some(doneMailId => doneMailId.id === id);
  });
  if (newMails.length === 0) {
    console.log("No new sent mail");
    return;
  }
  console.log("New sent mail threads: " + newMails.length);
  for (const mainThreads of newMails) {
    const message = mainThreads.getMessages()?.[0];
    if (!message) {
      return;
    }
    const url = mainThreads.getPermalink();
    const title = message.getSubject();
    const body = message.getPlainBody();
    const labels = mainThreads.getLabels();
    const labelNames = labels.map(label => label.getName());
    const tags = labelNames.map(labelName => `Gmail:${labelName}`);
    const tagsWithSent = [...tags, "Gmail::in:sent"];
    await sendToNotion({ url, title, body, tags: tagsWithSent });
  }
  const newMailIds = newMails.map(mail => mail.getId());
  addDoneMailId(newMailIds);
  console.log("Save New sent mail ids: " + newMailIds);
};

export async function main() {
  await searchToNotion();
  await inSentToNotion();
}

/**
 * Creates time triggers.
 */
export function createTimeTrigger() {
  ScriptApp.newTrigger("main").timeBased().everyMinutes(FETCH_INTERVAL_MINUTES).create();
}
