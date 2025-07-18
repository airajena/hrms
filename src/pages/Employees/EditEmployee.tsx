// src/pages/Employees/EditEmployee.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useUser, useUpdateUser } from '@/hooks/useUser';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPen, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { EmployeeStatus, EmployeeType, UpdateUserRequest } from '@/types';

// Zod schema for validation. Fields are optional for updates.
const userUpdateSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  emp_code: z.string().min(1, "Employee code is required"),
  doj: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  type_code: z.nativeEnum(EmployeeType),
  status: z.nativeEnum(EmployeeStatus),
  role_id: z.string().min(1, "Role is required"),
  department_id: z.string().optional(),
  designation_id: z.string().optional(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  probation_end: z.string().optional(),
  is_active: z.boolean(),
});

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Data fetching
  const { data: employee, isLoading: isEmployeeLoading, error: employeeError } = useUser(id!);
  const updateUserMutation = useUpdateUser();
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserRequest>({
    resolver: zodResolver(userUpdateSchema),
  });

  // Populate form with fetched employee data
  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        doj: employee.doj ? new Date(employee.doj).toISOString().split('T')[0] : '',
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : '',
        probation_end: employee.probation_end ? new Date(employee.probation_end).toISOString().split('T')[0] : '',
        department_id: employee.department?.id,
        designation_id: employee.designation?.id,
        role_id: employee.role?.id,
      });
    }
  }, [employee, reset]);

  // --- FIX IS HERE ---
  const onSubmit = (data: UpdateUserRequest) => {
    // Create a mutable copy of the form data to clean it up
    const payload: Partial<UpdateUserRequest> = { ...data };

    // Convert empty strings for optional fields to null, which the backend expects
    if (payload.dob === '') payload.dob = null;
    if (payload.probation_end === '') payload.probation_end = null;
    if (payload.phone === '') payload.phone = null;
    if (payload.department_id === '') payload.department_id = null;
    if (payload.designation_id === '') payload.designation_id = null;

    // Submit the cleaned payload
    updateUserMutation.mutate({ id: id!, data: payload as UpdateUserRequest }, {
      onSuccess: () => navigate('/employees'),
    });
  };

  if (isEmployeeLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="ml-2">Loading Employee Details...</p>
        </div>
      </MainLayout>
    );
  }

  if (employeeError) {
      return (
        <MainLayout>
            <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">Failed to load employee data</h3>
                <p>{employeeError.message}</p>
                 <Button onClick={() => navigate('/employees')} className="mt-4">Back to List</Button>
            </div>
        </MainLayout>
      );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center"><UserPen className="mr-3 h-6 w-6" />Edit Employee</h1>
            <p className="text-gray-600 mt-1">Update details for {employee?.first_name} {employee?.last_name}.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/employees')} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Card */}
            <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>First Name</Label><Controller name="first_name" control={control} render={({ field }) => <Input {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.first_name?.message}</p></div>
                    <div><Label>Last Name</Label><Controller name="last_name" control={control} render={({ field }) => <Input {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.last_name?.message}</p></div>
                    <div><Label>Email</Label><Controller name="email" control={control} render={({ field }) => <Input type="email" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.email?.message}</p></div>
                    <div><Label>Phone</Label><Controller name="phone" control={control} render={({ field }) => <Input {...field} />} /></div>
                    <div><Label>Date of Birth</Label><Controller name="dob" control={control} render={({ field }) => <Input type="date" {...field} />} /></div>
                </CardContent>
            </Card>

            {/* Employment Details Card */}
            <Card>
                <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Employee Code</Label><Controller name="emp_code" control={control} render={({ field }) => <Input {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.emp_code?.message}</p></div>
                    <div><Label>Date of Joining</Label><Controller name="doj" control={control} render={({ field }) => <Input type="date" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.doj?.message}</p></div>
                    <div><Label>Department</Label><Controller name="department_id" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{departments?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select>)} /></div>
                    <div><Label>Designation</Label><Controller name="designation_id" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{designations?.map(d => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}</SelectContent></Select>)} /></div>
                    <div><Label>Employee Type</Label><Controller name="type_code" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.values(EmployeeType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>)} /></div>
                    <div><Label>Status</Label><Controller name="status" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.values(EmployeeStatus).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>)} /></div>
                    <div className="flex items-center space-x-2 pt-4"><Controller name="is_active" control={control} render={({ field }) => <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="is_active">User is Active</Label></div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => navigate('/employees')}>Cancel</Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditEmployee;
