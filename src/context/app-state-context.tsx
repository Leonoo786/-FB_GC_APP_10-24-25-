

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
  setBudgetCategories: (items: BudgetCategory[]) => Promise<void>;
  
  vendors: Vendor[];
  setVendors: (items: Vendor[]) => Promise<void>;
  
  budgetItems: BudgetItem[];
  setBudgetItems: (items: BudgetItem[]) => Promise<void>;
  
  teamMembers: TeamMember[];
  setTeamMembers: (items: TeamMember[]) => Promise<void>;
  
  tasks: Task[];
  setTasks: (items: Task[]) => Promise<void>;
  
  expenses: Expense[];
  setExpenses: (items: Expense[]) => Promise<void>;
  
  changeOrders: ChangeOrder[];
  setChangeOrders: (items: ChangeOrder[]) => Promise<void>;
  
  rfis: RFI[];
  setRfis: (items: RFI[]) => Promise<void>;
  
  issues: Issue[];
  setIssues: (items: Issue[]) => Promise<void>;
  
  milestones: Milestone[];
  setMilestones: (items: Milestone[]) => Promise<void>;
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
    const { toast } = useToast();

    // Firebase Collections
    const projectsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/projects`) : null, [firestore, user]);
    const { data: projects } = useCollection<Project>(projectsCollectionRef);
    
    const budgetCategoriesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null, [firestore, user]);
    const { data: budgetCategories } = useCollection<BudgetCategory>(budgetCategoriesCollectionRef);
    
    const vendorsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/vendors`) : null, [firestore, user]);
    const { data: vendors } = useCollection<Vendor>(vendorsCollectionRef);

    const budgetItemsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetItems`) : null, [firestore, user]);
    const { data: budgetItems } = useCollection<BudgetItem>(budgetItemsCollectionRef);

    const teamMembersCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/teamMembers`) : null, [firestore, user]);
    const { data: teamMembers } = useCollection<TeamMember>(teamMembersCollectionRef);

    const tasksCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/tasks`) : null, [firestore, user]);
    const { data: tasks } = useCollection<Task>(tasksCollectionRef);

    const expensesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/expenses`) : null, [firestore, user]);
    const { data: expenses } = useCollection<Expense>(expensesCollectionRef);

    const changeOrdersCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/changeOrders`) : null, [firestore, user]);
    const { data: changeOrders } = useCollection<ChangeOrder>(changeOrdersCollectionRef);

    const rfisCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/rfis`) : null, [firestore, user]);
    const { data: rfis } = useCollection<RFI>(rfisCollectionRef);

    const issuesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/issues`) : null, [firestore, user]);
    const { data: issues } = useCollection<Issue>(issuesCollectionRef);

    const milestonesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/milestones`) : null, [firestore, user]);
    const { data: milestones } = useCollection<Milestone>(milestonesCollectionRef);

    // Profile info is now also from Firestore
    const userDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}`) : null, [firestore, user]);
    
    const [companyName, setCompanyName] = React.useState('Fancy Brothers Constructions APP');
    const [companyLogoUrl, setCompanyLogoUrl] = React.useState('/your-logo.svg');
    const [userName, setUserName] = React.useState('John Doe');
    const [userAvatarUrl, setUserAvatarUrl] = React.useState('https://i.pravatar.cc/150?u=john');
    const [userEmail, setUserEmail] = React.useState('john.doe@constructai.com');
    const [userPhone, setUserPhone] = React.useState('');
    const [userJobTitle, setUserJobTitle] = React.useState('');
    const [userDepartment, setUserDepartment] = React.useState('');
    const [userBio, setUserBio] = React.useState('');
    
    const createSetter = <T extends {id: string}>(collectionRef: any) => async (items: T[]) => {
      if (!collectionRef) return;
      const batch = writeBatch(firestore);
      items.forEach(item => {
        const docRef = doc(collectionRef, item.id);
        batch.set(docRef, item, { merge: true });
      });
      await batch.commit();
    };

    const addProject = async (project: Omit<Project, 'id'>) => {
        if (!projectsCollectionRef) return;
        await addDoc(projectsCollectionRef, project);
    };

    const updateProject = async (project: Project) => {
        if (!projectsCollectionRef) return;
        const projectRef = doc(projectsCollectionRef, project.id);
        await updateDoc(projectRef, project);
    };

    const deleteProject = async (projectId: string) => {
        if (!projectsCollectionRef) return;
        const projectRef = doc(projectsCollectionRef, projectId);
        await deleteDoc(projectRef);
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
    
    budgetCategories: budgetCategories ?? [],
    setBudgetCategories: createSetter(budgetCategoriesCollectionRef),
    
    vendors: vendors ?? [],
    setVendors: createSetter(vendorsCollectionRef),
    
    budgetItems: budgetItems ?? [],
    setBudgetItems: createSetter(budgetItemsCollectionRef),
    
    teamMembers: teamMembers ?? [],
    setTeamMembers: createSetter(teamMembersCollectionRef),
    
    tasks: tasks ?? [],
    setTasks: createSetter(tasksCollectionRef),
    
    expenses: expenses ?? [],
    setExpenses: createSetter(expensesCollectionRef),
    
    changeOrders: changeOrders ?? [],
    setChangeOrders: createSetter(changeOrdersCollectionRef),

    rfis: rfis ?? [],
    setRfis: createSetter(rfisCollectionRef),
    
    issues: issues ?? [],
    setIssues: createSetter(issuesCollectionRef),
    
    milestones: milestones ?? [],
    setMilestones: createSetter(milestonesCollectionRef),
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
