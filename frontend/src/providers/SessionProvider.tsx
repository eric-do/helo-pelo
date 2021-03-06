import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils';

export const SessionContext = React.createContext({
  isAuthenticated: isAuthenticated(),
  updateAuthentication: () => {},
});

type SessionProps = {
  children: React.ReactNode;
};

type Authentication = {
  isAuthenticated: boolean;
  updateAuthentication: () => void;
};

export const SessionProvider = ({ children }: SessionProps) => {
  const [session, setSession] = useState<Authentication>({
    isAuthenticated: isAuthenticated(),
    updateAuthentication: () => {
      setSession({
        ...session,
        isAuthenticated: isAuthenticated(),
      });
    },
  });

  const updateSession = () => {
    setSession({
      ...session,
      isAuthenticated: isAuthenticated(),
    });
  };

  useEffect(() => {
    updateSession();
  }, [session.isAuthenticated]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
