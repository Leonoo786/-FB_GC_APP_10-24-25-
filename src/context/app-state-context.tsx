
'use client';

import React, { createContext, useState, ReactNode } from 'react';

type AppState = {
  companyName: string;
  companyLogoUrl: string;
};

type AppStateContextType = AppState & {
  setCompanyName: (name: string) => void;
  setCompanyLogoUrl: (url: string) => void;
};

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

type AppStateProviderProps = {
  children: ReactNode;
  initialState: AppState;
  onStateChange: {
    setCompanyName: (name: string) => void;
    setCompanyLogoUrl: (url: string) => void;
  };
};

export function AppStateProvider({ children, initialState, onStateChange }: AppStateProviderProps) {
  const value = {
    ...initialState,
    setCompanyName: onStateChange.setCompanyName,
    setCompanyLogoUrl: onStateChange.setCompanyLogoUrl,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
