// src/components/Employee/EmployeeFilters.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  ChevronDown,
  Users,
  Building,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { EmployeeType, EmployeeStatus, Department } from '../../types';

interface EmployeeFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: {
    status: string[];
    department_id: string[];
    type_code: string[];
  };
  onFilterChange: (type: 'status' | 'department_id' | 'type_code', value: string) => void;
  onClearFilters: () => void;
  availableOptions: {
    departments: Department[];
    statuses: string[];
    types: string[];
  };
  totalCount: number;
  filteredCount: number;
}

export const EmployeeFilters = ({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  availableOptions,
  totalCount,
  filteredCount
}: EmployeeFiltersProps) => {

  const activeFiltersCount =
    selectedFilters.status.length +
    selectedFilters.department_id.length +
    selectedFilters.type_code.length;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, code, or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 md:flex-initial">
                  <Users className="w-4 h-4 mr-2" /> Status
                  {selectedFilters.status.length > 0 && <Badge variant="secondary" className="ml-2">{selectedFilters.status.length}</Badge>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableOptions.statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedFilters.status.includes(status)}
                    onCheckedChange={() => onFilterChange('status', status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="flex-1 md:flex-initial">
                  <Briefcase className="w-4 h-4 mr-2" /> Type
                   {selectedFilters.type_code.length > 0 && <Badge variant="secondary" className="ml-2">{selectedFilters.type_code.length}</Badge>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableOptions.types.map((type) => (
                   <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedFilters.type_code.includes(type)}
                    onCheckedChange={() => onFilterChange('type_code', type)}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Department Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="flex-1 md:flex-initial">
                  <Building className="w-4 h-4 mr-2" /> Department
                   {selectedFilters.department_id.length > 0 && <Badge variant="secondary" className="ml-2">{selectedFilters.department_id.length}</Badge>}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableOptions.departments.map((dept) => (
                   <DropdownMenuCheckboxItem
                    key={dept.id}
                    checked={selectedFilters.department_id.includes(dept.id)}
                    onCheckedChange={() => onFilterChange('department_id', dept.id)}
                  >
                    {dept.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={onClearFilters} className="text-red-600 hover:text-red-700">
                    Clear
                </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFilters.status.map((status) => (
              <Badge key={`status-${status}`} variant="secondary" className="flex items-center gap-1">
                Status: {status}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('status', status)} />
              </Badge>
            ))}
            {selectedFilters.type_code.map((type) => (
              <Badge key={`type-${type}`} variant="secondary" className="flex items-center gap-1">
                Type: {type}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('type_code', type)} />
              </Badge>
            ))}
            {selectedFilters.department_id.map((deptId) => {
                const deptName = availableOptions.departments.find(d => d.id === deptId)?.name || deptId;
                return (
                    <Badge key={`dept-${deptId}`} variant="secondary" className="flex items-center gap-1">
                        Dept: {deptName}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange('department_id', deptId)} />
                    </Badge>
                )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
