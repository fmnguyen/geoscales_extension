var activeTabs = {};

chrome.tabs.executeScript(null, {file: "js/jquery-2.2.3.js"});
chrome.tabs.executeScript(null, {file: "js/leaflet.js"});
chrome.tabs.executeScript(null, {file: "js/leaflet-src.js"});
chrome.tabs.executeScript(null, {file: "js/Leaflet.label.js"});
chrome.tabs.executeScript(null, {file: "js/jquery.tooltipster.js"});
chrome.tabs.executeScript(null, {file: "js/d3.js"});
chrome.tabs.executeScript(null, {file: "js/topojson.js"});
chrome.tabs.executeScript(null, {file: "content.js"});

/**
 * Forces the background to run different actions dependent on messages received
 * @param  {[string]}  message.tabAction , some string that changes the switch that runs
 * @case   {[string]}  addTab            , Adds the active tabId to the list of tabs the extension is running on 
 * @case   {[string]}  checkTabActive    , Checks if the requested tabId is in the list of tabs the extension is active on
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.tabAction) {
    case "addTab":
      chrome.tabs.get(message.tabId, function(tab) {
        if(!activeTabs[tab.id]){
          activeTabs[tab.id] = tab;
          console.log('Adding active tab: ' + tab.id);
        }
        console.log(activeTabs);
      });
      break;
    case "checkTabActive":
      chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        sendResponse({ tabActive: activeTabs[tab[0].id]});
      });
      break;
    default: 
      return;
  }
});

/**
 * Adds a listener to everytime a tab is navigated to (activated)
 * If the tab is already active with the extension, changes the icon to an active form
 * @param  {[object]} activeInfo, object with two fields: int tabId and int windowId
 *    for more info: https://developer.chrome.com/extensions/tabs#event-onActivated
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log(activeInfo);
  if(activeTabs[activeInfo.tabId]) {
    chrome.browserAction.setIcon({path: "images/icon.png", tabId:tab[0].id});
  } 
  else {
    chrome.storage.sync.get(function(data){
      if(data) {
        if('lon' in data && 'lat' in data && 'location' in data) { //if all data exists in object
          chrome.tabs.query({active: true, currentWindow: true}, function(tab){
            chrome.tabs.sendMessage(tab[0].id, { startContent: true, lat: data.lat, lon: data.lon});
          });
        }
      }
    });
    chrome.browserAction.setIcon({path: "images/icon-inactive.png", tabId:tab[0].id});
  }
});

/**
 * Checks the cache to check if data exists, and starts the extension without opening the pop-up
 */
chrome.storage.sync.get(function(data){
    if(data) {
      if('lon' in data && 'lat' in data && 'location' in data) { //if all data exists in object
        chrome.tabs.query({active: true, currentWindow: true}, function(tab){
          chrome.tabs.sendMessage(tab[0].id, { startContent: true, lat: data.lat, lon: data.lon});
        });
      }
    }
});