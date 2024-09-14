import { downloadTcbNoSync } from "./sync/downloadTcbNoSync";
import { apiSync } from "./sync/sync";
import { getCurrentTab } from "./util/chrome";
import { fidelitySync } from "./sync/sync";

let tcb: string;
let fidelity: string;

chrome.storage.sync.get(["tcbUrl", "fidelityUrl"], (items) => {
  tcb = items.tcbUrl;
  fidelity = items.fidelityUrl;
});

function runFidelitySync() {
  return getCurrentTab().then((tab) => {
    if (!tab.url?.startsWith(fidelity)) throw new Error("Wrong tab!");
    fidelitySync().then(() => {});
  });
}

function runTcbSync() {
  return getCurrentTab().then((tab) => {
    if (!tab.url?.startsWith(tcb)) throw new Error("Wrong tab!");
    apiSync().then(() => {});
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "execute": {
      getCurrentTab().then((tab: any) => {
        if (!tab.url?.startsWith(tcb)) {
          sendResponse({ text: "Wrong tab!" });
          return true;
        }
        downloadTcbNoSync(message.body.minDate, message.body.maxDate).then(
          () => {}
        );
      });
      break;
    }
    case "auto-run": {
      const minDate: string = message.minDate;
      runTcbSync().then(() =>
        chrome.storage.local.set({ lastTcbSync: new Date().toISOString() })
      );
      break;
    }
    case "fidelity": {
      runFidelitySync().then(() =>
        chrome.storage.local.set({ lastFidelitySync: new Date().toISOString() })
      );
      break;
    }
  }
});

// sync Fidelity automatically on tab change
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url?.startsWith(fidelity)) {
      chrome.storage.local.get(["lastFidelitySync"], (items) => {
        const lastFidelitySync = items.lastFidelitySync;
        if (
          lastFidelitySync &&
          new Date().getTime() - new Date(lastFidelitySync).getTime() <
            4 * 60 * 60 * 1000
        )
          return;
        runFidelitySync().then(() =>
          chrome.storage.local.set({
            lastFidelitySync: new Date().toISOString(),
          })
        );
      });
    }
  });
});

//sync TCB automatically on tab change
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url?.startsWith(tcb)) {
      chrome.storage.local.get(["lastTcbSync"], (items) => {
        const lastTcbSync = items.lastTcbSync;
        if (
          lastTcbSync &&
          new Date().getTime() - new Date(lastTcbSync).getTime() <
            4 * 60 * 60 * 1000
        )
          return;
        runTcbSync().then(() =>
          chrome.storage.local.set({ lastTcbSync: new Date().toISOString() })
        );
      });
    }
  });
});
