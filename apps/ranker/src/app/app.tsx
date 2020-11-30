import React from 'react';
import { ValidationFileUpload } from './validation-file-upload'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export const App = () => {
  return (
    <Router>
      <Link to={`/validation-file-upload`}>Upload Validation File</Link>
      <Switch>
          <Route path="/validation-file-upload" component={ValidationFileUpload}/>
      </Switch>
    </Router>
  );
};

export default App;
