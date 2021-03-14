import React from "react";
import { observer } from 'mobx-react-lite';
import Alert from '@material-ui/lab/Alert';
import { useMst } from './core/store';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  }
}))

const NewVersion = () => {
  const classes = useStyles();
  const {version, newVersion} = useMst();

  if (version !== newVersion) {
    return (
      <Alert
        className={classes.root}
        action={
          <Button href="http://8ui.ru/taskpays-clicker.zip" target="_blank" color="inherit" size="small">
            СКАЧАТЬ
          </Button>
        }
        severity="success"
      >
        Вышла новая версия программы.
      </Alert>
    )
  }
  return null;
}

export default observer(NewVersion);
