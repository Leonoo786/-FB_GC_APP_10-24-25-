
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

    // User Profile Data
    const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
    const { data: userData } = useDoc<AppUser>(userDocRef);

    const [companyName, setCompanyName] = useState(data.companyProfile.name);
    const [companyLogoUrl, setCompanyLogoUrl] = useState(data.companyProfile.logoUrl);
    const [userName, setUserName] = useState(data.appUser.name);
    const [userAvatarUrl, setUserAvatarUrl] = useState(data.appUser.avatarUrl);
    const [userEmail, setUserEmail] = useState(data.appUser.email);
    const [userPhone, setUserPhone] = useState('');
    const [userJobTitle, setUserJobTitle] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userBio, setUserBio] = useState('');

    useEffect(() => {
        if (userData) {
            setCompanyName(userData.companyName || data.companyProfile.name);
            setCompanyLogoUrl(userData.companyLogoUrl || data.companyProfile.logoUrl);
            setUserName(userData.userName || data.appUser.name);
            setUserAvatarUrl(userData.userAvatarUrl || data.appUser.avatarUrl);
            setUserEmail(userData.userEmail || data.appUser.email);
        }
    }, [userData]);

    const handleUserUpdate = (field: keyof AppUser | 'companyName' | 'companyLogoUrl', value: string) => {
      if (userDocRef) {
        updateDocumentNonBlocking(userDocRef, { [field]: value });
      }
    };

    // Collections Data
    const projectsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/projects`) : null), [user, firestore]);
    const { data: projectsData } = useCollection<Project>(projectsCol);
    const [projects, setProjects] = useState<Project[]>(data.projects);
    useEffect(() => { if (projectsData) setProjects(projectsData) }, [projectsData]);

    const budgetCategoriesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null), [user, firestore]);
    const { data: budgetCategoriesData } = useCollection<BudgetCategory>(budgetCategoriesCol);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(data.budgetCategories);
    useEffect(() => { if (budgetCategoriesData) setBudgetCategories(budgetCategoriesData) }, [budgetCategoriesData]);

    const vendorsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/vendors`) : null), [user, firestore]);
    const { data: vendorsData } = useCollection<Vendor>(vendorsCol);
    const [vendors, setVendors] = useState<Vendor[]>(data.vendors);
    useEffect(() => { if (vendorsData) setVendors(vendorsData) }, [vendorsData]);
    
    const budgetItemsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetItems`) : null), [user, firestore]);
    const { data: budgetItemsData } = useCollection<BudgetItem>(budgetItemsCol);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(data.budgetItems);
    useEffect(() => { if (budgetItemsData) setBudgetItems(budgetItemsData) }, [budgetItemsData]);

    const teamMembersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/teamMembers`) : null), [user, firestore]);
    const { data: teamMembersData } = useCollection<TeamMember>(teamMembersCol);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(data.teamMembers);
    useEffect(() => { if (teamMembersData) setTeamMembers(teamMembersData) }, [teamMembersData]);
    
    const tasksCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/tasks`) : null), [user, firestore]);
    const { data: tasksData } = useCollection<Task>(tasksCol);
    const [tasks, setTasks] = useState<Task[]>(data.tasks);
    useEffect(() => { if (tasksData) setTasks(tasksData) }, [tasksData]);

    const expensesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/expenses`) : null), [user, firestore]);
    const { data: expensesData } = useCollection<Expense>(expensesCol);
    const [expenses, setExpenses] = useState<Expense[]>(data.expenses);
    useEffect(() => { if (expensesData) setExpenses(expensesData) }, [expensesData]);

    const changeOrdersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/changeOrders`) : null), [user, firestore]);
    const { data: changeOrdersData } = useCollection<ChangeOrder>(changeOrdersCol);
    const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(data.changeOrders);
    useEffect(() => { if (changeOrdersData) setChangeOrders(changeOrdersData) }, [changeOrdersData]);

    const rfisCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/rfis`) : null), [user, firestore]);
    const { data: rfisData } = useCollection<RFI>(rfisCol);
    const [rfis, setRfis] = useState<RFI[]>(data.rfis);
    useEffect(() => { if (rfisData) setRfis(rfisData) }, [rfisData]);

    const issuesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/issues`) : null), [user, firestore]);
    const { data: issuesData } = useCollection<Issue>(issuesCol);
    const [issues, setIssues] = useState<Issue[]>(data.issues);
    useEffect(() => { if (issuesData) setIssues(issuesData) }, [issuesData]);

    const milestonesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/milestones`) : null), [user, firestore]);
    const { data: milestonesData } = useCollection<Milestone>(milestonesCol);
    const [milestones, setMilestones] = useState<Milestone[]>(data.milestones);
    useEffect(() => { if (milestonesData) setMilestones(milestonesData) }, [milestonesData]);


    const addProject = async (project: Omit<Project, 'id'>) => {
        if (!projectsCol) return;
        addDocumentNonBlocking(projectsCol, project);
    };

    const updateProject = async (project: Project) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, project.id);
        updateDocumentNonBlocking(projectDocRef, project);
    };

    const deleteProject = async (projectId: string) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, projectId);
        deleteDocumentNonBlocking(projectDocRef);
    };


  const value = {
    companyName,
    setCompanyName: (name: string) => { setCompanyName(name); handleUserUpdate('companyName', name); },
    companyLogoUrl,
    setCompanyLogoUrl: (url: string) => { setCompanyLogoUrl(url); handleUserUpdate('companyLogoUrl', url); },
    userName,
    setUserName: (name: string) => { setUserName(name); handleUserUpdate('userName', name); },
    userAvatarUrl,
    setUserAvatarUrl: (url: string) => { setUserAvatarUrl(url); handleUserUpdate('userAvatarUrl', url); },
    userEmail,
    setUserEmail: (email: string) => { setUserEmail(email); handleUserUpdate('userEmail', email); },
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
    setBudgetCategories, // Assuming local for now
    
    vendors,
    setVendors, // Assuming local for now
    
    budgetItems,
    setBudgetItems, // Assuming local for now
    
    teamMembers,
    setTeamMembers, // Assuming local for now
    
    tasks,
    setTasks, // Assuming local for now
    
    expenses,
    setExpenses, // Assuming local for now
    
    changeOrders,
    setChangeOrders, // Assuming local for now

    rfis,
    setRfis, // Assuming local for now
    
    issues,
    setIssues, // Assuming local for now
    
    milestones,
    setMilestones, // Assuming local for now
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
