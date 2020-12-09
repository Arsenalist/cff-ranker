import React from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import { ClassificationUploadPage, CompetitionUploadPage, ValidateFileUploadPage, ViewRankingsPage } from './pages';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { CompetitionList } from './competition-list';
import { ViewCompetition } from '@cff/ui';
import { Messages } from './messages';
import { MessagesProvider } from './messages-context';


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
                  <MenuItem onClick={handleClose} component={Link} to="/validation-file-upload">Upload Validation File</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/competition-file-upload">Upload Competition File</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/classification-file-upload">Upload Classification File</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/manage-competitions">Manage Competitions</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/view-rankings">View Rankings</MenuItem>
                </Menu>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={8}>
            <Messages />
            <Switch>
              <Route path="/validation-file-upload" component={ValidateFileUploadPage} />
              <Route path="/competition-file-upload" component={CompetitionUploadPage} />
              <Route path="/classification-file-upload" component={ClassificationUploadPage} />
              <Route path="/manage-competitions" component={CompetitionList} />
              <Route path="/view-rankings" component={ViewRankingsPage} />
              <Route path="/competition/:id" component={ViewCompetition} />
            </Switch>
          </Grid>
          <Grid item xs={2}/>
        </Grid>
        </MessagesProvider>
      </MuiThemeProvider>
    </Router>
  );
};

export default App;
