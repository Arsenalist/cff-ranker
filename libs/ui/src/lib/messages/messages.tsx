import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useEffect } from 'react';
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
  useEffect(() => {
    axios.interceptors.response.use(function(response) {
      return response;
    }, function(error) {
      if (error.response) {
        addErrors(error.response.data.messages);
      }
      return Promise.reject(error);
    });

    axios.interceptors.request.use(function (config) {
      clear()
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }, [])

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
