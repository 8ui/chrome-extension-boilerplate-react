/* eslint-disable */
import { printLine } from './modules/print';

console.log('Content script works!');
// console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");

console.log(chrome.runtime.getURL('content.styles.css'))

const s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

const port = chrome.runtime.connect(null, { name: "content" });
port.onMessage.addListener(function(payload, sender){
  const message = {payload, event: 'inject'}
  console.log(['content'], 'message', message);
  window.postMessage(message, "*");
});
