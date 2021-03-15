/* eslint-disable */
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function() {
  this.remove();
  // onLoad()
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener("message", async function({ data: {event, payload}, ...props }) {
  if (event === 'content') {
    // console.log('@content', payload);
    switch (payload.type) {
      case 'badge': {
        const request = {type: 'badge', payload: payload.payload}
        // console.log('request', request);
        chrome.runtime.sendMessage(request, function(response) {
          // console.log(response);
        });
        break;
      }
      case 'storage': {
        const request = {type: 'storage'}
        chrome.runtime.sendMessage(request, function(response) {
          // console.log('storage', response);
          window.postMessage({event: "inject", type: 'storage', payload: response}, "*");
        });
        break;
      }
      case 'fetch': {
        try {
          let r = await fetch(payload.payload.url, payload.payload.params);
          r = await r.json();
          window.postMessage({event: "inject", type: 'fetch/resolve', payload: r}, "*");
        } catch(e) {
          window.postMessage({event: "inject", type: 'fetch/reject', payload: e}, "*");
        }
        const request = {type: 'storage'}
        chrome.runtime.sendMessage(request, function(response) {
          // console.log('storage', response);
          window.postMessage({event: "inject", type: 'storage', payload: response}, "*");
        });
        break;
      }
      default:
    }
  }
});
