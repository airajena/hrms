// pages/Designations/AddDesignation.tsx

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useCreateDesignation } from '../../hooks/useDesignations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Briefcase, Save, ArrowLeft } from 'lucide-react';

const designationSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  level: z.coerce.number().int().min(1, { message: "Level must be a positive number." }).optional(),
  is_active: z.boolean().default(true),
});

type DesignationFormData = z.infer<typeof designationSchema>;

const AddDesignation = () => {
  const navigate = useNavigate();
  const createMutation = useCreateDesignation();

  const { register, handleSubmit, control, formState: { errors } } = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      title: '',
      level: 1,
      is_active: true,
    }
  });

  const onSubmit = (data: DesignationFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/designations');
      },
    });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
            Add Designation
          </h1>
          <Button variant="outline" onClick={() => navigate('/designations')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Designation Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Designation Title *</Label>
                <Input id="title" placeholder="e.g., Senior Software Engineer" {...register('title')} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <Input id="level" type="number" placeholder="e.g., 4" {...register('level')} />
                 {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                 <Switch id="is_active" defaultChecked onCheckedChange={(checked) => control._fields.is_active?.onChange(checked)} />
                <Label htmlFor="is_active">Active Designation</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? 'Creating...' : 'Create Designation'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/designations')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddDesignation;
