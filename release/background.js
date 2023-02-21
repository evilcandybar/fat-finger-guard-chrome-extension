chrome.tabs = chrome.tabs || {};

chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
      
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            
            //Blur content script
            if (changeInfo.url && url.includes('blur.io')) {
                setTimeout(function(){
                chrome.scripting.executeScript({
                    target: {tabId: tabId, allFrames: true},
                    files: ['blur-content-script.js'],
                })}, 1000);
            }
        });
});