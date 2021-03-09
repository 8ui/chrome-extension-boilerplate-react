import {useContext, createContext} from "react";
import { onSnapshot, types } from 'mobx-state-tree';

const StoreInitialState = {
  active: false,
}

export const Store = types
  .model({
    active: types.boolean,
  })
  .actions(self => ({
    switchActive() {
      self.active = !self.active;
      if (self.active) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
          const { url } = tabs[0];
          if (!url.match(/^https:\/\/taskpays\.com/)) {
            chrome.tabs.create({ url: 'https://taskpays.com/user/earn/youtube.aspx?start=1' });
          }
        });
      }
    },
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
