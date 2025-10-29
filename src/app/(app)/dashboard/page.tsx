

'use client';

import { useContext, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Activity,
  CheckCircle,
  DollarSign,
  User,
  MoreVertical,
  CircleHelp,
  ArrowUp,
} from 'lucide-react';
import Link from 'next/link';
import { AppStateContext } from '@/context/app-state-context';
import { BudgetChart } from './_components/budget-chart';
import { ProjectTimeline } from './_components/project-timeline';
import { TasksDueToday } from './_components/tasks-due-today';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AddTaskDialog } from '../tasks/_components/add-task-dialog';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const appState = useContext(AppStateContext);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();

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

  const { projects, tasks, budgetItems, expenses, teamMembers, userName, setTasks } = appState;
  
  const handleSaveTask = (task: Task) => {
    if (task.id) { // Editing existing task
        setTasks(current => current.map(t => t.id === task.id ? task : t));
    } else { // Adding new task
        setTasks(current => [{...task, id: crypto.randomUUID()}, ...current]);
    }
     toast({
      title: `Task ${task.id ? 'Updated' : 'Created'}`,
      description: `Successfully ${task.id ? 'updated' : 'created'} task: ${task.title}.`,
    });
  };

  const handleOpenTaskDialog = (task: Task | null) => {
    setSelectedTask(task);
    setIsAddTaskOpen(true);
  };


  const activeProjects = useMemo(() => projects.filter(p => p.status === 'In Progress'), [projects]);
  const activeProjectIds = useMemo(() => activeProjects.map(p => p.id), [activeProjects]);

  const activeProjectsCount = activeProjects.length;
  
  const tasksDueSoonCount = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      const inAWeek = new Date();
      inAWeek.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= inAWeek && t.status !== 'Done';
    }).length;
  
  const activeBudgetItems = useMemo(() => budgetItems.filter(item => activeProjectIds.includes(item.projectId)), [budgetItems, activeProjectIds]);
  const activeExpenses = useMemo(() => expenses.filter(expense => activeProjectIds.includes(expense.projectId)), [expenses, activeProjectIds]);

  const totalBudget = activeBudgetItems.reduce((acc, item) => acc + item.originalBudget + item.approvedCOBudget, 0);
  const totalSpent = activeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const categorySpending = useMemo(() => {
    const spendingMap: { [key: string]: number } = {};
    activeExpenses.forEach(expense => {
      if (!spendingMap[expense.category]) {
        spendingMap[expense.category] = 0;
      }
      spendingMap[expense.category] += expense.amount;
    });
    return Object.entries(spendingMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, spent]) => ({ category, spent }));
  }, [activeExpenses]);

  return (
    <>
    <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSave={handleSaveTask}
        task={selectedTask}
        projects={projects}
        teamMembers={teamMembers}
    />
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName.split(' ')[0]}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              </TooltipTrigger>
              <TooltipContent>
                 <p className="font-bold mb-2">Active Projects</p>
                  <ul className="list-disc pl-4">
                    {activeProjects.map(p => (
                      <li key={p.id} className="text-sm">
                        <span className="font-semibold">{p.name}:</span> {p.description}
                      </li>
                    ))}
                  </ul>
              </TooltipContent>
            </Tooltip>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjectsCount}</div>
              <p className="text-xs text-muted-foreground">
                {projects.length - activeProjectsCount} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Due Soon</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasksDueSoonCount}</div>
              <p className="text-xs text-muted-foreground">In the next 7 days</p>
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
                Across all active projects
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
                          <CardTitle>Budget vs. Actual</CardTitle>
                          <CardDescription>For active projects</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <BudgetChart />
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle>Budget Overview</CardTitle>
                          <CardDescription>For active projects</CardDescription>
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
                               {categorySpending.length > 0 ? (
                                <div className="space-y-2">
                                  {categorySpending.map(({ category, spent }) => (
                                    <div key={category} className="flex justify-between items-center text-sm">
                                      <div className="flex items-center gap-2">
                                        <ArrowUp className="h-4 w-4 text-green-500" />
                                        <span>{category}</span>
                                      </div>
                                      <span className="font-medium">${spent.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground py-4">
                                  <CircleHelp className="mx-auto h-8 w-8 mb-2" />
                                  <p className="text-sm">No spending recorded for active projects</p>
                                  <p className="text-xs">Start adding expenses to see this report.</p>
                                </div>
                              )}
                          </div>
                          <div className="flex justify-between gap-2">
                              <Button asChild variant="outline" className="w-full">
                                <Link href="/profit-loss">View Full Report</Link>
                              </Button>
                              <Button variant="ghost" className="w-full">Export Report</Button>
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
              <TasksDueToday 
                tasks={tasks} 
                projects={projects} 
                onAddTask={() => handleOpenTaskDialog(null)}
                onViewTask={(task) => handleOpenTaskDialog(task)}
              />
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Team Members</CardTitle>
                      <Button variant="ghost" size="sm" asChild><Link href="/estimating/team">View All</Link></Button>
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
    </TooltipProvider>
    </>
  );
}
