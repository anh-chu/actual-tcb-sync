const extensions = 'https://developer.chrome.com/docs/extensions'
const tcb = 'https://onlinebanking.techcombank.com.vn/'
const tcb_domain = '.techcombank.com.vn'

async function getArrangements() {
  const url = 'https://onlinebanking.techcombank.com.vn/api/arrangement-manager/client-api/v2/productsummary/context/arrangements?businessFunction=Product%20Summary&resourceName=Product%20Summary&privilege=view';
  const r = await fetch(url);
  console.log(await r.json())
}

async function getTransactions(minDate: string, maxDate: string, from: number, count: number) {
  const url = `https://onlinebanking.techcombank.com.vn/api/transaction-manager/client-api/v2/transactions?bookingDateGreaterThan=${minDate}&bookingDateLessThan=${maxDate}&from=${from}&size=${count}`;
  const r = await fetch(url);
  console.log(await r.json())
}

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (tab.url?.startsWith(extensions) || tab.url?.startsWith(tcb)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    await getArrangements();
    // await getTransactions();
    const l = await getLastActualTransactions();
    console.log(l);
  }});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.action.setBadgeText({
    text: "OFF",
  });
});
