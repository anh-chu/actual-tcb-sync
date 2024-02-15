import { initActual, getLastTransaction, importTransactions } from "./actual";
import { getArrangements, getTransactions } from "./tcb";
import { splitAndProcessTransaction } from "./tcb/process";
import { sendMessage } from "./util/chrome";

export async function apiSync(startDate: string = "") {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const maxDate = tomorrow.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const token = await initActual();
  const lastTransactions = await getLastTransaction(token);

  sendMessage({
    action: "setLastDate",
    body: lastTransactions.data[0].date,
  }).then(() => {});

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

  const latestTransaction = await getLastTransaction(token);
  await sendMessage({
    action: "setNewDate",
    body: latestTransaction.data[0].date,
  }).then(() => {});
}
