/* eslint-disable */

console.log('This is the background page.');
console.log('Put the background scripts here.');

let port
chrome.runtime.onConnect.addListener(function(p){
  console.log(['background'], 'chrome.runtime.onConnect.addListener');
  port = p
  chrome.storage.sync.get(null, function(store) {
    port.postMessage(store);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'badge': {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#e20e02" });
      chrome.browserAction.setBadgeText( { text: String(request.payload) } );
      // sendResponse({status: true});
      break;
    }
    case 'storage': {
      chrome.storage.sync.get(null, function(store) {
        sendResponse(store);
      });
      break;
    }
    default:
  }
  if (request.type) {
  }
  return true
});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   console.log('@background', 'chrome.storage.onChanged');
//   chrome.storage.sync.get(null, function(store) {
//     if (port) port.postMessage(store);
//   });
// });



