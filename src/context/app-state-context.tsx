
'use client';

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import * as data from '@/lib/data';


type AppStateContextType = {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyLogoUrl: string;
  setCompanyLogoUrl: (url: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userAvatarUrl: string;
  setUserAvatarUrl: (url: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  userJobTitle: string;
  setUserJobTitle: (title: string) => void;
  userDepartment: string;
  setUserDepartment: (dept: string) => void;
  userBio: string;
  setUserBio: (bio: string) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
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
    const { user } = useUser();
    const firestore = useFirestore();

    // Remove all useLocalStorage hooks
    const [companyName, setCompanyName] = useState(data.companyProfile.name);
    const [companyLogoUrl, setCompanyLogoUrl] = useState(data.companyProfile.logoUrl);
    const [userName, setUserName] = useState(data.appUser.name);
    const [userAvatarUrl, setUserAvatarUrl] = useState(data.appUser.avatarUrl);
    const [userEmail, setUserEmail] = useState(data.appUser.email);
    const [userPhone, setUserPhone] = useState('');
    const [userJobTitle, setUserJobTitle] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userBio, setUserBio] = useState('');

    const [projects, setProjects] = useState<Project[]>(data.projects);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(data.budgetCategories);
    const [vendors, setVendors] = useState<Vendor[]>(data.vendors);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(data.budgetItems);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(data.teamMembers);
    const [tasks, setTasks] = useState<Task[]>(data.tasks);
    const [expenses, setExpenses] = useState<Expense[]>(data.expenses);
    const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(data.changeOrders);
    const [rfis, setRfis] = useState<RFI[]>(data.rfis);
    const [issues, setIssues] = useState<Issue[]>(data.issues);
    const [milestones, setMilestones] = useState<Milestone[]>(data.milestones);

    const addProject = async (project: Omit<Project, 'id'>) => {
      const newProject = { ...project, id: crypto.randomUUID() };
      setProjects(current => [...current, newProject]);
    };

    const updateProject = async (project: Project) => {
      setProjects(current => current.map(p => p.id === project.id ? project : p));
    };

    const deleteProject = async (projectId: string) => {
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
    setMilestones,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
