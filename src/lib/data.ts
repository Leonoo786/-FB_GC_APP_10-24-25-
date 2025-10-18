
import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense, ChangeOrder } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const teamMembers: TeamMember[] = [];

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
