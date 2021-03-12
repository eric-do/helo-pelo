import React, { useState, useEffect } from 'react';
import { isAuthenticated } from './utils'

export const SessionContext = React.createContext(isAuthenticated());

type SessionProps = {
  children: React.ReactNode
}

export const SessionProvider = ({ children }: SessionProps) => {
  const [isLoggedIn, setLogin] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    setLogin(isAuthenticated());
  }, [isLoggedIn])

  return (
    <SessionContext.Provider value={isLoggedIn}>
      { children }
    </SessionContext.Provider>
  )
}