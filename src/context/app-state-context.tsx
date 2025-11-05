
'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';
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
  setBudgetCategories: (items: BudgetCategory[]) => void;
  
  vendors: Vendor[];
  setVendors: (items: Vendor[]) => void;
  
  budgetItems: BudgetItem[];
  setBudgetItems: (items: BudgetItem[]) => void;
  
  teamMembers: TeamMember[];
  setTeamMembers: (items: TeamMember[]) => void;
  
  tasks: Task[];
  setTasks: (items: Task[]) => void;
  
  expenses: Expense[];
  setExpenses: (items: Expense[]) => void;
  
  changeOrders: ChangeOrder[];
  setChangeOrders: (items: ChangeOrder[]) => void;
  
  rfis: RFI[];
  setRfis: (items: RFI[]) => void;
  
  issues: Issue[];
  setIssues: (items: Issue[]) => void;
  
  milestones: Milestone[];
  setMilestones: (items: Milestone[]) => void;
  
  isLoading: boolean;
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
    const { data: userData, isLoading: userLoading } = useDoc<AppUser>(userDocRef);

    const projectsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/projects`) : null), [user, firestore]);
    const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsCol);

    const budgetCategoriesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null), [user, firestore]);
    const { data: budgetCategories, isLoading: budgetCategoriesLoading } = useCollection<BudgetCategory>(budgetCategoriesCol);

    const vendorsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/vendors`) : null), [user, firestore]);
    const { data: vendors, isLoading: vendorsLoading } = useCollection<Vendor>(vendorsCol);
    
    const budgetItemsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetItems`) : null), [user, firestore]);
    const { data: budgetItems, isLoading: budgetItemsLoading } = useCollection<BudgetItem>(budgetItemsCol);

    const teamMembersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/teamMembers`) : null), [user, firestore]);
    const { data: teamMembers, isLoading: teamMembersLoading } = useCollection<TeamMember>(teamMembersCol);
    
    const tasksCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/tasks`) : null), [user, firestore]);
    const { data: tasks, isLoading: tasksLoading } = useCollection<Task>(tasksCol);

    const expensesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/expenses`) : null), [user, firestore]);
    const { data: expenses, isLoading: expensesLoading } = useCollection<Expense>(expensesCol);

    const changeOrdersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/changeOrders`) : null), [user, firestore]);
    const { data: changeOrders, isLoading: changeOrdersLoading } = useCollection<ChangeOrder>(changeOrdersCol);

    const rfisCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/rfis`) : null), [user, firestore]);
    const { data: rfis, isLoading: rfisLoading } = useCollection<RFI>(rfisCol);

    const issuesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/issues`) : null), [user, firestore]);
    const { data: issues, isLoading: issuesLoading } = useCollection<Issue>(issuesCol);

    const milestonesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/milestones`) : null), [user, firestore]);
    const { data: milestones, isLoading: milestonesLoading } = useCollection<Milestone>(milestonesCol);
    
    const isLoading = userLoading || projectsLoading || budgetCategoriesLoading || vendorsLoading || budgetItemsLoading || teamMembersLoading || tasksLoading || expensesLoading || changeOrdersLoading || rfisLoading || issuesLoading || milestonesLoading;

    const addProject = async (project: Omit<Project, 'id'>) => {
        if (!projectsCol) return;
        addDocumentNonBlocking(projectsCol, project);
    };

    const updateProject = async (project: Project) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, project.id);
        updateDocumentNonBlocking(projectDocRef, {...project});
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
    userName: userData?.name || '',
    setUserName: (name: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { name: name }),
    userAvatarUrl: userData?.avatarUrl || '',
    setUserAvatarUrl: (url: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { avatarUrl: url }),
    userEmail: userData?.email || '',
    setUserEmail: (email: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { email: email }),
    userPhone: userData?.phone || '',
    setUserPhone: (phone: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { phone: phone }),
    userJobTitle: userData?.jobTitle || '',
    setUserJobTitle: (title: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { jobTitle: title }),
    userDepartment: userData?.department || '',
    setUserDepartment: (dept: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { department: dept }),
    userBio: userData?.bio || '',
    setUserBio: (bio: string) => userDocRef && updateDocumentNonBlocking(userDocRef, { bio: bio }),

    projects: projects || [],
    addProject,
    updateProject,
    deleteProject,
    
    budgetCategories: budgetCategories || [],
    setBudgetCategories: (items) => items.forEach(item => budgetCategoriesCol && setDocumentNonBlocking(doc(budgetCategoriesCol, item.id), item, { merge: true })),
    
    vendors: vendors || [],
    setVendors: (items) => items.forEach(item => vendorsCol && setDocumentNonBlocking(doc(vendorsCol, item.id), item, { merge: true })),
    
    budgetItems: budgetItems || [],
    setBudgetItems: (items) => items.forEach(item => budgetItemsCol && setDocumentNonBlocking(doc(budgetItemsCol, item.id), item, { merge: true })),
    
    teamMembers: teamMembers || [],
    setTeamMembers: (items) => items.forEach(item => teamMembersCol && setDocumentNonBlocking(doc(teamMembersCol, item.id), item, { merge: true })),
    
    tasks: tasks || [],
    setTasks: (items) => items.forEach(item => tasksCol && setDocumentNonBlocking(doc(tasksCol, item.id), item, { merge: true })),
    
    expenses: expenses || [],
    setExpenses: (items) => items.forEach(item => expensesCol && setDocumentNonBlocking(doc(expensesCol, item.id), item, { merge: true })),
    
    changeOrders: changeOrders || [],
    setChangeOrders: (items) => items.forEach(item => changeOrdersCol && setDocumentNonBlocking(doc(changeOrdersCol, item.id), item, { merge: true })),

    rfis: rfis || [],
    setRfis: (items) => items.forEach(item => rfisCol && setDocumentNonBlocking(doc(rfisCol, item.id), item, { merge: true })),
    
    issues: issues || [],
    setIssues: (items) => items.forEach(item => issuesCol && setDocumentNonBlocking(doc(issuesCol, item.id), item, { merge: true })),
    
    milestones: milestones || [],
    setMilestones: (items) => items.forEach(item => milestonesCol && setDocumentNonBlocking(doc(milestonesCol, item.id), item, { merge: true })),
    isLoading
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
