/* eslint-disable */

let active;

const onInit = () => {
  if (checkVideoPage()) {
    window.addEventListener("message", function({ data: {event, payload} }) {
      console.log({event, payload});
      if (event === 'inject') {
        const {active} = payload;
        console.log(['inject'], active, payload);
        if (active) startCounter();
        else stopCounter();
      }
    });
  }
}

const checkVideoPage = () => {
  return window.location.href.match(/youtube.aspx\?v\=/);
}

const playNextVideo = () => {
  if (active) {
    const {href} = document.getElementsByClassName('YouTubeLink')[0]
    if (href) window.location.href = href;
  }
}

const startCounter = () => {
  active = true;
  setTimeout(() => {
    player.playVideo()
    setTimeout(playNextVideo, 22 * 1000)
  }, 2000)
}

const stopCounter = () => {
  active = false;
}

onInit();
