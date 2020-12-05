/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback  } from 'react';

const MessagesContext = React.createContext(
  {
    errors: [],
    clear: () => {},
    addErrors: (errs) => {}
  }
);

function MessagesProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const clear = () => setErrors([]);
  const addErrors = (errs) => setErrors(errs);

  const contextValue = {
    errors,
    addErrors: useCallback((errs) => {
      errors.concat(errs)
      addErrors(errs)
      }
      , [errors]),
    clear: useCallback(() => clear(), [])
  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
}

export {MessagesProvider, MessagesContext}
