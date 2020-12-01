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
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import { CloudUpload } from '@material-ui/icons';
import logo from '../assets/cff-logo.png'
import { Divider } from '@material-ui/core';
import {
  ClassificationUploadPage,
  CompetitionUploadPage,
  ValidateFileUploadPage,
  ViewRankingsPage
} from './pages';

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
          <img src={logo} alt={"Logo"}/>
        </Grid>
        <Grid item xs={2}>
          <Divider />
          <List>
              <ListItem button component={Link} to="/validation-file-upload">
                <ListItemIcon> <CloudUpload /></ListItemIcon>
                <ListItemText primary="Upload Validation File" />
              </ListItem>
          </List>
          <List>
            <ListItem button component={Link} to="/competition-file-upload">
              <ListItemIcon> <CloudUpload /></ListItemIcon>
              <ListItemText primary="Upload Competition File" />
            </ListItem>
          </List>
          <List>
            <ListItem button component={Link} to="/classification-file-upload">
              <ListItemIcon> <CloudUpload /></ListItemIcon>
              <ListItemText primary="Upload Classification File" />
            </ListItem>
          </List>
          <List>
            <ListItem button component={Link} to="/view-rankings">
              <ListItemIcon> <FormatListNumberedIcon /></ListItemIcon>
              <ListItemText primary="View Rankings" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10}>
          <Switch>
            <Route path="/validation-file-upload" component={ValidateFileUploadPage} />
            <Route path="/competition-file-upload" component={CompetitionUploadPage} />
            <Route path="/classification-file-upload" component={ClassificationUploadPage} />
            <Route path="/view-rankings" component={ViewRankingsPage} />
          </Switch>
        </Grid>
      </Grid>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
