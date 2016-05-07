/**
 * Forces the background to run different actions dependent on messages received
 * @param  {[string]}  message.tabAction , some string that changes the switch that runs
 * @case   {[string]}  addTab            , Adds the active tabId to the list of tabs the extension is running on 
 * @case   {[string]}  checkTabActive    , Checks if the requested tabId is in the list of tabs the extension is active on
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.tabAction) {

    case "addTab":
      chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        var activeTabs;
        // chrome.storage.sync.get( function(data) {
        //   console.log(data)
        //   activeTabs = data.activeTabs;
        //   if(!activeTabs[tab[0].id]) {
        //     activeTabs[tab[0].id] = true;
        //     chrome.storage.sync.set({
        //       'activeTabs': JSON.stringify(activeTabs)
        //     }, function() {
        //       console.log('Saved the current tab');
        //     });
        //   } else {
        //     console.log("This tab is already listed as active")
        //   }
        // });
      });
      break;

    case "checkTabActive":
      chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
        chrome.storage.sync.get(function(data) {
          console.log(data.activeTabs);
          activeTabs = JSON.parse(data.activeTabs);
          sendResponse({ tabActive: !activeTabs[tab[0].id]});
          console.log(data.activeTabs);
        });
      });
      break;

    case "completeHighlight":
      chrome.tabs.query({active:true, currentWindow:true}, function(tab) {
        chrome.browserAction.setIcon({path: "images/icon.png", tabId:tab[0].id});
      });
      break;

    default: 
      console.log('Error in switch')
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
  console.log('activated')
  // if(activeTabs[activeInfo.tabId]) {
  //   chrome.browserAction.setIcon({path: "images/icon.png", tabId:activeInfo.tabId});
  //   console.log('check icon after activated')
  // } 
  // else {
  //   chrome.storage.sync.get(function(data){
  //     if(data) {
  //       if('lon' in data && 'lat' in data && 'location' in data) { //if all data exists in object
  //         console.log('sending message after activated')
  //         chrome.tabs.sendMessage(activeInfo.tabId, { startContent: true, lat: data.lat, lon: data.lon });
  //       }
  //     }
  //   });
  //   chrome.browserAction.setIcon({path: "images/icon-inactive.png", tabId:activeInfo.tabid});
  // }
});

/**
 * Adds a listener to everytime a tab is updated
 * If the tab is already active with the extension, changes the icon to an active form
 * @param  {[object]} activeInfo, object with two fields: int tabId and int windowId
 *    for more info: https://developer.chrome.com/extensions/tabs#event-onActivated
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(changeInfo == 'loading') {
    chrome.browserAction.setIcon({path: "images/icon-inactive.png", tabId:tabId});
  }
  else if(changeInfo == 'complete') {
    var activeTabs;
    chrome.storage.sync.get(function(data) {
      activeTabs = data.activeTabs;
      if(activeTabs[tabId] && 'lon' in data && 'lat' in data && 'location' in data) {
        chrome.browserAction.setIcon({path: "images/icon.png", tabId:tabId});
        chrome.tabs.query({active: true, currentWindow: true}, function(tab){
          chrome.tabs.sendMessage(tab[0].id, { startContent: true, lat: data.lat, lon: data.lon});
        });
        console.log('check icon after updated')
      } 
    });
  }
});

chrome.tabs.onRemoved.addListener( function(tabId, removeInfo){
  chrome.storage.sync.get(function(data) {
    activeTabs = data.activeTabs;
    delete activeTabs[tabId];
    activeTabs = JSON.stringify(activeTabs);
    chrome.storage.sync.set({
      'activeTabs': activeTabs
    }, function() {
      console.log('deleted a tab');
    });
  });
});

chrome.tabs.onReplaced.addListener( function(newTabId, oldTabId) {
  chrome.storage.sync.get(function(data) {
    activeTabs = data.activeTabs;
    if(activeTabs[oldTabId]) activeTabs[newTabId] = true;
    delete activeTabs[oldTabId];
    activeTabs = JSON.stringify(activeTabs);
    chrome.storage.sync.set({
      'activeTabs': activeTabs
    }, function() {
      console.log('deleted a tab');
    });
  });
});

chrome.tabs.executeScript(null, {file: "js/jquery-2.2.3.js"});
chrome.tabs.executeScript(null, {file: "js/leaflet.js"});
chrome.tabs.executeScript(null, {file: "js/leaflet-src.js"});
chrome.tabs.executeScript(null, {file: "js/Leaflet.label.js"});
chrome.tabs.executeScript(null, {file: "js/jquery.tooltipster.js"});
chrome.tabs.executeScript(null, {file: "js/d3.js"});
chrome.tabs.executeScript(null, {file: "js/topojson.js"});
chrome.tabs.executeScript(null, {file: "content.js"});

/**
 * Checks the cache to check if data exists, and starts the extension without opening the pop-up
 */
chrome.storage.sync.get(function(data) {
    if(data) {
      if('lon' in data && 'lat' in data && 'location' in data) { //if all data exists in object
        chrome.tabs.query({active: true, currentWindow: true}, function(tab){
          console.log('checking storage to see if data exists in background')
          chrome.tabs.sendMessage(tab[0].id, { startContent: true, lat: data.lat, lon: data.lon});
        });
      }
    }
});