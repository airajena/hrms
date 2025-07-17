// components/DepartmentList.tsx (update your existing list component)
// import { useDepartments, useDeleteDepartment } from '../hooks/useDepartment';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import { useDeleteDepartment, useDepartments } from '@/hooks/useDepartments';

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: departments, isLoading, error } = useDepartments({ search: searchTerm });
  const deleteDepartmentMutation = useDeleteDepartment();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDepartmentMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete department:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading departments: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Link to="/departments/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {departments?.map((department) => (
          <div key={department.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{department.name}</h3>
              <p className="text-sm text-gray-600">
                Status: {department.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/departments/${department.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(department.id, department.name)}
                disabled={deleteDepartmentMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;
