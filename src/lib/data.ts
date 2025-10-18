
import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense, ChangeOrder } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const teamMembers: TeamMember[] = [];

export const vendors: Vendor[] = [];

export const budgetCategories: BudgetCategory[] = [
    { id: '1', name: 'Ansul System' }, { id: '2', name: 'Bathroom Partitions' }, { id: '3', name: 'Bollards/Stoppers' }, { id: '4', name: 'Change Order' }, { id: '5', name: 'Cleaning' }, { id: '6', name: 'CMU' }, { id: '7', name: 'Doors/Hardware' }, { id: '8', name: 'Electrical' }, { id: '9', name: 'Exterior panels' }, { id: '10', name: 'Fences' }, { id: '11', name: 'Floor' }, { id: '12', name: 'Foundation Labor' }, { id: '13', name: 'Foundation Material' }, { id: '14', name: 'Framing Labor' }, { id: '15', name: 'Framing Material' }, { id: '16', name: 'Fuel Canopy Labor' }, { id: '17', name: 'Fuel Canopy Material' }, { id: '18', name: 'HVAC' }, { id: '19', name: 'Millwork' }, { id: '20', name: 'Misc' }, { id: '21', name: 'Paint Labor' }, { id: '22', name: 'Paint Material' }, { id: '23', name: 'Permit' }, { id: '24', name: 'Plumbing' }, { id: '25', name: 'Roof' }, { id: '26', name: 'Sitework Labor' }, { id: '27', name: 'Sitework Material' }, { id: '28', name: 'Steel Labor' }, { id: '29', name: 'Steel Material' }, { id: '30', name: 'Store Front Glass' }, { id: '31', name: 'Striping' }, { id: '32', name: 'Stucco/Stone' }, { id: '33', name: 'Survey' }, { id: '34', name: 'Tiles Labor' }, { id: '35', name: 'Tiles Material' },
];

export const projects: Project[] = [];

export const tasks: Task[] = [];

export const rfis: RFI[] = [];

export const issues: Issue[] = [];

export const budgetItems: BudgetItem[] = [];

export const expenses: Expense[] = [];

export const changeOrders: ChangeOrder[] = [];
