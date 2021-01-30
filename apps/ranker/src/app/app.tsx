import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createMuiTheme, createStyles, makeStyles, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { ClassificationUploadPage, Home, ValidateFileUploadPage } from './pages';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import {
  AgeCategoryList,
  BackdropLoader,
  CompetitionList,
  CompetitionResultsList,
  LoginButton,
  LogoutButton,
  Messages,
  MessagesProvider,
  Profile,
  Ranking,
  RankingJobs,
  Rankings,
  UploadCompetitionResults,
  ViewCompetition
} from '@cff/ui';

import { Auth0Provider } from '@auth0/auth0-react';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { Auth } from './auth';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      flex: 1
    }
  }),
);
export const App = () => {
  const classes = useStyles();

  const menuItems = [
    { path: '/rankings/jobs', text: 'View Rankings' },
    { path: '/competition-file-upload', text: 'Upload Competition Results' },
    { path: '/classification-file-upload', text: 'Upload Classification File' },
    { path: '/validation-file-upload', text: 'Upload Validation File' },
    { path: '/manage-results', text: 'Manage Competition Results' },
    { path: '/manage-competitions', text: 'Manage Competitions' },
    { path: '/manage-age-categories', text: 'Manage Age Categories' }
  ];

  return (
    <Router>
      <Auth0Provider
        className={classes.root} theme={theme}
        domain="cff.us.auth0.com"
        audience="https://localhost:3000/api"
        scope="openid email profile"
        clientId="UlTsuEYfjGc2sqBo8dHxLEDpdOIUBJ32"
        redirectUri={window.location.origin}
      >
        <MuiThemeProvider theme={theme}>
          <MessagesProvider>
            <Auth />
            <BackdropLoader />
            <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  <Link href="#"  style={{ textDecoration: 'none', color: 'white' }} to="/">CFF</Link>
                </Typography>
                <LoginButton/>
                <Profile/>
                <LogoutButton/>
              </Toolbar>
            </AppBar>
              <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <Toolbar />
                <div className={classes.drawerContainer}>
              {menuItems.map(m => (
                <List>
                  <ListItem button component={Link} to={m.path}><ListItemText primary={m.text}/></ListItem>
                </List>
              ))}
                </div>
            </Drawer>
              <main className={classes.content}>
                <Toolbar />
              <Messages/>
              <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/validation-file-upload" component={ValidateFileUploadPage}/>
                <Route path="/competition-file-upload" component={UploadCompetitionResults}/>
                <Route path="/classification-file-upload" component={ClassificationUploadPage}/>
                <Route path="/manage-results" component={CompetitionResultsList}/>
                <Route path="/manage-competitions" component={CompetitionList}/>
                <Route path="/competition/:id" component={ViewCompetition}/>
                <Route path="/manage-age-categories" component={AgeCategoryList}/>
                <Route path="/rankings/jobs" exact component={RankingJobs}/>
                <Route path="/rankings/jobs/:id" exact component={Rankings}/>
                <Route path="/rankings/ranking/:id" component={Ranking}/>
              </Switch>
              </main>
            </div>
          </MessagesProvider>
        </MuiThemeProvider>
      </Auth0Provider>
</Router>
);
};

export default App;
