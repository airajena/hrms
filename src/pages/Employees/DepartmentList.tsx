// pages/Employees/DepartmentList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader, 
  Search, 
  Building, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useDepartments, useDeleteDepartment } from '../../hooks/useDepartments';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '@/hooks/use-toast';

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { checkAuth } = useAuthStore();
  const { 
    data: departments, 
    isLoading, 
    error, 
    refetch 
  } = useDepartments({ search: searchTerm });
  
  const deleteDepartmentMutation = useDeleteDepartment();

  useEffect(() => {
    console.log('DepartmentList mounted, checking auth...');
    const authValid = checkAuth();
    console.log('Auth valid:', authValid);
  }, [checkAuth]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDepartmentMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete department:', error);
      }
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Department list has been refreshed.",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading departments...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    console.error('Department list error:', error);
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Departments
              </h3>
              <p className="text-gray-600 mb-4">
                {error.message || 'An error occurred while loading departments'}
              </p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              Departments
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your organization's departments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link to="/departments/add">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {departments?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Total Departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {departments?.filter(d => d.is_active).length || 0}
              </div>
              <p className="text-sm text-gray-600">Active Departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {departments?.filter(d => !d.is_active).length || 0}
              </div>
              <p className="text-sm text-gray-600">Inactive Departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Departments List */}
        <Card>
          <CardHeader>
            <CardTitle>All Departments</CardTitle>
          </CardHeader>
          <CardContent>
            {departments && departments.length > 0 ? (
              <div className="space-y-4">
                {departments.map((department) => (
                  <div 
                    key={department.id} 
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">
                            {department.name}
                          </h3>
                          <Badge 
                            variant={department.is_active ? "default" : "secondary"}
                            className={department.is_active ? "bg-green-100 text-green-800" : ""}
                          >
                            {department.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Created: {new Date(department.created_at).toLocaleDateString()}</p>
                          <p>Updated: {new Date(department.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link to={`/departments/${department.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(department.id, department.name)}
                          disabled={deleteDepartmentMutation.isPending}
                          className="hover:bg-red-50 hover:text-red-700"
                        >
                          {deleteDepartmentMutation.isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No departments found
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first department.
                </p>
                <Link to="/departments/add">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DepartmentList;
