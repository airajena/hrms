// pages/Designations/EditDesignation.tsx

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useDesignation, useUpdateDesignation } from '../../hooks/useDesignations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Briefcase, Save, ArrowLeft, Loader, AlertCircle } from 'lucide-react';

const designationSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  level: z.coerce.number().int().min(1, { message: "Level must be a positive number." }).optional(),
  is_active: z.boolean().default(true),
});

type DesignationFormData = z.infer<typeof designationSchema>;

const EditDesignation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: designation, isLoading: isFetching, error } = useDesignation(id!);
  const updateMutation = useUpdateDesignation();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
  });
  
  // Populate form with fetched data
  useEffect(() => {
    if (designation) {
      reset(designation);
    }
  }, [designation, reset]);

  const onSubmit = (data: DesignationFormData) => {
    updateMutation.mutate({ id: id!, ...data }, {
      onSuccess: () => {
        navigate('/designations');
      },
    });
  };

  if (isFetching) {
    return <MainLayout><div className="flex justify-center items-center h-64"><Loader className="w-8 h-8 animate-spin" /></div></MainLayout>;
  }

  if (error) {
     return <MainLayout><div className="text-center p-8 text-red-700">{error.message}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
            Edit Designation
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
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="level">Level</Label>
                <Input id="level" type="number" {...register('level')} />
                {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={control._getWatch('is_active')} 
                  onCheckedChange={(checked) => control._fields.is_active?.onChange(checked)}
                />
                <Label htmlFor="is_active">Active Designation</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? 'Updating...' : 'Update Designation'}
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

export default EditDesignation;
