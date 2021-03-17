/* eslint-disable */

let active;
let counter = 0;
let storage = {}
let leftMovieCount = 0;
let fetchResolve;
let fetchReject;
const idErrorPanel = 'alert-danger'
const idSuccessPanel = 'alert-success'
const idEmailPanel = "#navbarSupportedContent > ul > li.line-height.pt-3 > div > div > div > div.bg-primary.p-3 > span"

const onInit = async() => {
  initMainPage();
  sendMessage({type: "storage"});
  await sendLeftMovie();
}

window.addEventListener("message", function({ data: {event, type, payload}, ...props }) {
  if (!checkVideoPage()) return false;
  if (event === 'inject') {
    // console.log('pong.inject', {event, payload});

    switch (type) {
      case 'storage': {
        if (storage.active === undefined) {
          storage = payload;
          if (storage.active) checkAfterLoginPage();
          if (storage.active) startCounter();
          else stopCounter();
        }
        break;
      }
      case 'fetch/resolve': {
        fetchResolve = payload;
        break;
      }
      case 'fetch/reject': {
        fetchReject = payload;
        break;
      }
      default:
    }
  }
});

const sendMessage = (payload) => {
  const data = {
    event: 'content',
    payload
  }
  // console.log('postMessage', data);
  window.postMessage(data, "*");
}

const sendLeftMovie = async() => {
  await sleep(1000);
  const block = document
    .getElementsByClassName('hidden-nav-function-minify hidden-nav-function-top')[0]
  leftMovieCount = block ? Number(block) : 0;
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

const viewedMovieError = () => {
  const panel = document.getElementsByClassName(idErrorPanel);
  if (panel?.[0]?.innerText === "You already have been credited for this video.") {
    return true;
  }
  return false;
}

const checkPageErrors = () => {
  const panel = document.getElementsByClassName(idErrorPanel);
  if (panel.length) {
    return !viewedMovieError();
  }
  return false;
}

const checkPageSuccess = () => {
  return viewedMovieError() || document.getElementsByClassName(idSuccessPanel).length > 0;
}

const clickNextVideo = async() => {
  const {href} = document.getElementsByClassName('YouTubeLink')[0]
  if (href) window.location.href = href;
}

const playNextVideo = async() => {
  if (active === false) return false;
  if (checkPageErrors() && leftMovieCount <= 0) active = false;
  if (active) {
    if ((await setViewed())) {
      clickNextVideo();
    }
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
    clickNextVideo();
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
    if (window.player.playVideo) {
      clearInterval(interval);
      await sleep(800);
      window.focus();
      window.player.playVideo()
      window.player.setVolume(0);
    }
  }, 100);

  const nextVideoInterval = setInterval(async() => {
    if (checkPageErrors()) {
      clearInterval(nextVideoInterval);
      active = false
      return false;
    }
    if (window.credited && checkPageSuccess()) {
      clearInterval(nextVideoInterval);
      await sleep(500);
      playNextVideo();
    }
    if (counter >= 60) {
      clearInterval(nextVideoInterval);
      await sleep(500);
      clickNextVideo();
    }
    counter += 1;
  }, 1000);
}

const setViewed = async() => {
  if (fetchResolve || fetchReject) return false;
  try {
    const movieId = GetParameterValues("v");
    if (!movieId) return true;
    const r = await new Promise((resolve, reject) => {
      sendMessage({
        type: 'fetch',
        payload: {
          url: 'https://213.139.208.207/v2/viewed',
          params: {
            method: 'POST',
            body: JSON.stringify({
              movieId,
              license: storage.license.id,
              deviceUuid: storage.deviceUuid,
              email: document.querySelector(idEmailPanel)?.innerText,
            }),
            headers: {
              "Content-type": "application/json",
            }
          }
        }
      })

      let count = 0;
      const fetchResponse = setInterval(async() => {
        if (fetchResolve || fetchReject) {
          clearInterval(fetchResponse);
        }
        if (fetchResolve) {
          resolve(fetchResolve);
        }
        if (fetchReject) {
          reject(fetchReject);
        }
        if (count >= 5) {
          reject()
        }
        count += 0.5;
      }, 500);
    })
    if (r.code === 400) return false;
  } catch (e) {
    // console.log(e);
    return true;
  }
  return true;
}

const stopCounter = () => {
  // console.log('@stopCounter');
  active = false;
}

const onblur = async() => {
  // console.log('@window.onblur');
  if (window.player && active) {
    await sleep(50)
    window.player.playVideo();
    window.is_visible_focus = true;
  }
};

window.addEventListener('blur', onblur);

onInit();
