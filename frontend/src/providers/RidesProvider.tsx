import React, { createContext, useState } from 'react';
import type { RideOptions } from '../types';

type Props = {
  children: React.ReactNode;
};

type RideContext = {
  options: RideOptions;
  setOptions: (option: RideOptions) => void;
};

const initialContext = {
  options: {},
  setOptions: (options: RideOptions) => {},
};

export const RideOptionsContext = createContext<RideContext>(initialContext);

export const RideOptionsProvider = ({ children }: Props) => {
  const [options, setOptions] = useState<RideOptions>({});

  return (
    <RideOptionsContext.Provider value={{ options, setOptions }}>
      {children}
    </RideOptionsContext.Provider>
  );
};
