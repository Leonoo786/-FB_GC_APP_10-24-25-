

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  
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
    const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsCollectionRef);
    
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

    // For simplicity, profile/company info remains local. Could be moved to a 'users' collection doc.
    const [companyName, setCompanyName] = React.useState('Fancy Brothers Constructions APP');
    const [companyLogoUrl, setCompanyLogoUrl] = React.useState('/your-logo.svg');
    const [userName, setUserName] = React.useState('John Doe');
    const [userAvatarUrl, setUserAvatarUrl] = React.useState('https://i.pravatar.cc/150?u=john');
    const [userEmail, setUserEmail] = React.useState('john.doe@constructai.com');
    const [userPhone, setUserPhone] = React.useState('');
    const [userJobTitle, setUserJobTitle] = React.useState('');
    const [userDepartment, setUserDepartment] = React.useState('');
    const [userBio, setUserBio] = React.useState('');


    const createSetter = <T extends {id: string}>(collectionRef: any) => (items: T[]) => {
      if (!collectionRef) return;
      items.forEach(item => {
        const docRef = doc(collectionRef, item.id);
        setDoc(docRef, item, { merge: true });
      });
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

