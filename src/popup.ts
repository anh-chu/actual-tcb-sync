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
  chrome.storage.sync.get(["lastSync"], (items) => {
    document.getElementById("lastSync")?.textContent = items.lastSync;
  });
};

document.addEventListener("DOMContentLoaded", setDefaults);
document.getElementById("run")?.addEventListener("click", sync);
document.getElementById("auto-run")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    action: "auto-run",
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action != "download") return true;
  const fileName = `tcb-export ${new Date().toISOString().slice(0, 10)}.zip`;
  console.log(message.body);
  downloadAsFile(message.body, fileName)
    .then(() => setStatus(fileName))
    .catch((err) => setStatus(err));
});
