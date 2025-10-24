
'use client';

import React, { createContext, ReactNode } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder } from '@/lib/types';

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
  changeOrders: ChangeOrder[];
  userName: string;
  userAvatarUrl: string;
  userEmail: string;
};

type AppStateSetters = {
  setCompanyName: (name: string) => void;
  setCompanyLogoUrl: (url: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  setChangeOrders: React.Dispatch<React.SetStateAction<ChangeOrder[]>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  setUserAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
};

type AppStateContextType = AppState & AppStateSetters;

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

type AppStateProviderProps = {
  children: ReactNode;
  initialState: AppState;
  onStateChange: AppStateSetters;
};

export function AppStateProvider({ children, initialState, onStateChange }: AppStateProviderProps) {
  const value = {
    ...initialState,
    ...onStateChange,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
