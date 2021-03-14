/* eslint-disable */
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function() {
  this.remove();
  // onLoad()
};
(document.head || document.documentElement).appendChild(s);

// const port = chrome.runtime.connect(null, { name: "content" });
// const onLoad = () => {
//   port.onMessage.addListener(function(payload, sender) {
//     const message = {payload, event: 'inject'}
//     console.log('@content', message);
//     setTimeout(() => {
//       window.postMessage(message, "*");
//     }, 100)
//   });
// }

window.addEventListener("message", function({ data: {event, payload}, ...props }) {
  if (event === 'content') {
    console.log('@content', payload);
    switch (payload.type) {
      case 'badge': {
        const request = {type: 'badge', payload: payload.payload}
        console.log('request', request);
        chrome.runtime.sendMessage(request, function(response) {
          console.log(response);
        });
        break;
      }
      case 'storage': {
        const request = {type: 'storage'}
        chrome.runtime.sendMessage(request, function(response) {
          console.log('storage', response);
          window.postMessage({event: "inject", type: 'storage', payload: response}, "*");
        });
        break;
      }
      default:
    }
  }
});
