import { initActual, getLastTransaction, importTransactions } from "./actual";
import { getArrangements, getTransactions } from "./tcb";
import { splitAndProcessTransaction } from "./tcb/process";

export async function apiSync(auto: boolean = false, startDate: string = "") {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const maxDate = tomorrow.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  // if (
  //   auto &&
  //   maxDate == (await chrome.storage.sync.get(["lastAutoSync"])).lastAutoSync
  // )
  //   return;
  const token = await initActual();
  const lastTransactions = await getLastTransaction(token);

  chrome.runtime.sendMessage({
    action: "setLastDate",
    body: lastTransactions.data[0].date,
  });

  const arrangements = await getArrangements();
  // const goals = await getAccounts(token);

  let minDate = startDate ? startDate : lastTransactions.data[0].date;
  // if minDate is larger than maxDate, use today
  if (minDate > maxDate) minDate = today;

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
}
