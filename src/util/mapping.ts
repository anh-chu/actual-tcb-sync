export async function getMappings() {
  const am = {} as { [key: string]: string };
  const gm = {} as { [key: string]: string };
  const mappingString = (await chrome.storage.sync.get(["mappings"])).mappings;
  if (mappingString && typeof mappingString !== "undefined") {
    const mapping = JSON.parse(mappingString);
    mapping.forEach((account: any) => {
      if (account.arrangementIds) {
        account.arrangementIds.forEach((id: string) => {
          am[id] = account.id;
        });
      }
      if (account.goalIds) {
        account.goalIds.forEach((id: string) => {
          gm[id] = account.id;
        });
      }
    });
  }
  return { am, gm };
}
