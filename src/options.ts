// @ts-nocheck
// Saves options to chrome.storage

const handleFileSelect = () => {
  const file = (<HTMLInputElement>document.getElementById("file")).files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const config = JSON.parse(text);
    document?.getElementById("tcbUrl")?.value = config.tcb_url;
    document?.getElementById("actualUrl")?.value = config.actual_url;
    document?.getElementById("actualPassword")?.value = config.actual_password;
    document?.getElementById("actualBudgetId")?.value = config.actual_budget_id;
    document?.getElementById("actualBudgetPassword")?.value =
      config.actual_budget_password;
    document?.getElementById("mappings")?.value = JSON.stringify(
      config.mappings
    );
    return;
  };
  reader.readAsText(file);
  return;
};

const saveOptions = () => {
  const tcbUrl = document?.getElementById("tcbUrl")?.value;
  const actualUrl = document?.getElementById("actualUrl")?.value;
  const actualPassword = document?.getElementById("actualPassword")?.value;
  const actualBudgetId = document?.getElementById("actualBudgetId")?.value;
  const actualBudgetPassword = document?.getElementById(
    "actualBudgetPassword"
  )?.value;
  const mappings = document?.getElementById("mappings")?.value;
  chrome.storage.sync.set(
    {
      tcbUrl,
      actualUrl,
      actualPassword,
      actualBudgetId,
      actualBudgetPassword,
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
      "mappings",
    ],
    (items) => {
      document.getElementById("tcbUrl").value = items?.tcbUrl || "";
      document.getElementById("actualUrl").value = items?.actualUrl || "";
      document.getElementById("actualPassword").value =
        items?.actualPassword || "";
      document.getElementById("actualBudgetId").value =
        items?.actualBudgetId || "";
      document.getElementById("actualBudgetPassword").value =
        items?.actualBudgetPassword || "";
      document.getElementById("mappings").value = items?.mappings || "";
    }
  );
  return;
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document?.getElementById("file")?.addEventListener("change", handleFileSelect);
document?.getElementById("save")?.addEventListener("click", saveOptions);
