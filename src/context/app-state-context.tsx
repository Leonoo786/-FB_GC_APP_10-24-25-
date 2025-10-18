
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import type { Project, BudgetCategory } from '@/lib/types';

type AppState = {
  companyName: string;
  companyLogoUrl: string;
  projects: Project[];
  budgetCategories: BudgetCategory[];
};

type AppStateContextType = AppState & {
  setCompanyName: (name: string) => void;
  setCompanyLogoUrl: (url: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
};

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

type AppStateProviderProps = {
  children: ReactNode;
  initialState: AppState;
  onStateChange: {
    setCompanyName: (name: string) => void;
    setCompanyLogoUrl: (url: string) => void;
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
  };
};

export function AppStateProvider({ children, initialState, onStateChange }: AppStateProviderProps) {
  const value = {
    ...initialState,
    setCompanyName: onStateChange.setCompanyName,
    setCompanyLogoUrl: onStateChange.setCompanyLogoUrl,
    setProjects: onStateChange.setProjects,
    setBudgetCategories: onStateChange.setBudgetCategories,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
