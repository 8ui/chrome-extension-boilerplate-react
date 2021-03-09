import React from 'react';
import './Popup.css';
import { useMst } from './core/store';
import {observer} from "mobx-react-lite";

const Popup = () => {
  const Store = useMst()

  return (
    <div className="App">
      <button onClick={() => Store.switchActive()}>
        {Store.active ? 'Выключить' : 'Включить просмотр'}
      </button>
    </div>
  );
};

export default observer(Popup);
