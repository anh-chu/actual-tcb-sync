let actual: string;
let actualPassword: string;
let actualBudgetId: string;
let actualBudgetPassword: string;

chrome.storage.sync.get(
  [
    "tcbUrl",
    "actualUrl",
    "actualPassword",
    "actualBudgetId",
    "actualBudgetPassword",
  ],
  (items) => {
    actual = items.actualUrl;
    actualPassword = items.actualPassword;
    actualBudgetId = items.actualBudgetId;
    actualBudgetPassword = items.actualBudgetPassword;
  }
);

export async function initActual() {
  const url = `${actual}/api/init`;
  const body = JSON.stringify({
    password: actualPassword,
    budgetId: actualBudgetId,
    budgetPassword: actualBudgetPassword,
  });
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
  const res = await r.json();
  return res.token;
}

export async function getAccounts(token: string) {
  const url = `${actual}/api/getAccounts`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await r.json();
}

export async function getLastTransaction(
  token: string,
  accountId?: string
): Promise<{
  data: {
    date: string;
    id: string;
  }[];
}> {
  const raw = {
    q: "transactions",
    filter: accountId
      ? { account: accountId, cleared: true }
      : { cleared: true },
    select: "date",
    orderBy: {
      date: "desc",
    },
    limit: "1",
  };

  const body = JSON.stringify(raw);

  const r = await fetch(`${actual}/api/query`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  return await r.json();
}

export async function importTransactions(
  token: string,
  accountId: string,
  transactions: ActualTransaction[]
) {
  const url = `${actual}/api/importTransactions?paramsInBody=true`;
  const body = JSON.stringify({ _: [accountId, transactions] });
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
  return await r.json();
}
