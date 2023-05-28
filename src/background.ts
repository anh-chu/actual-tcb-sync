var jsonQuery = require('json-query');
import { Parser } from '@json2csv/plainjs';

const extensions = 'https://developer.chrome.com/docs/extensions';
const tcb = 'https://onlinebanking.techcombank.com.vn/';
const tcb_domain = '.techcombank.com.vn';

async function getArrangements() {
  const url =
    'https://onlinebanking.techcombank.com.vn/api/arrangement-manager/client-api/v2/productsummary/context/arrangements?businessFunction=Product%20Summary&resourceName=Product%20Summary&privilege=view';
  const r = await fetch(url);
  return await r.json();
}

async function getTransactions(
  minDate: string,
  maxDate: string,
  from: number = 0,
  count: number = 200
) {
  const url = `https://onlinebanking.techcombank.com.vn/api/transaction-manager/client-api/v2/transactions?bookingDateGreaterThan=${minDate}&bookingDateLessThan=${maxDate}&from=${from}&size=${count}`;
  const r = await fetch(url);
  return await r.json();
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const flattenObject = function (data: any) {
  var result: any = {};
  function recurse(cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + '[' + i + ']');
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
};

async function execute(
  minDate: string,
  maxDate: string,
  from: number = 0,
  count: number = 1000
) {
  const arrangements = await getArrangements();
  const transactions = await getTransactions(minDate, maxDate, from, count);

  const files: any = [];

  arrangements.forEach(async (arrangement: any) => {
    const group = jsonQuery(`transactions[*arrangementId=${arrangement.id}]`, {
      data: { transactions },
    });
    const originalContent = group.value.map((item: any) => {
      if (item.creditDebitIndicator == 'DBIT') item.transactionAmountCurrency.amount = -item.transactionAmountCurrency.amount;
      if (item.counterPartyAccountNumber) item.description += ` @ ${item.counterPartyAccountNumber}`;
      return item;
    })
    const content = originalContent.map((item: any) => flattenObject(item));
    console.log(content);
    if (content.length) {
      const parser = new Parser({ delimiter: ',' });
      const csv = parser.parse(content);
      console.log(csv);
      const fileName = `${arrangement.productTypeName} - ${arrangement.id}.csv`;
      files.push({ content: csv, fileName });
    }
  });

  chrome.runtime.sendMessage({
    action: 'download',
    body: files,
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != 'execute') return true;

  const tab = getCurrentTab().then((tab) => {
    if (!tab.url?.startsWith(tcb)) {
      sendResponse({ text: 'Wrong tab!' });
      return true;
    }
  });

  execute(message.body.minDate, message.body.maxDate).then(() => {});
  return true;
});
