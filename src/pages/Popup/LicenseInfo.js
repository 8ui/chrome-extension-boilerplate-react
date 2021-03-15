import React from "react"
import { useMst } from './core/store';
import { observer } from 'mobx-react-lite';

import { makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  }
}))

const LicenseInfo = () => {
  const classes = useStyles()
  const { license, viewed } = useMst();
  if (!license.id) return null;

  return (
    <TableContainer className={classes.root}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              Лицензия
            </TableCell>
            <TableCell align="right">
              {license.key}
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
