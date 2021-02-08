import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createStyles, makeStyles, MuiThemeProvider, Theme, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { ClassificationUploadPage, Home, ValidateFileUploadPage } from './pages';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';

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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Auth0Provider } from '@auth0/auth0-react';
import { Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import { Auth } from './auth';


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      flex: 1
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
  }),
);


export const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/rankings/jobs', text: 'View Rankings' },
    { path: '/competition-file-upload', text: 'Upload Competition Results' },
    { path: '/classification-file-upload', text: 'Upload Classification File' },
    { path: '/validation-file-upload', text: 'Upload Validation File' },
    { path: '/manage-results', text: 'Manage Competition Results' },
    { path: '/manage-competitions', text: 'Manage Competitions' },
    { path: '/manage-age-categories', text: 'Manage Age Categories' }
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {menuItems.map(m => (
          <List>
            <ListItem button component={Link} to={m.path}><ListItemText primary={m.text} onClick={e => handleDrawerClose()}/></ListItem>
          </List>
        ))}
      </List>
    </div>
  );

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
              <AppBar
                position="fixed"
                className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    <Link href="#"  style={{ textDecoration: 'none', color: 'white' }} to="/">CFF</Link>
                  </Typography>
                  <LoginButton/>
                  <Profile/>
                  <LogoutButton/>
                </Toolbar>
              </AppBar>
              <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                  <Drawer
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    <div className={classes.drawerHeader}>
                      <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                      </IconButton>
                    </div>
                    <Divider />
                    {drawer}
                  </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Drawer
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
              </nav>
              <main className={classes.content}>
                <div className={classes.toolbar} />
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
