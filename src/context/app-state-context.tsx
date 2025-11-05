
'use client';

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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

    const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
    const { data: userData } = useDoc<AppUser>(userDocRef);

    const projectsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/projects`) : null), [user, firestore]);
    const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsCol);

    const budgetCategoriesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null), [user, firestore]);
    const { data: budgetCategoriesData, isLoading: budgetCategoriesLoading } = useCollection<BudgetCategory>(budgetCategoriesCol);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
     useEffect(() => { if (budgetCategoriesData) setBudgetCategories(budgetCategoriesData) }, [budgetCategoriesData]);

    const vendorsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/vendors`) : null), [user, firestore]);
    const { data: vendorsData, isLoading: vendorsLoading } = useCollection<Vendor>(vendorsCol);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    useEffect(() => { if (vendorsData) setVendors(vendorsData) }, [vendorsData]);
    
    const budgetItemsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetItems`) : null), [user, firestore]);
    const { data: budgetItemsData, isLoading: budgetItemsLoading } = useCollection<BudgetItem>(budgetItemsCol);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    useEffect(() => { if (budgetItemsData) setBudgetItems(budgetItemsData) }, [budgetItemsData]);
    

    const teamMembersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/teamMembers`) : null), [user, firestore]);
    const { data: teamMembersData, isLoading: teamMembersLoading } = useCollection<TeamMember>(teamMembersCol);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    useEffect(() => { if (teamMembersData) setTeamMembers(teamMembersData) }, [teamMembersData]);
    
    const tasksCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/tasks`) : null), [user, firestore]);
    const { data: tasksData, isLoading: tasksLoading } = useCollection<Task>(tasksCol);
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => { if (tasksData) setTasks(tasksData) }, [tasksData]);

    const expensesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/expenses`) : null), [user, firestore]);
    const { data: expensesData, isLoading: expensesLoading } = useCollection<Expense>(expensesCol);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    useEffect(() => { if (expensesData) setExpenses(expensesData) }, [expensesData]);
    

    const changeOrdersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/changeOrders`) : null), [user, firestore]);
    const { data: changeOrdersData, isLoading: changeOrdersLoading } = useCollection<ChangeOrder>(changeOrdersCol);
    const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
    useEffect(() => { if (changeOrdersData) setChangeOrders(changeOrdersData) }, [changeOrdersData]);

    const rfisCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/rfis`) : null), [user, firestore]);
    const { data: rfisData, isLoading: rfisLoading } = useCollection<RFI>(rfisCol);
    const [rfis, setRfis] = useState<RFI[]>([]);
    useEffect(() => { if (rfisData) setRfis(rfisData) }, [rfisData]);

    const issuesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/issues`) : null), [user, firestore]);
    const { data: issuesData, isLoading: issuesLoading } = useCollection<Issue>(issuesCol);
    const [issues, setIssues] = useState<Issue[]>([]);
    useEffect(() => { if (issuesData) setIssues(issuesData) }, [issuesData]);

    const milestonesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/milestones`) : null), [user, firestore]);
    const { data: milestonesData, isLoading: milestonesLoading } = useCollection<Milestone>(milestonesCol);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    useEffect(() => { if (milestonesData) setMilestones(milestonesData) }, [milestonesData]);


    const addProject = async (project: Omit<Project, 'id'>) => {
        if (!projectsCol) return;
        await addDoc(projectsCol, project);
    };

    const updateProject = async (project: Project) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, project.id);
        await updateDoc(projectDocRef, {...project});
    };

    const deleteProject = async (projectId: string) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, projectId);
        await deleteDoc(projectDocRef);
    };


  const value: AppStateContextType = {
    companyName: userData?.companyName || '',
    setCompanyName: (name: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { companyName: name }),
    companyLogoUrl: userData?.companyLogoUrl || '',
    setCompanyLogoUrl: (url: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { companyLogoUrl: url }),
    userName: userData?.userName || '',
    setUserName: (name: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { userName: name }),
    userAvatarUrl: userData?.userAvatarUrl || '',
    setUserAvatarUrl: (url: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { userAvatarUrl: url }),
    userEmail: userData?.userEmail || '',
    setUserEmail: (email: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { userEmail: email }),
    userPhone: '', // Add these if you extend the user model
    setUserPhone: () => {},
    userJobTitle: '',
    setUserJobTitle: () => {},
    userDepartment: '',
    setUserDepartment: () => {},
    userBio: '',
    setUserBio: () => {},

    projects: projects || [],
    addProject,
    updateProject,
    deleteProject,
    
    budgetCategories: budgetCategories || [],
    setBudgetCategories,
    
    vendors: vendors || [],
    setVendors,
    
    budgetItems: budgetItems || [],
    setBudgetItems,
    
    teamMembers: teamMembers || [],
    setTeamMembers,
    
    tasks: tasks || [],
    setTasks,
    
    expenses: expenses || [],
    setExpenses,
    
    changeOrders: changeOrders || [],
    setChangeOrders,

    rfis: rfis || [],
    setRfis,
    
    issues: issues || [],
    setIssues,
    
    milestones: milestones || [],
    setMilestones,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
