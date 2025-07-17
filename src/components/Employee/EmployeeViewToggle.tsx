
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeViewToggleProps {
  currentView: 'grid' | 'table';
  onViewChange: (view: 'grid' | 'table') => void;
  totalCount: number;
}

export const EmployeeViewToggle = ({ currentView, onViewChange, totalCount }: EmployeeViewToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2" />
        {totalCount} {totalCount === 1 ? 'employee' : 'employees'}
      </div>
      
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('grid')}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-all",
            currentView === 'grid'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Grid3X3 className="w-4 h-4 mr-1.5" />
          Cards
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('table')}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-all",
            currentView === 'table'
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <List className="w-4 h-4 mr-1.5" />
          Table
        </Button>
      </div>
    </div>
  );
};
