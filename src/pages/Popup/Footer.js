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
  },
  exitLink: {
    color: theme.palette.warning.main,
  }
}))

const Footer = () => {
  const Store = useMst();
  const classes = useStyles();

  return (
    <>
      {Store.version !== '0.0.1' && (
        <Typography variant="caption" className={classes.version}>
          Версия {Store.version}{' '}
          • Telegram Bot <Link target="_blank" href="https://t.me/TaskPaysClickerBot">@TaskPaysClickerBot</Link>{' '}
        </Typography>
      )}
    </>
  )
}

export default observer(Footer);
