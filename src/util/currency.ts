let accessKey: string;
chrome.storage.sync.get(["exchangeRateKey"], (items) => {
  accessKey = items.exchangeRateKey;
});

// convert USD to VND using exchangeratesapi.io
export async function getUSDtoVNDrate() {
  // check if exchangeRate is in extension local storage and return if exchangeRateDate is today
  // if not, get exchangeRate from exchangeratesapi.io
  if ((await chrome.storage.local.get("exchangeRate"))?.exchangeRateDate) {
    return (await chrome.storage.local.get("exchangeRate"))?.rate;
  }
  const url = `http://data.fixer.io/api/latest?symbols=USD,VND&access_key=${accessKey}`;
  const r = await fetch(url);
  const j = await r.json();
  const e = j.rates.VND / j.rates.USD;
  chrome.storage.local.set({
    exchangeRate: { rate: e, exchangeRateDate: Date.now() },
  });
  return e;
}
