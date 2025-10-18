
'use client';

import React, { createContext, ReactNode } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense } from '@/lib/types';

type AppState = {
  companyName: string;
  companyLogoUrl: string;
  projects: Project[];
  budgetCategories: BudgetCategory[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
  teamMembers: TeamMember[];
  tasks: Task[];
  expenses: Expense[];
};

type AppStateContextType = AppState & {
  setCompanyName: (name: string) => void;
  setCompanyLogoUrl: (url: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
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
    setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  };
};

export function AppStateProvider({ children, initialState, onStateChange }: AppStateProviderProps) {
  const value = {
    ...initialState,
    setCompanyName: onStateChange.setCompanyName,
    setCompanyLogoUrl: onStateChange.setCompanyLogoUrl,
    setProjects: onStateChange.setProjects,
    setBudgetCategories: onStateChange.setBudgetCategories,
    setVendors: onStateChange.setVendors,
    setBudgetItems: onStateChange.setBudgetItems,
    setTeamMembers: onStateChange.setTeamMembers,
    setTasks: onStateChange.setTasks,
    setExpenses: onStateChange.setExpenses,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
