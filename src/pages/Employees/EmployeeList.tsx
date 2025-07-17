// src/pages/Employees/EmployeeList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Users, Loader2, AlertCircle, Grid3X3, List, MoreHorizontal } from 'lucide-react';
import { EmployeeCard } from '../../components/Employee/EmployeeCard';
import { EmployeeFilters } from '../../components/Employee/EmployeeFilters';
import { useUsers, useDeleteUser } from '@/hooks/useUser';
import { useDepartments } from '@/hooks/useDepartments';
import { EmployeeStatus, EmployeeType, User } from '@/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// The Pagination component is no longer needed for this page

const EmployeeList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState<{
    status: string[];
    department_id: string[];
    type_code: string[];
  }>({ status: [], department_id: [], type_code: [] });

  // --- Data Fetching (No Pagination) ---
  // FIX: Removed page and page_size from the hook call as the API is not paginated.
  const { data, isLoading, error, isFetching } = useUsers({
    search: debouncedSearchTerm,
    status: filters.status,
    department_id: filters.department_id,
    type_code: filters.type_code,
  });

  const { data: departmentsData } = useDepartments();
  const deleteUserMutation = useDeleteUser();

  // FIX: The API now returns a direct array. `data` itself is the list of employees.
  const employees = data || [];
  const totalEmployees = employees.length;

  // --- Handlers ---
  const handleFilterChange = (type: 'status' | 'department_id' | 'type_code', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: [], department_id: [], type_code: [] });
    setSearchTerm('');
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 col-span-full">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg col-span-full">
          <AlertCircle className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-lg font-semibold">Failed to load employees</h3>
          <p>{error.message}</p>
        </div>
      );
    }

    if (employees.length === 0) {
      return (
        <div className="text-center py-12 col-span-full">
          <h2 className="text-2xl font-semibold text-gray-900">No Employees Found</h2>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters, or add a new employee.</p>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {employees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onDelete={() => handleDelete(employee)}
              onEdit={() => navigate(`/employees/edit/${employee.id}`)}
              onView={() => navigate(`/employees/${employee.id}`)}
            />
          ))}
        </div>
      );
    }

    // Table View
    return (
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead className="hidden md:table-cell">Department</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead><TableHead className="hidden lg:table-cell">Joined</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {employees.map(employee => (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell><div className="flex items-center space-x-3"><Avatar><AvatarFallback>{`${employee.first_name[0]}${employee.last_name[0]}`}</AvatarFallback></Avatar><div><div className="font-medium">{`${employee.first_name} ${employee.last_name}`}</div><div className="text-sm text-gray-500">{employee.designation?.title || 'N/A'}</div></div></div></TableCell>
                <TableCell className="hidden md:table-cell">{employee.department?.name || 'N/A'}</TableCell>
                <TableCell className="hidden sm:table-cell"><Badge variant="outline">{employee.status}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell">{new Date(employee.doj).toLocaleDateString()}</TableCell>
                <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => navigate(`/employees/${employee.id}`)}>View Profile</DropdownMenuItem><DropdownMenuItem onClick={() => navigate(`/employees/edit/${employee.id}`)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={() => handleDelete(employee)} className="text-red-600">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div><h1 className="text-2xl md:text-3xl font-bold flex items-center"><Users className="mr-3 h-6 w-6" />Employee Management</h1><p className="text-gray-600 mt-1">View, search, and manage your workforce.</p></div>
          <Button onClick={() => navigate('/employees/add')} className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
        </div>

        <EmployeeFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          availableOptions={{ departments: departmentsData || [], statuses: Object.values(EmployeeStatus), types: Object.values(EmployeeType) }}
          totalCount={totalEmployees}
          filteredCount={employees.length}
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{employees.length}</span> employees
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4 mr-2" /> Grid</Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('table')}><List className="w-4 h-4 mr-2" /> Table</Button>
          </div>
        </div>
        
        {isFetching && <div className="h-1 bg-blue-200 rounded-full w-full animate-pulse"></div>}

        {renderContent()}

        {/* Pagination is removed as it's no longer needed */}
      </div>
    </MainLayout>
  );
};

export default EmployeeList;
