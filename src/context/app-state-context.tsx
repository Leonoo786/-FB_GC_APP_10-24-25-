'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextType {
  companyName: string;
  setCompanyName: (name: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [companyName, setCompanyName] = useState('ConstructAI');
  return (
    <AppStateContext.Provider value={{ companyName, setCompanyName }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
