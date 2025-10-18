
import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense, ChangeOrder } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const teamMembers: TeamMember[] = [
    { id: '1', name: 'John Doe', role: 'Project Manager', email: 'john.d@company.com', phone: '123-456-7890', avatarUrl: 'https://i.pravatar.cc/150?u=john' },
    { id: '2', name: 'Jane Smith', role: 'Site Superintendent', email: 'jane.s@company.com', phone: '123-456-7891', avatarUrl: 'https://i.pravatar.cc/150?u=jane' },
    { id: '3', name: 'Mike Johnson', role: 'Estimator', email: 'mike.j@company.com', phone: '123-456-7892', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
];

export const vendors: Vendor[] = [
    { "id": "1", "name": "A-1 Electric", "contactPerson": "Sarah Connor", "phone": "555-0101", "email": "sarah.c@a1electric.com", "trade": "Electrical" },
    { "id": "2", "name": "Bedrock Concrete", "contactPerson": "Fred Flintstone", "phone": "555-0102", "email": "fred.f@bedrock.com", "trade": "Concrete" },
    { "id": "3", "name": "Wayne Enterprises Steel", "contactPerson": "Lucius Fox", "phone": "555-0103", "email": "lucius.f@waynesteel.com", "trade": "Steel Erection" },
    { "id": "4", "name": "Evergreen Landscaping", "contactPerson": "Pamela Isley", "phone": "555-0104", "email": "pam.i@evergreen.com", "trade": "Landscaping" },
    { "id": "5", "name": "Best-in-Class Plumbing", "contactPerson": "Mario Brothers", "phone": "555-0105", "email": "mario@bicplumbing.com", "trade": "Plumbing" },
    { "id": "6", "name": "Sherwood Forest Framers", "contactPerson": "Robin Hood", "phone": "555-0106", "email": "robin.h@sherwood.com", "trade": "Framing" },
    { "id": "7", "name": "Stark Industries HVAC", "contactPerson": "Tony Stark", "phone": "555-0107", "email": "tony.s@starkhvac.com", "trade": "HVAC" },
    { "id": "8", "name": "Asgard Roofing", "contactPerson": "Thor Odinson", "phone": "555-0108", "email": "thor.o@asgardroofing.com", "trade": "Roofing" },
    { "id": "9", "name": "Daily Planet Glass", "contactPerson": "Clark Kent", "phone": "555-0109", "email": "clark.k@dailyplanet.com", "trade": "Glass & Glazing" },
    { "id": "10", "name": "Pym Particles Painting", "contactPerson": "Hank Pym", "phone": "555-0110", "email": "hank.p@pympainting.com", "trade": "Painting" }
];

export const budgetCategories: BudgetCategory[] = [];

export const projects: Project[] = [];

export const tasks: Task[] = [
  { id: '1', projectId: '1', title: 'Submit plumbing submittals', status: 'To Do', priority: 'High', assigneeId: '1', dueDate: '2024-08-15' },
  { id: '2', projectId: '1', title: 'Review structural drawings for steel quantities', status: 'To Do', priority: 'Medium', assigneeId: '2', dueDate: '2024-08-20' },
  { id: '3', projectId: '1', title: 'Coordinate MRI delivery', status: 'To Do', priority: 'High', assigneeId: '1', dueDate: '2024-08-25' },
  { id: '4', projectId: '1', title: 'Finalize lobby lighting package', status: 'In Progress', priority: 'High', assigneeId: '3', dueDate: '2024-08-18' },
  { id: '5', projectId: '1', title: 'Onboard new electrical subcontractor', status: 'In Progress', priority: 'Medium', assigneeId: '1', dueDate: '2024-08-10' },
  { id: '6', projectId: '1', title: 'Complete site safety audit', status: 'Done', priority: 'High', assigneeId: '2', dueDate: '2024-07-30' },
  { id: '7', projectId: '1', title: 'Install nurse call system', status: 'Done', priority: 'Medium', assigneeId: '3', dueDate: '2024-08-05' },
];

export const rfis: RFI[] = [];

export const issues: Issue[] = [];

export const budgetItems: BudgetItem[] = [];

export const expenses: Expense[] = [];

export const changeOrders: ChangeOrder[] = [];
