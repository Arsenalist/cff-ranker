import React from 'react';
import { ValidationFileUpload } from './validation-file-upload'
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// Import the wrapper component, and the the creator function
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { CloudUpload } from '@material-ui/icons';

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  }
});


export const App = () => {
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          app name
        </Grid>
        <Grid item xs={2}>
          <List>
              <ListItem button component={Link} to="/validation-file-upload">
                <ListItemIcon> <CloudUpload /></ListItemIcon>
                <ListItemText primary="Upload Validation File" />
              </ListItem>
          </List>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <Switch>
          <Route path="/validation-file-upload" children={ <ValidationFileUpload endpoint = "/api/upload-validation-file"/> } />
        </Switch>
      </Grid>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
