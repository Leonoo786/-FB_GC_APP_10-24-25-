

'use client';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone } from '@/lib/types';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProject: (project: Omit<Project, 'id' | 'ownerId'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;

  budgetCategories: BudgetCategory[];
  setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>;
  addBudgetCategory: (category: Omit<BudgetCategory, 'id' | 'ownerId'>) => void;

  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'ownerId'>) => void;

  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;

  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;

  budgetItems: BudgetItem[];
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  
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

    const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userData } = useDoc(userDocRef);

    const projectsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/projects`) : null, [firestore, user]);
    const { data: projects } = useCollection<Project>(projectsCollectionRef);
    
    const budgetCategoriesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetCategories`) : null, [firestore, user]);
    const { data: budgetCategories } = useCollection<BudgetCategory>(budgetCategoriesCollectionRef);

    const vendorsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/vendors`) : null, [firestore, user]);
    const { data: vendors } = useCollection<Vendor>(vendorsCollectionRef);
    
    const teamMembersCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/teamMembers`) : null, [firestore, user]);
    const { data: teamMembers } = useCollection<TeamMember>(teamMembersCollectionRef);

    const tasksCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/tasks`) : null, [firestore, user]);
    const { data: tasks } = useCollection<Task>(tasksCollectionRef);

    const budgetItemsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/budgetItems`) : null, [firestore, user]);
    const { data: budgetItems } = useCollection<BudgetItem>(budgetItemsCollectionRef);

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

    const companyProfileDocRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/company/profile`) : null, [firestore, user]);
    const { data: companyProfileData } = useDoc(companyProfileDocRef);

    const value = useMemo((): AppStateContextType => {
      const db = firestore;

      const updateUserDoc = (data: any) => {
        if(userDocRef) {
          setDocumentNonBlocking(userDocRef, data, { merge: true });
        }
      }

      const updateCompanyDoc = (data: any) => {
        if(companyProfileDocRef) {
          setDocumentNonBlocking(companyProfileDocRef, data, { merge: true });
        }
      }

      return {
        userName: userData?.name ?? '',
        setUserName: (name: string) => updateUserDoc({ name }),
        userAvatarUrl: userData?.avatarUrl ?? '',
        setUserAvatarUrl: (avatarUrl: string) => updateUserDoc({ avatarUrl }),
        userEmail: userData?.email ?? '',
        setUserEmail: (email: string) => updateUserDoc({ email }),
        userPhone: userData?.phone ?? '',
        setUserPhone: (phone: string) => updateUserDoc({ phone }),
        userJobTitle: userData?.jobTitle ?? '',
        setUserJobTitle: (jobTitle: string) => updateUserDoc({ jobTitle }),
        userDepartment: userData?.department ?? '',
        setUserDepartment: (department: string) => updateUserDoc({ department }),
        userBio: userData?.bio ?? '',
        setUserBio: (bio: string) => updateUserDoc({ bio }),

        companyName: companyProfileData?.name ?? 'ConstructAI',
        setCompanyName: (name: string) => updateCompanyDoc({ name }),
        companyLogoUrl: companyProfileData?.logoUrl ?? '/your-logo.png',
        setCompanyLogoUrl: (logoUrl: string) => updateCompanyDoc({ logoUrl }),
        
        projects: projects ?? [],
        setProjects: () => {}, // Handled by useCollection
        addProject: (project: Omit<Project, 'id' | 'ownerId'>) => {
          if (projectsCollectionRef) addDocumentNonBlocking(projectsCollectionRef, { ...project, ownerId: user!.uid });
        },
        updateProject: (project: Project) => {
          if (user) {
            const projectRef = doc(firestore, `users/${user.uid}/projects`, project.id);
            setDocumentNonBlocking(projectRef, project, { merge: true });
          }
        },
        deleteProject: (projectId: string) => {
          if (user) {
            const projectRef = doc(firestore, `users/${user.uid}/projects`, projectId);
            deleteDocumentNonBlocking(projectRef);
          }
        },

        budgetCategories: budgetCategories ?? [],
        setBudgetCategories: () => {}, // Handled by useCollection
        addBudgetCategory: (category: Omit<BudgetCategory, 'id'|'ownerId'>) => {
            if (budgetCategoriesCollectionRef) addDocumentNonBlocking(budgetCategoriesCollectionRef, { ...category, ownerId: user!.uid });
        },

        vendors: vendors ?? [],
        setVendors: () => {}, // Handled by useCollection
        addVendor: (vendor: Omit<Vendor, 'id'|'ownerId'>) => {
            if(vendorsCollectionRef) addDocumentNonBlocking(vendorsCollectionRef, { ...vendor, ownerId: user!.uid });
        },

        teamMembers: teamMembers ?? [],
        setTeamMembers: () => {},

        tasks: tasks ?? [],
        setTasks: () => {},

        budgetItems: budgetItems ?? [],
        setBudgetItems: () => {},
        
        expenses: expenses ?? [],
        setExpenses: () => {},

        changeOrders: changeOrders ?? [],
        setChangeOrders: () => {},
        
        rfis: rfis ?? [],
        setRfis: () => {},

        issues: issues ?? [],
        setIssues: () => {},
        
        milestones: milestones ?? [],
        setMilestones: () => {},
      };
    }, [
        firestore, user, userDocRef, userData, 
        projects, projectsCollectionRef,
        budgetCategories, budgetCategoriesCollectionRef,
        vendors, vendorsCollectionRef,
        teamMembers,
        tasks,
        budgetItems,
        expenses,
        changeOrders,
        rfis,
        issues,
        milestones,
        companyProfileDocRef, companyProfileData
    ]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
