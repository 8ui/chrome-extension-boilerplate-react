import React from "react";
import { observer } from 'mobx-react-lite';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { useMst } from './core/store';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2),
    color: theme.palette.text.secondary,
    display: 'flex',
    '& > div': {
      flex: 1,
    }
  },
  version: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
  }
}))

const Footer = () => {
  const Store = useMst();
  const classes = useStyles();

  return (
    <>
      {/*<Typography variant="subtitle2" component="div" className={classes.root}>*/}
      {/*  {Store.license.id ? (*/}
      {/*    <div>*/}
      {/*      Устройства<br />*/}
      {/*      подключены {Store.license.devices - Store.freeDevices} из {Store.license.devices}*/}
      {/*    </div>*/}
      {/*  ) : null}*/}
      {/*  <div>*/}
      {/*    Поддержка <Link href='mailto:webdeveloper@my.com'>webdeveloper@my.com</Link>*/}
      {/*  </div>*/}
      {/*</Typography>*/}
      {Store.version !== '0.0.1' && (
        <Typography variant="caption" className={classes.version}>
          Версия {Store.version} • Telegram Bot <Link target="_blank" href="https://t.me/TaskPaysClickerBot">@TaskPaysClickerBot</Link>
        </Typography>
      )}
    </>
  )
}

export default observer(Footer);
