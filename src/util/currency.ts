const baseUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

async function getLocalExchangeRate(key: string) {
  const existing = await chrome.storage.local.get(key);
  if (existing && existing.time >= new Date()) return existing.vnd;
  return;
}

async function saveLocalExchangeRate(key: string, value: any) {
  await chrome.storage.local.set({key: {vnd: value, time: new Date()}});
}

export async function getExchangeRate(currency: string) {
  const key = currency.toLocaleLowerCase();
  let vnd = await getLocalExchangeRate(key);
  if (!vnd) {
    const url = baseUrl + key + ".min.json";
    const r = await fetch(url);
    const j = await r.json();
    vnd = j[key].vnd;
    await saveLocalExchangeRate(key, vnd);
  }
  return vnd
}
