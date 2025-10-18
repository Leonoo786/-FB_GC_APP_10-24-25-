import type { Project, TeamMember, Vendor, BudgetCategory, Task, RFI, Issue, BudgetItem, Expense } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'John Doe', role: 'Project Manager', email: 'john.doe@constructai.com', phone: '123-456-7890', avatarUrl: 'https://i.pravatar.cc/150?u=john' },
  { id: '2', name: 'Jane Smith', role: 'Site Superintendent', email: 'jane.smith@constructai.com', phone: '234-567-8901', avatarUrl: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', name: 'Mike Johnson', role: 'Estimator', email: 'mike.johnson@constructai.com', phone: '345-678-9012', avatarUrl: 'https://i.pravatar.cc/150?u=mike' },
  { id: '4', name: 'Emily Davis', role: 'Architect', email: 'emily.davis@constructai.com', phone: '456-789-0123', avatarUrl: 'https://i.pravatar.cc/150?u=emily' },
];

export const vendors: Vendor[] = [
    { id: '1', name: 'A & G Electric', contactPerson: 'Alex Green', phone: '555-0101', email: 'contact@agelectric.com', trade: 'Electrical' },
    { id: '2', name: 'A Morfin Trucking LLC', contactPerson: 'Ana Morfin', phone: '555-0102', email: 'contact@amorfintrucking.com', trade: 'Hauling' },
    { id: '3', name: 'ACT PIPE AND SUPPLY, INC.', contactPerson: 'Bob Vance', phone: '555-0103', email: 'sales@actpipe.com', trade: 'Plumbing' },
    { id: '4', name: 'Action Gypsum', contactPerson: 'Charlie Day', phone: '555-0104', email: 'support@actiongypsum.com', trade: 'Drywall' },
    { id: '5', name: 'Concrete Cleaning Inc.', contactPerson: 'Connie Clean', phone: '555-0105', email: 'info@concretecleaning.com', trade: 'Concrete' },
    { id: '6', name: 'Leon Plumbing', contactPerson: 'Leon Pipes', phone: '555-0106', email: 'leon@leonplumbing.com', trade: 'Plumbing' },
    { id: '7', name: 'Sherwin Williams', contactPerson: 'Sheryl Williams', phone: '555-0107', email: 'paint@sherwin.com', trade: 'Paint' },
    { id: '8', name: 'Texas Shield Roofing LLC', contactPerson: 'Tex Hooper', phone: '555-0108', email: 'contact@texasshield.com', trade: 'Roofing' },
];

export const budgetCategories: BudgetCategory[] = [
    { id: '1', name: 'Ansul System' }, { id: '2', name: 'Bathroom Partitions' }, { id: '3', name: 'Bollards/Stoppers' }, { id: '4', name: 'Change Order' }, { id: '5', name: 'Cleaning' }, { id: '6', name: 'CMU' }, { id: '7', name: 'Doors/Hardware' }, { id: '8', name: 'Electrical' }, { id: '9', name: 'Exterior panels' }, { id: '10', name: 'Fences' }, { id: '11', name: 'Floor' }, { id: '12', name: 'Foundation Labor' }, { id: '13', name: 'Foundation Material' }, { id: '14', name: 'Framing Labor' }, { id: '15', name: 'Framing Material' }, { id: '16', name: 'Fuel Canopy Labor' }, { id: '17', name: 'Fuel Canopy Material' }, { id: '18', name: 'HVAC' }, { id: '19', name: 'Millwork' }, { id: '20', name: 'Misc' }, { id: '21', name: 'Paint Labor' }, { id: '22', name: 'Paint Material' }, { id: '23', name: 'Permit' }, { id: '24', name: 'Plumbing' }, { id: '25', name: 'Roof' }, { id: '26', name: 'Sitework Labor' }, { id: '27', name: 'Sitework Material' }, { id: '28', name: 'Steel Labor' }, { id: '29', name: 'Steel Material' }, { id: '30', name: 'Store Front Glass' }, { id: '31', name: 'Striping' }, { id: '32', name: 'Stucco/Stone' }, { id: '33', name: 'Survey' }, { id: '34', name: 'Tiles Labor' }, { id: '35', name: 'Tiles Material' },
];

export const projects: Project[] = [
  {
    id: '1',
    projectNumber: '2023-001',
    name: 'Downtown Office Tower',
    ownerName: 'Metropolis Holdings',
    addressStreet: '123 Main St',
    city: 'Houston',
    zip: '77002',
    description: 'Construction of a new 40-story office building with mixed-use retail space on the ground floor.',
    status: 'In Progress',
    percentComplete: 65,
    startDate: '2023-01-15',
    endDate: '2025-06-30',
    revisedContract: 75000000,
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
  },
  {
    id: '2',
    projectNumber: '2023-002',
    name: 'Suburb Retail Center',
    ownerName: 'Oakwood Developers',
    addressStreet: '456 Market Ave',
    city: 'Sugar Land',
    zip: '77479',
    description: 'Development of a single-story retail shopping center with anchor tenants and parking facilities.',
    status: 'Planning',
    percentComplete: 10,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    revisedContract: 12500000,
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
  },
  {
    id: '3',
    projectNumber: '2022-015',
    name: 'Coastal Industrial Warehouse',
    ownerName: 'Logistics Pro',
    addressStreet: '789 Port Rd',
    city: 'Galveston',
    zip: '77550',
    description: 'A 250,000 sq. ft. warehouse and distribution center with specialized climate control zones.',
    status: 'Completed',
    percentComplete: 100,
    startDate: '2022-08-01',
    endDate: '2023-12-20',
    revisedContract: 28000000,
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
  },
];

export const tasks: Task[] = [
  { id: '1', projectId: '1', title: 'Submit structural steel shop drawings', status: 'Done', priority: 'High', assigneeId: '4', dueDate: '2024-06-10' },
  { id: '2', projectId: '1', title: 'Finalize HVAC ductwork layout', status: 'In Progress', priority: 'High', assigneeId: '1', dueDate: '2024-07-25' },
  { id: '3', projectId: '1', title: 'Order long-lead electrical switchgear', status: 'To Do', priority: 'Medium', assigneeId: '1', dueDate: '2024-08-01' },
  { id: '4', projectId: '2', title: 'Complete site survey and soil testing', status: 'In Progress', priority: 'High', assigneeId: '2', dueDate: '2024-07-20' },
  { id: '5', projectId: '2', title: 'Draft preliminary architectural plans', status: 'To Do', priority: 'Medium', assigneeId: '4', dueDate: '2024-08-15' },
  { id: '6', projectId: '3', title: 'Final project punch list walk-through', status: 'Done', priority: 'High', assigneeId: '1', dueDate: '2023-12-15' },
];

export const rfis: RFI[] = [
  {
    id: '1',
    projectId: '1',
    rfiNumber: 'RFI-034',
    dateSubmitted: '2024-07-01',
    subject: 'Discrepancy in beam size on Sheet S-201',
    question: 'Drawing S-201 shows a W18x50 beam at gridline C-D, but the structural schedule calls for a W18x55. Please clarify which is correct.',
    status: 'Open',
  },
  {
    id: '2',
    projectId: '1',
    rfiNumber: 'RFI-033',
    dateSubmitted: '2024-06-20',
    subject: 'Location of underground utility',
    question: 'An unknown utility line was found during excavation near the north-east corner of the foundation. Please advise on how to proceed.',
    status: 'Closed',
    answer: 'The utility has been identified as an abandoned water line. It is safe to be removed and discarded. Proceed with excavation as planned.',
    dateAnswered: '2024-06-22',
  },
];

export const issues: Issue[] = [
  {
    id: '1',
    projectId: '1',
    date: '2024-07-10',
    severity: 'High',
    description: 'Subcontractor A&G Electric is reporting a 2-week delay in the delivery of main switchgear, potentially impacting the entire electrical rough-in schedule.',
    status: 'Open',
  },
  {
    id: '2',
    projectId: '2',
    date: '2024-07-05',
    severity: 'Medium',
    description: 'Unexpected rock formation discovered during initial site clearing will require additional excavation equipment and time.',
    status: 'Open',
  },
];

export const budgetItems: BudgetItem[] = [
  { id: '1', projectId: '1', category: 'Electrical', costType: 'both', originalBudget: 5000000, approvedCOBudget: 250000, committedCost: 3200000, projectedCost: 5300000 },
  { id: '2', projectId: '1', category: 'Plumbing', costType: 'both', originalBudget: 3500000, approvedCOBudget: 0, committedCost: 3000000, projectedCost: 3500000 },
  { id: '3', projectId: '1', category: 'Framing Material', costType: 'material', originalBudget: 10000000, approvedCOBudget: 0, committedCost: 8000000, projectedCost: 10000000 },
  { id: '4', projectId: '1', category: 'Foundation Labor', costType: 'labor', originalBudget: 6000000, approvedCOBudget: 150000, committedCost: 6150000, projectedCost: 6150000 },
  { id: '5', projectId: '2', category: 'Sitework Material', costType: 'material', originalBudget: 1500000, approvedCOBudget: 0, committedCost: 500000, projectedCost: 1500000 },
  { id: '6', projectId: '2', category: 'HVAC', costType: 'both', originalBudget: 800000, approvedCOBudget: 0, committedCost: 0, projectedCost: 800000 },
  { id: '7', projectId: '3', category: 'Roof', costType: 'both', originalBudget: 2000000, approvedCOBudget: 0, committedCost: 2000000, projectedCost: 2000000 },
  { id: '8', projectId: '3', category: 'Cleaning', costType: 'labor', originalBudget: 50000, approvedCOBudget: 0, committedCost: 50000, projectedCost: 50000 },
];

export const expenses: Expense[] = [
    { id: '1', projectId: '1', date: '2024-07-30', category: 'Sitework Material', vendorName: 'Concrete Cleaning Inc.', description: 'Concrete Mix', amount: 800.00, paymentMethod: 'Company Credit Card', invoiceNumber: 'INV-124' },
    { id: '2', projectId: '1', date: '2024-07-29', category: 'Foundation Labor', vendorName: 'A Morfin Trucking LLC', description: 'Concrete Pour Crew', amount: 3500.00, paymentMethod: 'Check', invoiceNumber: 'CHK-456' },
    { id: '3', projectId: '1', date: '2024-07-28', category: 'Foundation Material', vendorName: 'ACT PIPE AND SUPPLY, INC.', description: 'Rebar', amount: 1500.00, paymentMethod: 'Company Credit Card', invoiceNumber: 'INV-123' },
];
