import React from "react"
import { useMst } from './core/store';
import { observer } from 'mobx-react-lite';

import { makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  licenseText: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const LicenseInfo = () => {
  const classes = useStyles()
  const { license, viewed, exit } = useMst();
  if (!license.id) return null;

  const handleExit = (e) => {
    e.preventDefault();
    exit();
  }

  return (
    <TableContainer className={classes.root}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} component="th" scope="row">
              <Typography gutterBottom variant="subtitle2">Лицензия</Typography>
              <Typography gutterBottom variant="body1" className={classes.licenseText}>
                <span>{license.key}</span>
                <Link href="#" className={classes.exitLink} onClick={handleExit}>сменить</Link>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Тип
            </TableCell>
            <TableCell align="right">
              {license.getType}
            </TableCell>
          </TableRow>
          {/*<TableRow>*/}
          {/*  <TableCell component="th" scope="row">*/}
          {/*    Истекает*/}
          {/*  </TableCell>*/}
          {/*  <TableCell align="right">*/}
          {/*    {license.getExpireDate}*/}
          {/*  </TableCell>*/}
          {/*</TableRow>*/}
          <TableRow>
            <TableCell component="th" scope="row">
              Просмотрено видео
            </TableCell>
            <TableCell align="right">
              {viewed} / {license.maxMovieClick}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default observer(LicenseInfo);
