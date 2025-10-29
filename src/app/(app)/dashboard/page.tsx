
'use client';

import { useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle,
  DollarSign,
  User,
  MoreVertical,
  CircleHelp,
} from 'lucide-react';
import Link from 'next/link';
import { AppStateContext } from '@/context/app-state-context';
import { ProjectStatusChart } from './_components/project-status-chart';
import { ProjectTimeline } from './_components/project-timeline';
import { TasksDueToday } from './_components/tasks-due-today';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const appState = useContext(AppStateContext);

  if (
    !appState ||
    !appState.projects ||
    !appState.rfis ||
    !appState.issues ||
    !appState.tasks ||
    !appState.budgetItems ||
    !appState.expenses
  ) {
    return <div>Loading...</div>;
  }

  const { projects, tasks, budgetItems, expenses, teamMembers, userName } = appState;

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'In Progress'
  ).length;
  const tasksDueTodayCount = tasks.filter(
    (t) =>
      new Date(t.dueDate).toDateString() === new Date().toDateString() &&
      t.status !== 'Done'
  ).length;
  
  const totalBudget = budgetItems.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
  const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {userName.split(' ')[0]}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length - activeProjectsCount} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksDueTodayCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Utilization
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUtilization.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card>
            <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <ProjectTimeline projects={projects} />
            </CardContent>
           </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProjectStatusChart projects={projects} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Budget</p>
                                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground text-right">Spent to Date</p>
                                <p className="text-2xl font-bold text-right">${totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                        <div>
                             <p className="text-sm text-muted-foreground mb-1">Overall Budget Utilization</p>
                             <Progress value={budgetUtilization} />
                        </div>
                         <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-2">Top Spending Categories</p>
                            <div className="text-center text-muted-foreground py-4">
                                 <CircleHelp className="mx-auto h-8 w-8 mb-2" />
                                <p className="text-sm">No category budgets found</p>
                                <p className="text-xs">Set up category budgets to track spending</p>
                            </div>
                        </div>
                        <div className="flex justify-between gap-2">
                             <Button variant="outline" className="w-full">View Full Budget</Button>
                             <Button variant="ghost" className="w-full">Export Report</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <TasksDueToday tasks={tasks} projects={projects} />
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                     <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {teamMembers.slice(0, 4).map(member => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                     <div className="text-center text-muted-foreground py-8">
                        <p>No recent activity</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
