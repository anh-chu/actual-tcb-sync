import { execute } from "./execute";
import { apiSync } from "./autorun";
import { getCurrentTab } from "./util/chrome";

let tcb: string;
chrome.storage.sync.get(["tcbUrl", "actualUrl"], (items) => {
  tcb = items.tcbUrl;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "execute") return true;

  getCurrentTab().then((tab: any) => {
    if (!tab.url?.startsWith(tcb)) {
      sendResponse({ text: "Wrong tab!" });
      return true;
    }
    execute(message.body.minDate, message.body.maxDate).then(() => {});
  });

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "auto-run") return true;

  getCurrentTab().then((tab) => {
    if (!tab.url?.startsWith(tcb)) {
      sendResponse({ text: "Wrong tab!" });
      return true;
    }
    apiSync().then(() => {});
  });

  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url?.startsWith(tcb) &&
    changeInfo.status == "complete" &&
    tab.active
  ) {
    apiSync(true).then(() => {});
    return true;
  }
});
