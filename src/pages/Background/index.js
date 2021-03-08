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

chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.storage.sync.get(null, function(store) {
    port.postMessage(store);
  });
});
