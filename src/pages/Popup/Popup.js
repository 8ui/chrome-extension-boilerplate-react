import React from 'react';
import {observer} from "mobx-react-lite";
import './Popup.css';
import { useMst } from './core/store';
import LicenseForm from './LicenseForm'
import Footer from './Footer'
import Button from '@material-ui/core/Button';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NewVersion from './NewVersion';
import LicenseInfo from './LicenseInfo';

const Popup = () => {
  const Store = useMst()
  console.log('Store', Store.toJSON());
  React.useEffect(() => {
    (async() => {
      try {
        await Store.checkDevice();
      } catch(e) {

      }
    })()
  }, []);

  let content;
  if (Store.license.id) {
    content = (
      <Button
        startIcon={Store.active ? <PowerSettingsNewIcon /> : <PlayCircleFilled />}
        onClick={() => Store.switchActive()}
        size="large"
        variant="contained"
        color={Store.active ? 'secondary' : 'primary'}
      >
        {Store.active ? 'Выключить' : 'Включить просмотр видео'}
      </Button>
    )
  } else {
    content = <LicenseForm />
  }

  return (
    <div className="app">
      <NewVersion />
      <LicenseInfo />
      <div className="content">{content}</div>
      <Footer />
    </div>
  );
};

export default observer(Popup);
