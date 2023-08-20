type SaveMail = {
  timestamp: number;
  id: string;
};
const STORAGE_SIZE_LIMIT = 1000;
export const getDoneMailIds = (): SaveMail[] => {
  try {
    // Get the value for the user property 'DISPLAY_UNITS'.
    const userProperties = PropertiesService.getUserProperties();
    const sentMailIds = userProperties.getProperty("SENT_MAILS");
    return sentMailIds ? JSON.parse(sentMailIds) : [];
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};
export const addDoneMailId = (mailIds: string[]): void => {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const sentMailIds = getDoneMailIds();
    mailIds.forEach(mailId => {
      sentMailIds.push({
        timestamp: Date.now(),
        id: mailId
      });
    });
    if (sentMailIds.length > STORAGE_SIZE_LIMIT) {
      // slice the oldest 1000 mails
      userProperties.setProperty(
        "SENT_MAILS",
        JSON.stringify(sentMailIds.slice(-STORAGE_SIZE_LIMIT))
      );
    } else {
      userProperties.setProperty("SENT_MAILS", JSON.stringify(sentMailIds));
    }
  } catch (err: unknown) {
    console.log(err);
  }
};
