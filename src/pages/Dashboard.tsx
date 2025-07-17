import { useEffect, useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useAuthStore } from '../stores/authStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { EmployeeStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const { user } = useAuthStore();
  const { employees, departments } = useEmployeeStore();

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === EmployeeStatus.Confirmed).length;
  const probationEmployees = employees.filter(emp => emp.status === EmployeeStatus.Probation).length;
  const newJoinersThisMonth = employees.filter(emp => {
    const joiningDate = new Date(emp.doj);
    const currentDate = new Date();
    return joiningDate.getMonth() === currentDate.getMonth() && 
           joiningDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const totalDepartments = departments.length;
  const totalEmployeeCount = departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track key metrics and get an overview of your organization.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Employees</p>
                  <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On Probation</p>
                  <p className="text-2xl font-bold text-yellow-600">{probationEmployees}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Joiners (This Month)</p>
                  <p className="text-2xl font-bold text-purple-600">{newJoinersThisMonth}</p>
                </div>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department and Employee Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Department overview section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departments.slice(0, 5).map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-gray-500">Head: {dept.head || 'Not assigned'}</p>
                    </div>
                    <Badge variant="secondary">
                      {dept.employeeCount || 0} employees
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recently Added Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Joining Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.slice(0, 5).map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department?.name}</TableCell>
                        <TableCell>{new Date(employee.doj).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
