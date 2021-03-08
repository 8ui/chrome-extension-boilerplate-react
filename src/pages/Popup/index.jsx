import React from 'react';
import { render } from 'react-dom';
import { Provider, initStorage } from "./core/store";

import Popup from './Popup';
import './index.css';

const App = () => {
  const[rootStore, setRootStore] = React.useState()
  React.useEffect(() => {
    (async() => {
      const store = await initStorage();
      setRootStore(store);
    })()
  }, []);

  if (rootStore) {
    return (
      <Provider value={rootStore}>
        <Popup />
      </Provider>
    )
  }
  return null;
}

render(
  <App />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
