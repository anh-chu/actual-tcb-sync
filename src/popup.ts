// @ts-nocheck

var JSZip = require("jszip");

function setStatus(text: string) {
  const status = document.getElementById("status");
  if (status) status.textContent = text;
}

const sync = async () => {
  setStatus("");

  var minDate = (<HTMLInputElement>document.getElementById("min-date")).value;
  var maxDate = (<HTMLInputElement>document.getElementById("max-date")).value;

  chrome.runtime.sendMessage({
    action: "execute",
    body: {
      minDate,
      maxDate,
    },
  });
};

async function generateZipFile(files: { content: string; fileName: string }[]) {
  var zip = new JSZip();
  files.forEach((file) => zip.file(file.fileName, file.content));
  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

async function downloadAsFile(content: any, fileName: string) {
  const zipFile = await generateZipFile(content);
  const href = URL.createObjectURL(zipFile);
  await chrome.downloads.download({
    url: href,
    filename: fileName,
    saveAs: true,
  });
}

const setDefaults = () => {
  (<HTMLInputElement>document.getElementById("min-date")).value = "";
  (<HTMLInputElement>document.getElementById("max-date")).value = "";
};

document.addEventListener("DOMContentLoaded", setDefaults);
document.getElementById("run")?.addEventListener("click", sync);
document.getElementById("auto-run")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "auto-run",
    minDate: (<HTMLInputElement>document.getElementById("min-date")).value,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "download") return true;
  const fileName = `tcb-export ${new Date().toISOString().slice(0, 10)}.zip`;
  downloadAsFile(message.body, fileName)
    .then(() => setStatus(fileName))
    .catch((err) => setStatus(err));
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "setLastDate") return true;
  document.getElementById("lastSync")?.textContent = message.body;
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "setNewDate") return true;
  document.getElementById("newSync")?.textContent = message.body;
  return true;
});

document.getElementById("fidelity")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "fidelity",
  });
  return true;
});
