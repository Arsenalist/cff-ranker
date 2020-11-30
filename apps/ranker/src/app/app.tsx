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
        <Grid item xs>
          <Link to={`/validation-file-upload`}>Upload Validation File</Link>
        </Grid>
      </Grid>
      <Grid>
        <Switch>
          <Route path="/validation-file-upload" component={ValidationFileUpload}/>
        </Switch>
      </Grid>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
