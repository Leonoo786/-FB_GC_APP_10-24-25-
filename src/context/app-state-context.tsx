

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import type { Project, BudgetCategory, Vendor, BudgetItem, TeamMember, Task, Expense, ChangeOrder, RFI, Issue, Milestone, AppUser, CompanyProfile } from '@/lib/types';
import * as data from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';

type AppStateContextType = {
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>