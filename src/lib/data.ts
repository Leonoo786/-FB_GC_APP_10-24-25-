
import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense, ChangeOrder, Milestone, AppUser, CompanyProfile } from './types';

// This file is intentionally left empty. Data is now fetched exclusively from Firebase.
// Default values for a new user are handled within the AppStateProvider.

export const companyProfile: CompanyProfile = {
  id: '',
  name: 'Fancy Brothers Constructions APP',
  logoUrl: '',
};

export const appUser: AppUser = {
  id: '',
  name: 'New User',
  email: '',
  avatarUrl: '',
  phone: '',
  jobTitle: '',
  department: '',
  bio: ''
};

export const teamMembers: TeamMember[] = [];
export const vendors: Vendor[] = [];
export const budgetCategories: BudgetCategory[] = [];
export const projects: Project[] = [];
export const tasks: Task[] = [];
export const rfis: RFI[] = [];
export const issues: Issue[] = [];
export const budgetItems: BudgetItem[] = [];
export const expenses: Expense[] = [];
export const changeOrders: ChangeOrder[] = [];
export const milestones: Milestone[] = [];
