import {useContext, createContext} from "react";
import { applySnapshot, flow, onSnapshot, types } from 'mobx-state-tree';
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import {Fetch} from './utils'
import { uuid } from './uuid';

dayjs.extend(utc)

const StoreInitialState = {
  deviceUuid: uuid(),
  active: false,
  version: '0.0.1',
  newVersion: '0.0.1',
  license: {},
  device: {},
  freeDevices: 0,
}

const startUrl = 'https://taskpays.com/user/earn/youtube.aspx?start=1'

const License = types
  .model({
    id: types.optional(types.string, ''),
    key: types.optional(types.string, ''),
    devices: types.optional(types.number, 0),
    active: types.optional(types.boolean, false),
    dateActivated: types.optional(types.string, ''),
    expires: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    maxMovieClick: types.optional(types.number, 0),
  })
  .views(self => ({
    get getExpireDate() {
      if (self.expires) {
        const date = dayjs.utc(self.expires).utcOffset(1, true);
        return date.format("DD/MM/YYYY HH:mm")
      }
      return '-';
    },
    get getType() {
      return self.type === 'trial' ? 'Пробная' : 'Платная'
    }
  }))

export const Store = types
  .model({
    deviceUuid: types.string,
    active: types.boolean,
    version: types.string,
    newVersion: types.string,
    viewed: types.optional(types.number, 0),
    license: License,
    device: types.model({
      id: types.optional(types.string, ''),
      meta: types.optional(types.string, ''),
      license: types.optional(types.string, ''),
    }),
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
      const data = yield self.fetch('/device/register', {
        method: 'POST',
        body: {
          meta: navigator.userAgent,
          deviceUuid: self.deviceUuid,
          license,
        },
      })
      if (data.message) throw new Error(data.message);
      if (data.device) {
        applySnapshot(self.license, data.license)
        applySnapshot(self.device, data.device)
        self.freeDevices = data.freeDevices;
        self.version = yield self.getVersion();
        self.newVersion = self.version;
        self.viewed = data.viewed;
      }
      return data;
    }),
    checkDevice: flow(function * checkLicense() {
      if (self.license.id) {
        try {
          const { license, device, freeDevices, viewed } = yield self.fetch(`/device/check/${self.deviceUuid}`);
          applySnapshot(self.license, license)
          applySnapshot(self.device, device)
          self.freeDevices = freeDevices;
          self.newVersion = yield self.getVersion();
          self.viewed = viewed;
        } catch (e) {
          console.log('e', e);
          if (e?.code === 404) {
            applySnapshot(self.license, {})
            applySnapshot(self.device, {})
            self.freeDevices = 0;
            self.viewed = 0;
          }
        }
      } else {
        throw new Error('License not found');
      }
    }),
    getVersion: flow(function * getVersion() {
      const {version} = yield self.fetch('/version');
      console.log('version', version);
      // if (version) self.version = version;
      return version;
    }),
    fetch: flow(function * fetch(url, params) {
      return Fetch(url, { ...params, headers: { license: self.license.key } })
    })
  }));

export const initStorage = async() => {
  let storage = await new Promise((resolve) => {
    chrome.storage.sync.get(null, function(store) {
      resolve(store);
    });
  })

  storage = {
    ...StoreInitialState,
    // deviceUuid: storage.deviceUuid,
    ...(storage || {}),
  };

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
