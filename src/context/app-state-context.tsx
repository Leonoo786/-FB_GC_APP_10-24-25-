

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser, CompanyProfile } from '@/lib/types';
import { useCollection, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

type AppStateContextType = {
  companyProfile: CompanyProfile | null;
  user: AppUser | null;
  projects: Project[];
  budgetCategories: BudgetCategory[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
  teamMembers: TeamMember[];
  tasks: Task[];
  expenses: Expense[];
  changeOrders: ChangeOrder[];
  rfis: RFI[];
  issues: Issue[];
  milestones: Milestone[];
};

export const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function useAppState() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}


export function AppStateProvider({ children }: { children: ReactNode }) {
    const firestore = useFirestore();

    const { data: companyProfile } = useDoc<CompanyProfile>(doc(firestore, 'company/profile'));
    const { data: user } = useDoc<AppUser>(doc(firestore, 'users/user-1')); // Assuming a single user for now
    const { data: projects } = useCollection<Project>(collection(firestore, 'projects'));
    const { data: budgetCategories } = useCollection<BudgetCategory>(collection(firestore, 'budgetCategories'));
    const { data: vendors } = useCollection<Vendor>(collection(firestore, 'vendors'));
    const { data: budgetItems } = useCollection<BudgetItem>(collection(firestore, 'budgetItems'));
    const { data: teamMembers } = useCollection<TeamMember>(collection(firestore, 'teamMembers'));
    const { data: tasks } = useCollection<Task>(collection(firestore, 'tasks'));
    const { data: expenses } = useCollection<Expense>(collection(firestore, 'expenses'));
    const { data: changeOrders } = useCollection<ChangeOrder>(collection(firestore, 'changeOrders'));
    const { data: rfis } = useCollection<RFI>(collection(firestore, 'rfis'));
    const { data: issues } = useCollection<Issue>(collection(firestore, 'issues'));
    const { data: milestones } = useCollection<Milestone>(collection(firestore, 'milestones'));

  const value: AppStateContextType = {
    companyProfile: companyProfile || null,
    user: user || null,
    projects: projects || [],
    budgetCategories: budgetCategories || [],
    vendors: vendors || [],
    budgetItems: budgetItems || [],
    teamMembers: teamMembers || [],
    tasks: tasks || [],
    expenses: expenses || [],
    changeOrders: changeOrders || [],
    rfis: rfis || [],
    issues: issues || [],
    milestones: milestones || [],
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
