/* eslint-disable */

let active;
const idErrorPanel = 'ctl00_PageMainContent_ErrorMessagePanel'

const onInit = () => {
  initMainPage();
  window.addEventListener("message", function({ data: {event, payload}, ...props }) {
    if (!checkVideoPage()) return false;
    if (event === 'inject') {
      const {active} = payload;
      console.log(['inject'], active, payload);
      if (active) startCounter();
      else stopCounter();
    }
  });
}

const checkVideoPage = () => {
  return window.location.href.match(/youtube.aspx\?v\=/);
}

const playNextVideo = () => {
  if (document.getElementById(idErrorPanel)) active = false;
  if (active) {
    console.trace('@playNextVideo');
    const {href} = document.getElementsByClassName('YouTubeLink')[0]
    if (href) window.location.href = href;
  }
}

const GetParameterValues = (param) => {
  const url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (let i = 0; i < url.length; i++) {
    const urlParam = url[i].split('=');
    if (urlParam[0] === param) {
      return urlParam[1];
    }
  }
}

const initMainPage = () => {
  const start = GetParameterValues("start");
  if (!checkVideoPage() && start) {
    console.log('@initMainPage');
    active = true;
    playNextVideo();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const startCounter = () => {
  console.log('@startCounter');
  active = true;
  let interval = setInterval(async() => {
    if (window.player) {
      clearInterval(interval);
      await sleep(800);
      window.focus();
      window.player.playVideo()
      window.player.setVolume(0);
    }
  }, 100);

  const nextVideoInterval = setInterval(async() => {
    if (window.credited) {
      clearInterval(nextVideoInterval);
      await sleep(1500);
      playNextVideo();
    }
  }, 1000);
}

const stopCounter = () => {
  console.log('@stopCounter');
  active = false;
}

const onblur = async() => {
  console.log('@window.onblur');
  if (window.player) {
    await sleep(50)
    window.player.playVideo();
    window.is_visible_focus = true;
  }
};

window.addEventListener('blur', onblur);

onInit();
