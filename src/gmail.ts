export const search = (query: string) => {
  const now = Math.floor(new Date().getTime() / 1000);
  const timeTerm = now - 60 * 60 * 24 * 7; // 1 week ago
  const strTerms = `${query} after:${timeTerm} `;
  console.log("Search: ", strTerms);
  return GmailApp.search(strTerms);
};
