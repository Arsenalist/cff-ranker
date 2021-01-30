import React, { useContext, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Backdrop, createStyles, makeStyles, Theme } from '@material-ui/core';
import { MessagesContext } from '../..';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export function BackdropLoader() {
  const classes = useStyles();
  const { isLoading } = useContext(MessagesContext);


  return (
    <div>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default BackdropLoader;
