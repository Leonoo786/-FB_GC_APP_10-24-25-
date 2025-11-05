
import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense, ChangeOrder, Milestone, AppUser, CompanyProfile } from './types';
import { PlaceHolderImages } from './placeholder-images';

// This file now serves as a fallback for initial local development
// but will be superseded by data from Firebase once the user logs in.

export const companyProfile: CompanyProfile = {
  id: 'comp-1',
  name: 'Fancy Brothers Constructions APP',
  logoUrl: '/your-logo.svg',
};

export const appUser: AppUser = {
  id: 'user-4',
  name: 'John Doe',
  email: 'john.doe@constructai.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=john',
  phone: '(555) 123-4567',
  jobTitle: 'Admin',
  department: 'Construction',
  bio: 'Experienced construction professional managing projects for Fancy Brothers Constructions.'
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
