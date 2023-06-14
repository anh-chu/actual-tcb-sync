import {
  initActual,
  getAccounts,
  getLastTransaction,
  importTransactions,
} from "./actual";
import { getArrangements, getTransactions } from "./tcb";
import { splitAndProcessTransaction } from "./tcb/process";

export async function apiSync(auto: boolean = false, startDate: string = "") {
  const maxDate = new Date().toISOString().split("T")[0];
  if (
    auto &&
    maxDate == (await chrome.storage.sync.get(["lastAutoSync"])).lastAutoSync
  )
    return;
  const token = await initActual();
  const arrangements = await getArrangements();
  // const goals = await getAccounts(token);
  const lastTransactions = await getLastTransaction(token);

  let minDate = startDate ? startDate : lastTransactions.data[0].date;
  // if minDate is larger than maxDate, use maxDate
  if (minDate > maxDate) minDate = maxDate;
  const transactions = await getTransactions(minDate, maxDate);
  const actualArrangements = await splitAndProcessTransaction(
    transactions,
    arrangements,
    true
  );
  for (const arrangement of actualArrangements) {
    const r = await importTransactions(
      token,
      arrangement.accountId,
      arrangement.transactions
    );
  }
  if (auto) await chrome.storage.sync.set({ lastAutoSync: maxDate });
  await chrome.storage.sync.set({ lastSync: maxDate });
}
