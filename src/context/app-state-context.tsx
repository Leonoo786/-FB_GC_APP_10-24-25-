

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import * as data from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';

type AppStateContextType = {
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  companyLogoUrl: string;
  setCompanyLogoUrl: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userAvatarUrl: string;
  setUserAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userPhone: string;
  setUserPhone: React.Dispatch<React.SetStateAction<string>>;
  userJobTitle: string;
  setUserJobTitle: React.Dispatch<React.SetStateAction<string>>;
  userDepartment: string;
  setUserDepartment: React.Dispatch<React.SetStateAction<string>>;
  userBio: string;
  setUserBio: React.Dispatch<React.SetStateAction<string>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  budgetCategories: BudgetCategory[];
  setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  budgetItems: BudgetItem[];
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  changeOrders: ChangeOrder[];
  setChangeOrders: React.Dispatch<React.SetStateAction<ChangeOrder[]>>;
  rfis: RFI[];
  setRfis: React.Dispatch<React.SetStateAction<RFI[]>>;
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
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
    const [companyName, setCompanyName] = useLocalStorage<string>('companyName', data.companyProfile.name);
    const [companyLogoUrl, setCompanyLogoUrl] = useLocalStorage<string>('companyLogoUrl', data.companyProfile.logoUrl);
    
    const [userName, setUserName] = useLocalStorage<string>('userName', data.appUser.name);
    const [userAvatarUrl, setUserAvatarUrl] = useLocalStorage<string>('userAvatarUrl', data.appUser.avatarUrl);
    const [userEmail, setUserEmail] = useLocalStorage<string>('userEmail', data.appUser.email);
    const [userPhone, setUserPhone] = useLocalStorage<string>('userPhone', "(555) 123-4567");
    const [userJobTitle, setUserJobTitle] = useLocalStorage<string>('userJobTitle', "Admin");
    const [userDepartment, setUserDepartment] = useLocalStorage<string>('userDepartment', "Construction");
    const [userBio, setUserBio] = useLocalStorage<string>('userBio', "");


    const [projects, setProjects] = useLocalStorage<Project[]>('projects', data.projects);
    const [budgetCategories, setBudgetCategories] = useLocalStorage<BudgetCategory[]>('budgetCategories', data.budgetCategories);
    const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', data.vendors);
    const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('budgetItems', data.budgetItems);
    const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', data.teamMembers);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', data.tasks);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', data.expenses);
    const [changeOrders, setChangeOrders] = useLocalStorage<ChangeOrder[]>('changeOrders', data.changeOrders);
    const [rfis, setRfis] = useLocalStorage<RFI[]>('rfis', data.rfis);
    const [issues, setIssues] = useLocalStorage<Issue[]>('issues', data.issues);
    const [milestones, setMilestones] = useLocalStorage<Milestone[]>('milestones', data.milestones);
    
    const addProject = (project: Omit<Project, 'id'>) => {
        setProjects(current => [...current, { id: crypto.randomUUID(), ...project }]);
    };
    
    const updateProject = (project: Project) => {
        setProjects(current => current.map(p => p.id === project.id ? project : p));
    };

    const deleteProject = (projectId: string) => {
        setProjects(current => current.filter(p => p.id !== projectId));
    };

  const value = {
    companyName,
    setCompanyName,
    companyLogoUrl,
    setCompanyLogoUrl,
    userName,
    setUserName,
    userAvatarUrl,
    setUserAvatarUrl,
    userEmail,
    setUserEmail,
    userPhone,
    setUserPhone,
    userJobTitle,
    setUserJobTitle,
    userDepartment,
    setUserDepartment,
    userBio,
    setUserBio,
    projects,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    budgetCategories,
    setBudgetCategories,
    vendors,
    setVendors,
    budgetItems,
    setBudgetItems,
    teamMembers,
    setTeamMembers,
    tasks,
    setTasks,
    expenses,
    setExpenses,
    changeOrders,
    setChangeOrders,
    rfis,
    setRfis,
    issues,
    setIssues,
    milestones,
    setMilestones
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
