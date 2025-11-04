

export type Project = {
  id: string;
  ownerId: string;
  projectNumber: string;
  name: string;
  ownerName: string;
  addressStreet: string;
  city: string;
  zip: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  percentComplete: number;
  startDate: string;
  endDate: string;
  revisedContract: number;
  finalBidAmount: number;
  imageUrl: string;
  imageHint: string;
};

export type BudgetCategory = {
  id: string;
  ownerId: string;
  name: string;
};

export type Vendor = {
  id: string;
  ownerId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  trade: string;
};

export type TeamMember = {
  id: string;
  ownerId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
};

export type BudgetItem = {
  id: string;
  ownerId: string;
  projectId: string;
  category: string;
  costType: 'labor' | 'material' | 'both';
  notes?: string;
  originalBudget: number;
  approvedCOBudget: number;
  committedCost: number;
  projectedCost: number;
};

export type Expense = {
  id: string;
  ownerId: string;
  projectId: string;
  date: string;
  category: string;
  vendorName?: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paymentReference?: any;
  invoiceNumber?: string;
};

export type ChangeOrder = {
  id: string;
  ownerId: string;
  projectId: string;
  coNumber: string;
  description: string;
  totalRequest: number;
  status: 'Submitted' | 'Approved' | 'Executed' | 'Rejected';
};

export type Task = {
  id: string;
  ownerId: string;
  projectId: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId: string;
  dueDate: string;
};

export type RFI = {
  id: string;
  ownerId: string;
  projectId: string;
  rfiNumber: string;
  dateSubmitted: string;
  subject: string;
  question: string;
  status: 'Open' | 'Closed';
  answer?: string;
  dateAnswered?: string;
};

export type Issue = {
  id: string;
  ownerId: string;
  projectId: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  status: 'Open' | 'Closed';
  correctiveAction?: string;
};

export type Milestone = {
  id: string;
  ownerId: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
};


export type Drawing = {
  id: string;
  ownerId: string;
  projectId: string;
  sheetNo: string;
  title: string;
  versions: {
    version: number;
    date: string;
    description: string;
    url: string;
  }[];
};

export type ClientUpload = {
  id: string;
  ownerId: string;
  projectId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string; // TeamMember ID
};

export type AppUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
};

export type CompanyProfile = {
    id: string;
    ownerId: string;
    name: string;
    logoUrl: string;
};
