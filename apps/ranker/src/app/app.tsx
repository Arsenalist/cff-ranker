import React from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import {
  ClassificationUploadPage, Home,
  ValidateFileUploadPage,
} from './pages';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { Ranking, Rankings, RankingJobs, AgeCategoryList, Profile, LoginButton, LogoutButton, UploadCompetitionResults, CompetitionList, CompetitionResultsList } from '@cff/ui';
import { ViewCompetition } from '@cff/ui';
import { Messages } from '@cff/ui';
import { MessagesProvider } from '@cff/ui';

import { Auth0Provider } from '@auth0/auth0-react';

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const App = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Router>
      <Auth0Provider
        domain="cff.us.auth0.com"
        audience="https://localhost:3000/api"
        scope="openid email profile"
        clientId="UlTsuEYfjGc2sqBo8dHxLEDpdOIUBJ32"
        redirectUri={window.location.origin}
      >
      <MuiThemeProvider theme={theme}>
        <MessagesProvider>
        <CssBaseline/>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" onClick={handleMenu} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  CFF
                </Typography>
                <LoginButton/>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} component={Link} to="/validation-file-upload">Upload Players</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/competition-file-upload">Upload Competition Results</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/classification-file-upload">Upload Classification File</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/manage-competitions">Manage Competitions</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/manage-results">Competitions Results</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/rankings/jobs">Rankings</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/manage-age-categories">Age Categories</MenuItem>
                </Menu>
                <Profile />
                <LogoutButton />
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={8}>
            <Messages />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/validation-file-upload" component={ValidateFileUploadPage} />
              <Route path="/competition-file-upload" component={UploadCompetitionResults} />
              <Route path="/classification-file-upload" component={ClassificationUploadPage} />
              <Route path="/manage-results" component={CompetitionResultsList} />
              <Route path="/manage-competitions" component={CompetitionList} />
              <Route path="/competition/:id" component={ViewCompetition} />
              <Route path="/manage-age-categories" component={AgeCategoryList} />
              <Route path="/rankings/jobs" exact component={RankingJobs} />
              <Route path="/rankings/jobs/:id" exact component={Rankings} />
              <Route path="/rankings/ranking/:id" component={Ranking} />
            </Switch>
          </Grid>
          <Grid item xs={2}/>
        </Grid>
        </MessagesProvider>
      </MuiThemeProvider>
      </Auth0Provider>
    </Router>
  );
};

export default App;
