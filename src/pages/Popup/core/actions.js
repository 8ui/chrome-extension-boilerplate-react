
export const playVideoActions = (store) => {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
      switch (request.type) {
        case 'play_video_init': {
          if (request.payload) startCounter();
          else stopCounter();
          break;
        }
        default: return false;
      }
    }
  );
}
