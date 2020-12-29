import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { MessagesContext } from './messages-context';
import { useAuth0 } from '@auth0/auth0-react';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

export function Messages() {
  const classes = useStyles();
  const { errors, messages, addErrors, clear } = useContext(MessagesContext);
  const { getAccessTokenSilently } = useAuth0()

  axios.interceptors.response.use(function(response) {
    return response;
  }, function(error) {
    if (error.response) {
      addErrors(error.response.data.messages);
    }
    return Promise.reject(error);
  });

  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    clear()
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  axios.interceptors.request.use(function (config) {
    (async () => {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    })()
    return config;
  });

  return (
    <div>
      {errors ?
        <div className={classes.root}>
          <Grid item xs={12}>
            {errors.map((error) =>
              <MuiAlert severity="error"> {error} </MuiAlert>
            )
            }
          </Grid>
        </div>
        : ''
      }

      {messages ?
        <div className={classes.root}>
          <Grid item xs={12}>
            {messages.map((msg) =>
              <MuiAlert severity="success"> {msg} </MuiAlert>
            )
            }
          </Grid>
        </div>
        : ''
      }
    </div>
  );
}
