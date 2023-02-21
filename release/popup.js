setTimeout(() => {
    chrome.storage.sync.get("blurAboveInput", function(result) {
    if (result.blurAboveInput) {
      document.getElementById('blur-above-input').value = result.blurAboveInput;
    } else {
      document.getElementById('blur-above-input').value = 10;
    }
  });

  chrome.storage.sync.get("blurBelowInput", function(result) {
    if (result.blurBelowInput) {
      document.getElementById('blur-below-input').value = result.blurBelowInput;
    } else {
      document.getElementById('blur-below-input').value = 10;
    }
  });

  document.getElementById('blur-above-input').addEventListener('input', () => {
    let value = document.getElementById('blur-above-input').value
    if (!Number.isNaN(value) && +value > 0 && /^\d+$/.test(value)) {
      if (+value > 0) {
          chrome.storage.sync.set({ "blurAboveInput": +value });
      } else {
        document.getElementById('blur-above-input').value = 0;
        value = 0;
      }
    } else {
      value = 0;
    }

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "setBlurAboveInput", value: +value });
    });
  });

  document.getElementById('blur-below-input').addEventListener('input', () => {
    let value = document.getElementById('blur-below-input').value
    if (!Number.isNaN(value) && +value > 0 && /^\d+$/.test(value)) {
      if (+value > 0) {
          chrome.storage.sync.set({ "blurBelowInput": +value });
      } else {
        document.getElementById('blur-below-input').value = 0;
        value = 0;
      }
    } else {
      value = 0;
    }

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "setBlurBelowInput", value: +value });
    });
  });

}, 1);
