let accessKey: string;
chrome.storage.sync.get(["exchangeRateKey"], (items) => {
  accessKey = items.exchangeRateKey;
});

async function getExchangeRates() {
  // check if exchangeRate is in extension local storage and return if exchangeRateDate is today
  // if not, get exchangeRate from exchangeratesapi.io
  if ((await chrome.storage.local.get("exchangeRate"))?.exchangeRateDate) {
    return (await chrome.storage.local.get("exchangeRate"))?.rates;
  }
  const url = `https://api.apilayer.com/fixer/latest?symbols=USD,EUR,VND&access_key=${accessKey}`;
  const r = await fetch(url);
  const j = await r.json();
  chrome.storage.local.set({
    exchangeRate: { rates: j, exchangeRateDate: Date.now() },
  });
  return j;
}

// convert USD to VND using exchangeratesapi.io
export async function getUSDtoVNDrate() {
  const j = await getExchangeRates();
  const e = j.rates.VND / j.rates.USD;
  return e;
}

// convert USD to VND using exchangeratesapi.io
export async function getEURtoVNDrate() {
  const j = await getExchangeRates();
  const e = j.rates.VND / j.rates.EUR;
  return e;
}
