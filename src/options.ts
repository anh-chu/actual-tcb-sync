// Saves options to chrome.storage
const saveOptions = () => {
    var actualUrl = (<HTMLInputElement>document.getElementById('actual-url')).value;
    var actualPassword = (<HTMLInputElement>document.getElementById('actual-password')).value;
  
    chrome.storage.sync.set(
      { actualUrl, actualPassword },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        if (status) {
            status.textContent = 'Saved.';
            setTimeout(() => {
              status.textContent = '';
            }, 750);
        }
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { actualUrl: "", actualPassword: "" },
      (items) => {
        (<HTMLInputElement>document.getElementById('actual-url')).value = items.actualUrl;
        (<HTMLInputElement>document.getElementById('actual-password')).value = items.actualPassword;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save')?.addEventListener('click', saveOptions);
  