/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback  } from 'react';

export const MessagesContext = React.createContext(
  {
    errors: [],
    messages: [],
    clear: () => {},
    addErrors: (errs) => {},
    addMessages: (messages) => {}
  }
);

export function MessagesProvider({ children }) {
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);

  const contextValue = {
    errors,
    messages,
    clear: useCallback(() => {
      setErrors([])
      setMessages([])
    }, []),
    addErrors: useCallback((errs) => {
        setErrors(errs);
      }
      , [errors]),
    addMessages: useCallback((msgs) => {
        setMessages(msgs);
      }
      , [messages]),
  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
}
