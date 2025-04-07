'use client';

import React from 'react';
import type { ReactNode } from 'react';
import RootStore from './RootStore';

type StoreContextType = RootStore | null;

const StoreContext = React.createContext<StoreContextType>(null);
StoreContext.displayName = 'StoreContext'; 

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [rootStore] = React.useState(() => new RootStore());

  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};


export const useStores = () => {
  const rootStore = React.useContext(StoreContext);
  if (!rootStore) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return rootStore;
};

export { StoreContext };