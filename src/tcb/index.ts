import { getCurrentTab } from "../util/chrome";

let tcb: string;
chrome.storage.sync.get(["tcbUrl", "actualUrl"], (items) => {
  tcb = items.tcbUrl;
});

async function getAccessToken() {
  const activeTab = await getCurrentTab();
  const tabId = activeTab?.id as number;

  function _() {
    try {
      return sessionStorage?.access_token as string;
    } catch (err) {
      console.error("Error occured in getting sessionStorage", err);
    }
  }

  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: _,
  });
  return injectionResults[0]?.result;
}

export async function getArrangements(): Promise<Arrangement[]> {
  const accessToken = await getAccessToken();
  const authHeader = {
    Authorization: `Bearer ${accessToken}`,
  };
  const url = `${tcb}/api/arrangement-manager/client-api/v2/productsummary/context/arrangements?businessFunction=Product%20Summary&resourceName=Product%20Summary&privilege=view`;
  const r = await fetch(url, {
    headers: authHeader,
  });
  return await r.json();
}

export async function getGoals(): Promise<Goal[]> {
  const accessToken = await getAccessToken();
  const authHeader = {
    Authorization: `Bearer ${accessToken}`,
  };
  const url = `${tcb}/api/savings-goal-dis/client-api/v1/savings-goal`;
  const r = await fetch(url, {
    headers: authHeader,
  });
  return await r.json();
}

export async function getTransactions(
  minDate: string,
  maxDate: string,
  from: number = 0,
  count: number = 200
): Promise<Transaction[]> {
  const accessToken = await getAccessToken();
  const authHeader = {
    Authorization: `Bearer ${accessToken}`,
  };
  const url = `${tcb}/api/transaction-manager/client-api/v2/transactions?bookingDateGreaterThan=${minDate}&bookingDateLessThan=${maxDate}&from=${from}&size=${count}`;
  const r = await fetch(url, {
    headers: authHeader,
  });
  return await r.json();
}
