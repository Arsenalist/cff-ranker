/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback  } from 'react';

export const MessagesContext = React.createContext(
  {
    errors: [],
    messages: [],
    clear: () => {},
    addErrors: (errs) => {},
    addMessages: (messages) => {},
    isLoading: false,
    setLoading: (loading) => {}

  }
);

export function MessagesProvider({ children }) {
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
      , []),
    addMessages: useCallback((msgs) => {
        setMessages(msgs);
      }
      , []),
    isLoading,
    setLoading: useCallback((loading) => {
        setLoading(loading)
      }
      , []),

  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
}
