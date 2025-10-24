
'use client';

import { useState, useMemo, useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DollarSign,
  BarChart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FinancialBreakdownChart } from './_components/financial-breakdown-chart';
import { AppStateContext } from '@/context/app-state-context';

export default function ProfitLossPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const appState = useContext(AppStateContext);

  if (!appState) {
    return <div>Loading...</div>;
  }

  const { projects, budgetItems, expenses: allExpenses } = appState;

  const financialData = useMemo(() => {
    const relevantProjects =
      selectedProjectId === 'all'
        ? projects
        : projects.filter((p) => p.id === selectedProjectId);

    const projectIds = relevantProjects.map((p) => p.id);
    
    const relevantBudgetItems = budgetItems.filter((item) =>
      projectIds.includes(item.projectId)
    );

    const bidAmount = relevantProjects.reduce(
      (acc, p) => acc + p.revisedContract,
      0
    );

    const budget = relevantBudgetItems.reduce(
      (acc, item) => acc + item.originalBudget + item.approvedCOBudget,
      0
    );

    const relevantExpenses = allExpenses.filter((expense) =>
        projectIds.includes(expense.projectId)
    );
    const expenses = relevantExpenses.reduce((acc, exp) => acc + exp.amount, 0);

    const profitLoss = bidAmount - expenses;
    
    const estimatedProfit = bidAmount - budget;


    return { bidAmount, budget, expenses, profitLoss, estimatedProfit };
  }, [selectedProjectId, projects, budgetItems, allExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profit & Loss Reports
          </h1>
          <p className="text-muted-foreground">
            View financial performance across projects or for specific projects
          </p>
        </div>
        <Select
          defaultValue="all"
          onValueChange={(value) => setSelectedProjectId(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed-analysis" disabled>
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="project-comparison" disabled>
            Project Comparison
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bid Amount
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialData.bidAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Contract value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialData.budget.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Planned cost</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialData.expenses.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actual expenditure
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit/Loss
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialData.profitLoss.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Net profit</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual comparison of bid amount, expenses, and profit
                </p>
              </CardHeader>
              <CardContent className="pl-2">
                <FinancialBreakdownChart
                  data={{
                    bidAmount: financialData.bidAmount,
                    budget: financialData.budget,
                    expenses: financialData.expenses,
                    actualProfit: financialData.profitLoss,
                    estimatedProfit: financialData.estimatedProfit,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
