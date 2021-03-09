/* eslint-disable */
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.bundle.js');
s.onload = function() {
  this.remove();
  onLoad()
};
(document.head || document.documentElement).appendChild(s);

const onLoad = () => {
  console.log('@onLoad');
  const port = chrome.runtime.connect(null, { name: "content" });
  port.onMessage.addListener(function(payload, sender){
    const message = {payload, event: 'inject'}
    console.log('@content', message);
    window.postMessage(message, "*");
  });
}

