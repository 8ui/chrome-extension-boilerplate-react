import {useContext, createContext} from "react";
import { flow, onSnapshot, types } from 'mobx-state-tree';

const StoreInitialState = {
  active: false,
  totalDevices: 0,
  freeDevices: 0,
}

const startUrl = 'https://taskpays.com/user/earn/youtube.aspx?start=1'

export const Store = types
  .model({
    active: types.boolean,
    license: types.optional(types.string, ''),
    deviceId: types.optional(types.string, ''),
    totalDevices: types.optional(types.number, 0),
    freeDevices: types.optional(types.number, 0),
  })
  .actions(self => ({
    switchActive() {
      self.active = !self.active;
      if (self.active) {
        chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
          console.log('tab', tab);
          if (tab.url.match(/^https:\/\/taskpays\.com/)) {
            chrome.tabs.update(tab.id, {url: startUrl});
          } else {
            chrome.tabs.create({ url: startUrl });
          }
        });
      }
    },
    registerDevice: flow(function * registerDevice(license) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let data = yield fetch('http://localhost:8081/v2/device/register', {
        method: 'POST',
        body: JSON.stringify({
          meta: navigator.userAgent,
          license,
        }),
        headers: myHeaders,
      })
      data = yield data.json();
      if (data.message) throw new Error(data.message);
      if (data._id) {
        self.license = license;
        self.totalDevices = data.totalDevices;
        self.freeDevices = data.freeDevices;
        self.deviceId = data._id;
      }
      return data;
    }),
    checkLicense: flow(function * checkLicense() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let data = yield fetch(`http://localhost:8081/v2/license/${self.license}`, {
        headers: myHeaders,
      })
      data = yield data.json();
      console.log('checkLicense', data);
    })
  }));

export const initStorage = async() => {
  let storage = await new Promise((resolve) => {
    chrome.storage.sync.get(null, function(store) {
      resolve(store);
    });
  })

  storage = Object.keys(storage).length > 0 ? storage : StoreInitialState;

  const rootStore = Store.create(storage);

  onSnapshot(rootStore, (snapshot) => {
    chrome.storage.sync.set(snapshot, function(...props) {
      // Notify that we saved.
      console.log('Storage saved');
    });
  });

  return rootStore;
}

const RootStoreContext = createContext(null);

export const Provider = RootStoreContext.Provider;
export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
