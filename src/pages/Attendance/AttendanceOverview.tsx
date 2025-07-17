
import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { useAttendanceStore } from '../../stores/attendanceStore';
import { useEmployeeStore } from '../../stores/employeeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Clock, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Timer,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

const AttendanceOverview = () => {
  const { records, punchIn, punchOut } = useAttendanceStore();
  const { employees } = useEmployeeStore();
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    onTime: 0,
    late: 0,
    averageHours: 0
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = records.filter(record => record.date === today);
    
    // Merge attendance records with employee data
    const mergedRecords = todayAttendance.map(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      return {
        ...record,
        employeeName: employee?.name || 'Unknown',
        department: employee?.department || 'Unknown'
      };
    });

    setTodayRecords(mergedRecords);

    // Calculate stats
    const present = todayAttendance.filter(r => r.status === 'Present').length;
    const absent = employees.length - present;
    const onTime = todayAttendance.filter(r => 
      r.punchIn && r.punchIn <= '09:30'
    ).length;
    const late = present - onTime;
    const avgHours = todayAttendance.reduce((acc, curr) => acc + curr.totalHours, 0) / todayAttendance.length || 0;

    setStats({
      totalPresent: present,
      totalAbsent: absent,
      onTime,
      late,
      averageHours: Math.round(avgHours * 10) / 10
    });
  }, [records, employees]);

  const handlePunchIn = (employeeId: string) => {
    punchIn(employeeId, 'Mumbai Port');
  };

  const handlePunchOut = (employeeId: string) => {
    punchOut(employeeId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Late':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Half Day':
        return <Timer className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      case 'Half Day':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Clock className="h-8 w-8 mr-3 text-blue-600" />
              Attendance Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitor daily attendance and track employee presence</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today's Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Present Today</p>
                  <p className="text-2xl font-bold">{stats.totalPresent}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-100">Absent Today</p>
                  <p className="text-2xl font-bold">{stats.totalAbsent}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">On Time</p>
                  <p className="text-2xl font-bold">{stats.onTime}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-100">Late Arrivals</p>
                  <p className="text-2xl font-bold">{stats.late}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">Avg. Hours</p>
                  <p className="text-2xl font-bold">{stats.averageHours}h</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Today's Attendance ({format(new Date(), 'MMM d, yyyy')})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Punch In</TableHead>
                    <TableHead>Punch Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {record.employeeName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{record.employeeName}</p>
                            <p className="text-sm text-gray-500">ID: {record.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {record.punchIn ? (
                            <>
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="font-mono">{record.punchIn}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">Not punched in</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {record.punchOut ? (
                            <>
                              <Clock className="h-4 w-4 text-red-500" />
                              <span className="font-mono">{record.punchOut}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">Not punched out</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{record.totalHours.toFixed(1)}h</span>
                      </TableCell>
                      <TableCell>
                        {record.overtime > 0 ? (
                          <span className="font-mono text-orange-600">+{record.overtime.toFixed(1)}h</span>
                        ) : (
                          <span className="text-gray-400">0h</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{record.location || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(record.status)}
                            <span>{record.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!record.punchIn && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePunchIn(record.employeeId)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              Punch In
                            </Button>
                          )}
                          {record.punchIn && !record.punchOut && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePunchOut(record.employeeId)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Punch Out
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {todayRecords.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records found for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AttendanceOverview;
