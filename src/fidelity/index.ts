import { getCurrentTab } from "../util/chrome";

let fidelity: string;
chrome.storage.sync.get(["fidelityUrl", "actualUrl"], (items) => {
  fidelity = items.fidelityUrl;
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

export async function getBalances(): Promise<Balances> {
  const myHeaders = new Headers();
  myHeaders.append("accept", "*/*");
  myHeaders.append("accept-language", "en-US,en");
  myHeaders.append("content-type", "application/json");

  const graphql = JSON.stringify({
    query:
      "query GetContext {\n  getContext {\n    person {\n      assets {\n        acctNum\n        preferenceDetail {\n          name\n        }\n        gainLossBalanceDetail {\n          totalMarketVal\n        }\n      }\n    }\n  }\n}\n",
    variables: {},
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql,
  };

  const url = `${fidelity}/ftgw/digital/portfolio/api/graphql?ref_at=portsum`;
  const r = await fetch(url, requestOptions);
  return await r.json();
}
