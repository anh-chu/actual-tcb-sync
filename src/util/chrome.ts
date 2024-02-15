export async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function sendMessage(message: any) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}
