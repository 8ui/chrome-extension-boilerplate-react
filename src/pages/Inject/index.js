/* eslint-disable */

let active;
const idErrorPanel = 'ctl00_PageMainContent_ErrorMessagePanel'

const onInit = () => {
  initMainPage();
  sendLeftMovie();
  sendMessage({type: "storage"});

  window.addEventListener("message", function({ data: {event, payload}, ...props }) {
    if (!checkVideoPage()) return false;
    if (event === 'inject') {
      console.log('inject', {event, payload});
      active = payload.active;
      if (active) checkAfterLoginPage();
      if (active) startCounter();
      else stopCounter();
    }
  });
}

const sendMessage = (payload) => {
  const data = {
    event: 'content',
    payload
  }
  console.log('postMessage', data);
  window.postMessage(data, "*");
}

const sendLeftMovie = async() => {
  await sleep(1000);
  const block = document
    .getElementsByClassName('hidden-nav-function-minify hidden-nav-function-top')[0]
  const count = block ? block.innerText : ''
  const payload = {
    type: 'badge',
    payload: count,
  }
  sendMessage(payload)
}

const checkVideoPage = () => {
  return window.location.href.match(/youtube.aspx\?v\=/);
}

const checkPageErrors = () => {
  const panel = document.getElementById(idErrorPanel);
  if (panel) {
    if (panel.innerText !== "You already have been credited for this video.") {
      return true;
    }
  }
  return false;
}

const playNextVideo = () => {
  if (checkPageErrors()) active = false;
  if (active) {
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
    active = true;
    playNextVideo();
  }
}

const checkAfterLoginPage = () => {
  const afterlogin = GetParameterValues("afterlogin");
  if (afterlogin) {
    window.location.href = 'https://taskpays.com/user/earn/youtube.aspx?start=1';
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
      await sleep(5000);
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
