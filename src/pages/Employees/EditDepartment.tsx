// pages/Employees/EditDepartment.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Building, Save, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDepartment, useUpdateDepartment } from '../../hooks/useDepartments';

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updateDepartmentMutation = useUpdateDepartment();
  
  const {
    data: department,
    isLoading: initialLoading,
    error: fetchError,
    isError
  } = useDepartment(id!);

  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });

  // Update form data when department data is loaded
  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        is_active: department.is_active
      });
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !id) {
      toast({
        title: "Validation Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateDepartmentMutation.mutateAsync({
        id,
        name: formData.name.trim(),
        is_active: formData.is_active
      });
      navigate('/departments');
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  if (initialLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading department...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load department
              </h3>
              <p className="text-gray-600 mb-4">
                {fetchError?.message || 'An error occurred while loading the department'}
              </p>
              <Button onClick={() => navigate('/departments')}>
                Back to Departments
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              Edit Department
            </h1>
            <p className="text-gray-600 mt-2">Update department information</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/departments')}
            disabled={updateDepartmentMutation.isPending}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    required
                    disabled={updateDepartmentMutation.isPending}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                    disabled={updateDepartmentMutation.isPending}
                  />
                  <Label htmlFor="is_active">Active Department</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={updateDepartmentMutation.isPending || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateDepartmentMutation.isPending ? 'Updating...' : 'Update Department'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/departments')}
                  disabled={updateDepartmentMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditDepartment;
