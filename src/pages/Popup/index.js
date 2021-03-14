import React from 'react';
import { render } from 'react-dom';
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider, initStorage } from "./core/store";

import Popup from './Popup';
import './index.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  }})

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Popup />
        </ThemeProvider>
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
