

'use client';

import { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AppStateContext } from '@/context/app-state-context';
import type { BudgetItem } from '@/lib/types';
import { Label } from '@/components/ui/label';

const parseAmount = (value: any): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};


export function PasteBudgetDialog({
  open,
  onOpenChange,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const { toast } = useToast();
  const appState = useContext(AppStateContext);
  const [pasteData, setPasteData] = useState('');

  const handleImport = () => {
    if (!appState) return;
    
    try {
      const rows = pasteData.split('\n').filter(row => row.trim() !== '');
      
      const newBudgetItems: BudgetItem[] = rows.map(row => {
        const columns = row.split('\t'); // Assuming tab-separated from spreadsheet
        
        if (columns.length < 2) {
          return null;
        }

        const notes = columns[0].trim();
        const category = columns[1].trim();
        const originalBudget = parseAmount(columns[2]);
        
        if (!category || !notes) {
            return null;
        }

        return {
          id: crypto.randomUUID(),
          projectId: projectId,
          category,
          costType: 'material', // Default value
          notes,
          originalBudget,
          approvedCOBudget: 0,
          committedCost: 0,
          projectedCost: originalBudget,
        };
      }).filter((item): item is BudgetItem => item !== null);

      if (newBudgetItems.length > 0) {
        appState.setBudgetItems(current => [...current, ...newBudgetItems]);
        toast({
          title: 'Import Successful',
          description: `${newBudgetItems.length} budget items have been imported from pasted data.`,
        });
      } else {
        toast({
            title: "Import Warning",
            description: "No valid budget items could be found in the pasted data. Please ensure the first column is the category and the second is the amount.",
            variant: "destructive"
        });
      }
      
      onOpenChange(false);
      setPasteData('');

    } catch (error) {
      console.error('Error parsing pasted data:', error);
      toast({
        title: 'Import Failed',
        description: 'There was an error processing the pasted data. Please ensure it is copied correctly from a spreadsheet.',
        variant: 'destructive',
      });
    }
  };

  if (!appState) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paste from Spreadsheet</DialogTitle>
          <DialogDescription>
            Copy data from your spreadsheet (e.g., Excel, Google Sheets) and paste it below. The first column should be the category and the second column should be the budget amount.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
            <Label htmlFor="paste-area">Pasted Data</Label>
            <Textarea 
                id="paste-area"
                rows={10}
                placeholder="Framing	50000.00&#10;Electrical	25000.00"
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
            />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleImport}>Import Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
