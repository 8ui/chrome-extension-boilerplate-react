import React from "react";
import { observer } from 'mobx-react-lite';
import { useMst } from './core/store';

const Footer = () => {
  const Store = useMst();
  return (
    <div className="footer">
      <div>
        {Store.license ? (
          <>
            Устройства<br />
            подключены {Store.totalDevices - Store.freeDevices} из {Store.totalDevices}
          </>
        ) : null}
      </div>
      <div>
        Поддержка<br />
        <a href='mailto:webdeveloper@my.com'>webdeveloper@my.com</a>
      </div>
    </div>
  )
}

export default observer(Footer);