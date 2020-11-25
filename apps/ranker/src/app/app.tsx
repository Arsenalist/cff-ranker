import React, { useEffect, useState } from 'react';
import { Message } from '@cff/api-interfaces';
import { ValidationFileUpload } from './validation-file-upload'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export const App = () => {
  // const [m, setMessage] = useState<Message>({ message: '' });

  // useEffect(() => {
  //   fetch('/api')
  //     .then((r) => r.json())
  //     .then(setMessage);
  // }, []);

  return (
    <Router>
      <Switch>
          <Route path="/validation-file-upload">
            <ValidationFileUpload />
          </Route>
      </Switch>
    </Router>
  );
};

export default App;
