
'use client';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type AppStateContextType = {
  // User Profile
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
  
  // Data Collections
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
    const { data: budgetCategoriesData, isLoading: budgetCategoriesLoading } = useCollection<BudgetCategory>(budgetCategoriesCol);

    const vendorsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/vendors`) : null), [user, firestore]);
    const { data: vendorsData, isLoading: vendorsLoading } = useCollection<Vendor>(vendorsCol);

    const budgetItemsCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/budgetItems`) : null), [user, firestore]);
    const { data: budgetItemsData, isLoading: budgetItemsLoading } = useCollection<BudgetItem>(budgetItemsCol);

    const teamMembersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/teamMembers`) : null), [user, firestore]);
    const { data: teamMembersData, isLoading: teamMembersLoading } = useCollection<TeamMember>(teamMembersCol);

    const tasksCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/tasks`) : null), [user, firestore]);
    const { data: tasksData, isLoading: tasksLoading } = useCollection<Task>(tasksCol);

    const expensesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/expenses`) : null), [user, firestore]);
    const { data: expensesData, isLoading: expensesLoading } = useCollection<Expense>(expensesCol);

    const changeOrdersCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/changeOrders`) : null), [user, firestore]);
    const { data: changeOrdersData, isLoading: changeOrdersLoading } = useCollection<ChangeOrder>(changeOrdersCol);

    const rfisCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/rfis`) : null), [user, firestore]);
    const { data: rfisData, isLoading: rfisLoading } = useCollection<RFI>(rfisCol);

    const issuesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/issues`) : null), [user, firestore]);
    const { data: issuesData, isLoading: issuesLoading } = useCollection<Issue>(issuesCol);

    const milestonesCol = useMemoFirebase(() => (user ? collection(firestore, `users/${user.uid}/milestones`) : null), [user, firestore]);
    const { data: milestonesData, isLoading: milestonesLoading } = useCollection<Milestone>(milestonesCol);

    const isLoading = userLoading || projectsLoading || budgetCategoriesLoading || vendorsLoading || budgetItemsLoading || teamMembersLoading || tasksLoading || expensesLoading || changeOrdersLoading || rfisLoading || issuesLoading || milestonesLoading;
    
    const addProject = async (projectData: Omit<Project, 'id'>) => {
        if (!projectsCol) return;
        await addDocumentNonBlocking(projectsCol, projectData);
    };

    const updateProject = async (projectData: Project) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, projectData.id);
        setDocumentNonBlocking(projectDocRef, projectData, { merge: true });
    };

    const deleteProject = async (projectId: string) => {
        if (!user || !firestore) return;
        const projectDocRef = doc(firestore, `users/${user.uid}/projects`, projectId);
        await deleteDocumentNonBlocking(projectDocRef);
    };

    const value: AppStateContextType = useMemo(() => ({
        companyName: userData?.companyName || '',
        setCompanyName: (name: string) => userDocRef && setDocumentNonBlocking(userDocRef, { companyName: name }, { merge: true }),
        companyLogoUrl: userData?.companyLogoUrl || '',
        setCompanyLogoUrl: (url: string) => userDocRef && setDocumentNonBlocking(userDocRef, { companyLogoUrl: url }, { merge: true }),
        userName: userData?.name || '',
        setUserName: (name: string) => userDocRef && setDocumentNonBlocking(userDocRef, { name: name }, { merge: true }),
        userAvatarUrl: userData?.avatarUrl || '',
        setUserAvatarUrl: (url: string) => userDocRef && setDocumentNonBlocking(userDocRef, { avatarUrl: url }, { merge: true }),
        userEmail: userData?.email || '',
        setUserEmail: (email: string) => userDocRef && setDocumentNonBlocking(userDocRef, { email: email }, { merge: true }),
        userPhone: userData?.phone || '',
        setUserPhone: (phone: string) => userDocRef && setDocumentNonBlocking(userDocRef, { phone: phone }, { merge: true }),
        userJobTitle: userData?.jobTitle || '',
        setUserJobTitle: (title: string) => userDocRef && setDocumentNonBlocking(userDocRef, { jobTitle: title }, { merge: true }),
        userDepartment: userData?.department || '',
        setUserDepartment: (dept: string) => userDocRef && setDocumentNonBlocking(userDocRef, { department: dept }, { merge: true }),
        userBio: userData?.bio || '',
        setUserBio: (bio: string) => userDocRef && setDocumentNonBlocking(userDocRef, { bio: bio }, { merge: true }),

        projects: projects || [],
        addProject,
        updateProject,
        deleteProject,
        
        budgetCategories: budgetCategoriesData || [],
        setBudgetCategories: (items) => { if(budgetCategoriesCol) items.forEach(item => setDocumentNonBlocking(doc(budgetCategoriesCol, item.id), item, { merge: true }))},
        
        vendors: vendorsData || [],
        setVendors: (items) => { if(vendorsCol) items.forEach(item => setDocumentNonBlocking(doc(vendorsCol, item.id), item, { merge: true }))},
        
        budgetItems: budgetItemsData || [],
        setBudgetItems: (items) => { if(budgetItemsCol) items.forEach(item => setDocumentNonBlocking(doc(budgetItemsCol, item.id), item, { merge: true }))},
        
        teamMembers: teamMembersData || [],
        setTeamMembers: (items) => { if(teamMembersCol) items.forEach(item => setDocumentNonBlocking(doc(teamMembersCol, item.id), item, { merge: true }))},
        
        tasks: tasksData || [],
        setTasks: (items) => { if(tasksCol) items.forEach(item => setDocumentNonBlocking(doc(tasksCol, item.id), item, { merge: true }))},
        
        expenses: expensesData || [],
        setExpenses: (items) => { if(expensesCol) items.forEach(item => setDocumentNonBlocking(doc(expensesCol, item.id), item, { merge: true }))},
        
        changeOrders: changeOrdersData || [],
        setChangeOrders: (items) => { if(changeOrdersCol) items.forEach(item => setDocumentNonBlocking(doc(changeOrdersCol, item.id), item, { merge: true }))},

        rfis: rfisData || [],
        setRfis: (items) => { if(rfisCol) items.forEach(item => setDocumentNonBlocking(doc(rfisCol, item.id), item, { merge: true }))},
        
        issues: issuesData || [],
        setIssues: (items) => { if(issuesCol) items.forEach(item => setDocumentNonBlocking(doc(issuesCol, item.id), item, { merge: true }))},
        
        milestones: milestonesData || [],
        setMilestones: (items) => { if(milestonesCol) items.forEach(item => setDocumentNonBlocking(doc(milestonesCol, item.id), item, { merge: true }))},
        isLoading,
      }), [
        userData, projects, budgetCategoriesData, vendorsData, budgetItemsData, 
        teamMembersData, tasksData, expensesData, changeOrdersData, rfisData, 
        issuesData, milestonesData, isLoading, userDocRef, projectsCol, budgetCategoriesCol, vendorsCol, budgetItemsCol, teamMembersCol, tasksCol, expensesCol, changeOrdersCol, rfisCol, issuesCol, milestonesCol
      ]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
