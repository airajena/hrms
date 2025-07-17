// src/pages/Employees/AddEmployee.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useCreateUser } from '@/hooks/useUser';
import { useDepartments } from '@/hooks/useDepartments';
import { useDesignations } from '@/hooks/useDesignations';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { EmployeeStatus, EmployeeType } from '@/types';
import { useRoles } from '@/hooks/useRole';

// FIX: Updated the schema to handle optional fields correctly.
// It now transforms empty strings ('') into null for optional fields,
// which prevents validation errors on the backend for dates and other nullable fields.
const userSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  emp_code: z.string().min(1, "Employee code is required"),
  doj: z.string().refine((val) => val, { message: "Date of joining is required" }),
  type_code: z.nativeEnum(EmployeeType),
  status: z.nativeEnum(EmployeeStatus),
  role_id: z.string().uuid({ message: "A valid role must be selected." }),
  department_id: z.string().optional().or(z.literal('')).transform(e => e === "" ? undefined : e),
  designation_id: z.string().optional().or(z.literal('')).transform(e => e === "" ? undefined : e),
  phone: z.string().optional().or(z.literal('')).transform(e => e === "" ? undefined : e),
  dob: z.string().optional().or(z.literal('')).transform(e => e === "" ? undefined : e),
});

const AddEmployee = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();
  const { data: roles, isLoading: rolesLoading, error: rolesError } = useRoles();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '', last_name: '', email: '', username: '',
      password: '', emp_code: '', doj: '',
      type_code: EmployeeType.Regular, status: EmployeeStatus.Probation,
      role_id: '', department_id: '', designation_id: '',
      phone: '', dob: '',
    }
  });

  useEffect(() => {
    if (roles && roles.length === 1) {
      setValue('role_id', roles[0].id, { shouldValidate: true });
    }
  }, [roles, setValue]);


  const onSubmit = (data: z.infer<typeof userSchema>) => {
    createUserMutation.mutate(data, {
      onSuccess: () => navigate('/employees'),
    });
  };
  
  const isFormReady = !rolesLoading && !rolesError;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center"><UserPlus className="mr-3" />Add New Employee</h1>
            <Button variant="outline" onClick={() => navigate('/employees')}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Personal & Employment</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="first_name">First Name</Label><Controller name="first_name" control={control} render={({ field }) => <Input id="first_name" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.first_name?.message}</p></div>
              <div><Label htmlFor="last_name">Last Name</Label><Controller name="last_name" control={control} render={({ field }) => <Input id="last_name" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.last_name?.message}</p></div>
              <div><Label htmlFor="emp_code">Employee Code</Label><Controller name="emp_code" control={control} render={({ field }) => <Input id="emp_code" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.emp_code?.message}</p></div>
              <div><Label htmlFor="doj">Date of Joining</Label><Controller name="doj" control={control} render={({ field }) => <Input id="doj" type="date" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.doj?.message}</p></div>
              <div><Label htmlFor="dob">Date of Birth</Label><Controller name="dob" control={control} render={({ field }) => <Input id="dob" type="date" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.dob?.message}</p></div>
              <div><Label htmlFor="phone">Phone</Label><Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p></div>
              <div><Label>Department</Label><Controller name="department_id" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{departments?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select>)} /></div>
              <div><Label>Designation</Label><Controller name="designation_id" control={control} render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{designations?.map(d => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}</SelectContent></Select>)} /></div>
              <div><Label>Employee Type</Label><Controller name="type_code" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(EmployeeType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>)} /></div>
              <div><Label>Status</Label><Controller name="status" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.values(EmployeeStatus).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>)} /></div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle>System Access</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="email">Email (for login)</Label><Controller name="email" control={control} render={({ field }) => <Input id="email" type="email" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.email?.message}</p></div>
              <div><Label htmlFor="username">Username</Label><Controller name="username" control={control} render={({ field }) => <Input id="username" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.username?.message}</p></div>
              <div><Label htmlFor="password">Password</Label><Controller name="password" control={control} render={({ field }) => <Input id="password" type="password" {...field} />} /><p className="text-red-500 text-sm mt-1">{errors.password?.message}</p></div>
              <div>
                <Label>Role</Label>
                <Controller name="role_id" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isFormReady}>
                    <SelectTrigger>
                      <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select a role..."} />
                    </SelectTrigger>
                    <SelectContent>{roles?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
                {rolesError && <p className="text-red-500 text-sm mt-1">Could not load roles. Please try again.</p>}
                <p className="text-red-500 text-sm mt-1">{errors.role_id?.message}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/employees')}>Cancel</Button>
            <Button type="submit" disabled={!isFormReady || createUserMutation.isPending}>
              {(createUserMutation.isPending || rolesLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {rolesLoading ? 'Loading...' : createUserMutation.isPending ? 'Saving...' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddEmployee;
