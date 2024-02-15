// @ts-nocheck
// Saves options to chrome.storage
const saveOptions = () => {
  const tcbUrl = document?.getElementById("tcbUrl")?.value;
  const actualUrl = document?.getElementById("actualUrl")?.value;
  const actualPassword = document?.getElementById("actualPassword")?.value;
  const actualBudgetId = document?.getElementById("actualBudgetId")?.value;
  const actualBudgetPassword = document?.getElementById(
    "actualBudgetPassword"
  )?.value;
  const exchangeRateKey = document?.getElementById("exchangeRateKey")?.value;
  const mappings = document?.getElementById("mappings")?.value;

  chrome.storage.sync.set(
    {
      tcbUrl,
      actualUrl,
      actualPassword,
      actualBudgetId,
      actualBudgetPassword,
      exchangeRateKey,
      mappings,
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      if (status) {
        status.textContent = "Options saved";
        setTimeout(() => {
          status.textContent = "";
        }, 750);
      }
    }
  );
  chrome.runtime.reload();
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    [
      "tcbUrl",
      "actualUrl",
      "actualPassword",
      "actualBudgetId",
      "actualBudgetPassword",
      "exchangeRateKey",
      "mappings",
    ],
    (items) => {
      document.getElementById("tcbUrl").value = items.tcbUrl;
      document.getElementById("actualUrl").value = items.actualUrl;
      document.getElementById("actualPassword").value = items.actualPassword;
      document.getElementById("actualBudgetId").value = items.actualBudgetId;
      document.getElementById("actualBudgetPassword").value =
        items.actualBudgetPassword;
      document.getElementById("exchangeRateKey").value = items.exchangeRateKey;
      document.getElementById("mappings").value = items.mappings;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document?.getElementById("save")?.addEventListener("click", saveOptions);
