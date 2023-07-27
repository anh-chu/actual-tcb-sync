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
  const minDate: string = message.minDate || "";

  getCurrentTab().then((tab) => {
    if (!tab.url?.startsWith(tcb)) {
      sendResponse({ text: "Wrong tab!" });
      return true;
    }
    apiSync(minDate).then(() => {});
  });

  return true;
});
