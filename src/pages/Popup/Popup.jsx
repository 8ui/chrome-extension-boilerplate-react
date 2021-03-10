import React from 'react';
import {observer} from "mobx-react-lite";
import './Popup.css';
import { useMst } from './core/store';
import LicenseForm from './LicenseForm'
import Footer from './Footer'

const Popup = () => {
  const Store = useMst()
  Store.checkLicense();
  let content;
  if (!Store.license) {
    content = <LicenseForm />
  } else {
    content = (
      <button onClick={() => Store.switchActive()}>
        {Store.active ? 'Выключить' : 'Включить просмотр видео'}
      </button>
    )
  }

  return (
    <div className="app">
      <div className="content">{content}</div>
      <Footer />
    </div>
  );
};

export default observer(Popup);
