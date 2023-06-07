let tcb: string;
chrome.storage.sync.get(["tcbUrl", "actualUrl"], (items) => {
  tcb = items.tcbUrl;
});

export async function getArrangements(): Promise<Arrangement[]> {
  const url = `${tcb}/api/arrangement-manager/client-api/v2/productsummary/context/arrangements?businessFunction=Product%20Summary&resourceName=Product%20Summary&privilege=view`;
  const r = await fetch(url);
  return await r.json();
}

export async function getGoals(): Promise<Goal[]> {
  const url = `${tcb}/api/savings-goal-dis/client-api/v1/savings-goal`;
  const r = await fetch(url);
  return await r.json();
}

export async function getTransactions(
  minDate: string,
  maxDate: string,
  from: number = 0,
  count: number = 200
): Promise<Transaction[]> {
  const url = `${tcb}/api/transaction-manager/client-api/v2/transactions?bookingDateGreaterThan=${minDate}&bookingDateLessThan=${maxDate}&from=${from}&size=${count}`;
  const r = await fetch(url);
  return await r.json();
}
