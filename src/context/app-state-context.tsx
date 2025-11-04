
'use client';

import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import * as data from '@/lib/data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
    const { user } = useUser();
    const firestore = useFirestore();

    // Still using local storage for user profile and company info for now
    const [companyName, setCompanyName] = useLocalStorage<string>('companyName', data.companyProfile.name);
    const [companyLogoUrl, setCompanyLogoUrl] = useLocalStorage<string>('companyLogoUrl', data.companyProfile.logoUrl);
    const [userName, setUserName] = useLocalStorage<string>('userName', data.appUser.name);
    const [userAvatarUrl, setUserAvatarUrl] = useLocalStorage<string>('userAvatarUrl', data.appUser.avatarUrl);
    const [userEmail, setUserEmail] = useLocalStorage<string>('userEmail', data.appUser.email);
    const [userPhone, setUserPhone] = useLocalStorage<string>('userPhone', "(555) 123-4567");
    const [userJobTitle, setUserJobTitle] = useLocalStorage<string>('userJobTitle', "Admin");
    const [userDepartment, setUserDepartment] = useLocalStorage<string>('userDepartment', "Construction");
    const [userBio, setUserBio] = useLocalStorage<string>('userBio', "");

    const projectsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/projects`) : null, [firestore, user]);
    const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsCollectionRef);

    const budgetCategoriesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null, [firestore, user]);
    const { data: budgetCategoriesData } = useCollection<BudgetCategory>(budgetCategoriesCollectionRef);
    const [budgetCategories, setBudgetCategories] = useLocalStorage<BudgetCategory[]>('budgetCategories', data.budgetCategories);


    const vendorsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/vendors`) : null, [firestore, user]);
    const { data: vendorsData } = useCollection<Vendor>(vendorsCollectionRef);
    const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', data.vendors);

    const budgetItemsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetItems`) : null, [firestore, user]);
    const { data: budgetItemsData } = useCollection<BudgetItem>(budgetItemsCollectionRef);
    const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('budgetItems', data.budgetItems);


    const teamMembersCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/teamMembers`) : null, [firestore, user]);
    const { data: teamMembersData } = useCollection<TeamMember>(teamMembersCollectionRef);
    const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', data.teamMembers);


    const tasksCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/tasks`) : null, [firestore, user]);
    const { data: tasksData } = useCollection<Task>(tasksCollectionRef);
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', data.tasks);


    const expensesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/expenses`) : null, [firestore, user]);
    const { data: expensesData } = useCollection<Expense>(expensesCollectionRef);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', data.expenses);


    const changeOrdersCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/changeOrders`) : null, [firestore, user]);
    const { data: changeOrdersData } = useCollection<ChangeOrder>(changeOrdersCollectionRef);
    const [changeOrders, setChangeOrders] = useLocalStorage<ChangeOrder[]>('changeOrders', data.changeOrders);


    const rfisCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/rfis`) : null, [firestore, user]);
    const { data: rfisData } = useCollection<RFI>(rfisCollectionRef);
    const [rfis, setRfis] = useLocalStorage<RFI[]>('rfis', data.rfis);


    const issuesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/issues`) : null, [firestore, user]);
    const { data: issuesData } = useCollection<Issue>(issuesCollectionRef);
    const [issues, setIssues] = useLocalStorage<Issue[]>('issues', data.issues);


    const milestonesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/milestones`) : null, [firestore, user]);
    const { data: milestonesData } = useCollection<Milestone>(milestonesCollectionRef);
    const [milestones, setMilestones] = useLocalStorage<Milestone[]>('milestones', data.milestones);


    const addProject = (project: Omit<Project, 'id'>) => {
        if (!projectsCollectionRef) return;
        addDocumentNonBlocking(projectsCollectionRef, project);
    };

    const updateProject = (project: Project) => {
        if (!projectsCollectionRef) return;
        const projectRef = doc(projectsCollectionRef, project.id);
        updateDocumentNonBlocking(projectRef, project);
    };

    const deleteProject = (projectId: string) => {
        if (!projectsCollectionRef) return;
        const projectRef = doc(projectsCollectionRef, projectId);
        deleteDocumentNonBlocking(projectRef);
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
    projects: projects ?? [],
    addProject,
    updateProject,
    deleteProject,
    budgetCategories: budgetCategoriesData ?? [],
    setBudgetCategories,
    vendors: vendorsData ?? [],
    setVendors,
    budgetItems: budgetItemsData ?? [],
    setBudgetItems,
    teamMembers: teamMembersData ?? [],
    setTeamMembers,
    tasks: tasksData ?? [],
    setTasks,
    expenses: expensesData ?? [],
    setExpenses,
    changeOrders: changeOrdersData ?? [],
    setChangeOrders,
    rfis: rfisData ?? [],
    setRfis,
    issues: issuesData ?? [],
    setIssues,
    milestones: milestonesData ?? [],
    setMilestones
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
