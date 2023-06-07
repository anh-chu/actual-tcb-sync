import mapping from "./mapping.json";

function getMappings() {
  const am = {} as { [key: string]: string };
  const gm = {} as { [key: string]: string };
  mapping.forEach((account) => {
    if (account.arrangementIds) {
      account.arrangementIds.forEach((id) => {
        am[id] = account.id;
      });
    }
    if (account.goalIds) {
      account.goalIds.forEach((id) => {
        gm[id] = account.id;
      });
    }
  });
  return { am, gm };
}

export const { am: arrangementMapping, gm: goalMapping } = getMappings();
