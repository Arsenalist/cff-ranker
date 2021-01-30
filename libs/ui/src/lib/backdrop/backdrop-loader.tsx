import React, { useContext } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Backdrop, createStyles, makeStyles, Theme } from '@material-ui/core';
import { MessagesContext } from '../..';
import axios from 'axios';

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
  const { isLoading, setLoading } = useContext(MessagesContext);

  axios.interceptors.response.use(function(response) {
    setLoading(false)
    return response;
  }, function(error) {
    if (error.response) {
      setLoading(false)
    }
    return Promise.reject(error);
  });

  axios.interceptors.request.use(function (config) {
    if (config.params?.useLoader) {
      setLoading(true)
    }
    return config;
  }, function (error) {
    setLoading(false)
    return Promise.reject(error);
  });


  return (
    <div>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default BackdropLoader;
