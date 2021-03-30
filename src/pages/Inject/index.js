/* eslint-disable */
export const ISDEV = !process.env.NODE_ENV
  || process.env.NODE_ENV === 'development';

let active;
let counter = 0;
let storage = {}
let leftMovieCount = 0;
let fetchResolve;
let fetchReject;
let viewed;
let api = ISDEV ? 'http://localhost:8081' : 'https://213.139.208.207'
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
    switch (type) {
      case 'storage': {
        if (storage.active === undefined) {
          storage = payload;
          active = storage.active;
          if (active) checkAfterLoginPage();
          if (active) startCounter();
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

const getViewedMovieErrorText = () => {
  const panel = document.getElementsByClassName(idErrorPanel);
  return panel?.[0]?.innerText
}

const viewedMovieError = () => {
  const errorText = getViewedMovieErrorText();
  if (errorText === "You already have been credited for this video.") {
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

const clickNextVideo = () => {
  const {href} = document.getElementsByClassName('YouTubeLink')[0]
  if (href) window.location.href = href;
}

const playNextVideo = async() => {
  if (active === false) return false;
  if (checkPageErrors() && leftMovieCount <= 0) active = false;
  if (active) {
    await activeViewed(true)
    clickNextVideo();
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

const startCounter = async() => {
  console.log('@startCounter');
  try {
    await setViewed();
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
      console.log('checkPageErrors()', checkPageErrors(), getViewedMovieErrorText());
      if (checkPageErrors()) {
        clearInterval(nextVideoInterval);
        active = false;
        await activeViewed(false);
        window.player.stopVideo();
        return false;
      }
      if (window.credited && checkPageSuccess()) {
        clearInterval(nextVideoInterval);
        await sleep(500);
        playNextVideo();
      }
      if (counter >= 60) {
        clearInterval(nextVideoInterval);
        await sleep(100);
        await activeViewed(false, 'timeout');
        clickNextVideo();
      }
      counter += 1;
    }, 1000);
  } catch (e) {
    console.log('e.code', e.code);
    switch (e.code) {
      case 400: alert(`Ошибка плагина TaskPays Clicker:\n${String(e.message)}`); break;
      case 226: clickNextVideo(); break;
      default:
    }
  }
}

const setViewed = async() => {
  if (fetchResolve || fetchReject) return false;

  const movieId = GetParameterValues("v");
  if (!movieId) return true;
  viewed = await fetchData('/v2/viewed', {
    method: 'POST',
    body: JSON.stringify({
      movieId,
      license: storage.license.id,
      deviceUuid: storage.deviceUuid,
      email: document.querySelector(idEmailPanel)?.innerText,
    })
  })
  return viewed;
}

const activeViewed = async(active, errorText) => {
  console.log('activeViewed', active, errorText);
  try {
    await fetchData(`/v2/viewed/${viewed.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        active,
        errorMessage: errorText || getViewedMovieErrorText() || '',
      })
    })
  } catch (e) {
    console.log('activeViewed', e);
  }
}

const fetchData = async (url, params) => {
  console.log('fetchData', { url, params });
  let r = await window.fetch(`${api}${url}`, {
    ...params,
    headers: {
      "Content-type": "application/json",
    }
  });
  r = await r.json();
  console.log('fetchData', r);
  if (r.code) throw r;
  return r;
}

const stopCounter = () => {
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
