// src/pages/Employees/EmployeeProfile.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User as UserIcon,
  Edit,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  AlertCircle,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading, error } = useUser(id!);

  // Mock salary data - in a real app, this would come from an API
  const salaryData = [
    { month: 'Jan', salary: 48000 }, { month: 'Feb', salary: 49500 },
    { month: 'Mar', salary: 50000 }, { month: 'Apr', salary: 51000 },
    { month: 'May', salary: 50500 }, { month: 'Jun', salary: 52000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Exited': return 'bg-red-100 text-red-800';
      case 'Probation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (error || !employee) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Employee Not Found</h2>
          <p className="text-gray-600 mt-2">{error?.message || 'The requested employee profile could not be found.'}</p>
          <Button onClick={() => navigate('/employees')} className="mt-4">
            Back to Employees
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const name = `${employee.first_name} ${employee.last_name}`;
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();
  const yearsOfService = new Date().getFullYear() - new Date(employee.doj).getFullYear();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-200">
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-2xl">
                            {initials}
                        </AvatarFallback>
                        </Avatar>
                        <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>
                        <p className="text-gray-600">{employee.designation?.title || 'N/A'}</p>
                         <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                            <Badge variant="outline">{employee.type_code}</Badge>
                         </div>
                        </div>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/employees/edit/${employee.id}`)}
                            className="flex-1 sm:flex-initial"
                        >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button className="flex-1 sm:flex-initial">
                            <DollarSign className="h-4 w-4 mr-2" /> Manage Salary
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><p className="text-sm text-gray-600">Employee ID</p><p className="text-lg font-semibold">{employee.emp_code}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-gray-600">Department</p><p className="text-lg font-semibold truncate">{employee.department?.name || 'N/A'}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-gray-600">Service Years</p><p className="text-lg font-semibold">{yearsOfService}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-gray-600">Joined On</p><p className="text-lg font-semibold">{new Date(employee.doj).toLocaleDateString()}</p></CardContent></Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex"><Mail className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Email:</span><p className="font-medium">{employee.email}</p></div></div>
                <div className="flex"><Phone className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Phone:</span><p className="font-medium">{employee.phone || 'N/A'}</p></div></div>
                <div className="flex"><Calendar className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Date of Birth:</span><p className="font-medium">{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p></div></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
             <Card><CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                 <div className="flex"><Award className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Designation:</span><p className="font-medium">{employee.designation?.title || 'N/A'}</p></div></div>
                 <div className="flex"><Building className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Department:</span><p className="font-medium">{employee.department?.name || 'N/A'}</p></div></div>
                 <div className="flex"><Calendar className="w-4 h-4 mr-2 mt-1 text-gray-400" /><div><span className="text-gray-500">Probation End:</span><p className="font-medium">{employee.probation_end ? new Date(employee.probation_end).toLocaleDateString() : 'N/A'}</p></div></div>
              </CardContent>
            </Card>
          </TabsContent>
          
           <TabsContent value="salary">
             <Card>
                <CardHeader><CardTitle>Salary Trend (Last 6 Months)</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salaryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="salary" stroke="#1d4ed8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
           </TabsContent>
           
           <TabsContent value="documents">
                <Card><CardHeader><CardTitle>Documents</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-gray-600">Document management coming soon.</p>
                        {/* Document list would be rendered here */}
                    </CardContent>
                </Card>
           </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default EmployeeProfile;
