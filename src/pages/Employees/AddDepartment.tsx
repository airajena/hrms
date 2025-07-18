// pages/Employees/AddDepartment.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Building, Save, ArrowLeft } from 'lucide-react';
import { useCreateDepartment } from '../../hooks/useDepartments';
import { toast } from '@/hooks/use-toast';

const AddDepartment = () => {
  const navigate = useNavigate();
  const createDepartmentMutation = useCreateDepartment();
  
  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- FIX: Create a clean payload with the trimmed name ---
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      toast({
        title: "Validation Error",
        description: "Department name is required and cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Use the cleaned data for the mutation
    const payload = {
      ...formData,
      name: trimmedName,
    };

    try {
      await createDepartmentMutation.mutateAsync(payload);
      navigate('/departments');
    } catch (error) {
      console.error('Failed to create department:', error);
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

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              Add Department
            </h1>
            <p className="text-gray-600 mt-2">Create a new department</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/departments')}
            disabled={createDepartmentMutation.isPending}
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
                    disabled={createDepartmentMutation.isPending}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                    disabled={createDepartmentMutation.isPending}
                  />
                  <Label htmlFor="is_active">Active Department</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createDepartmentMutation.isPending || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createDepartmentMutation.isPending ? 'Creating...' : 'Create Department'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/departments')}
                  disabled={createDepartmentMutation.isPending}
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

export default AddDepartment;
