// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import AddEmployee from './pages/Employees/AddEmployee';
import EmployeeProfile from './pages/Employees/EmployeeProfile';
import DepartmentList from './pages/Employees/DepartmentList';
import DesignationList from './pages/Employees/DesignationList';
import AddDepartment from './pages/Employees/AddDepartment';
import EditDepartment from './pages/Employees/EditDepartment';
import AddDesignation from './pages/Employees/AddDesignation';
import EditDesignation from './pages/Employees/EditDesignation';
import EditEmployee from './pages/Employees/EditEmployee';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
        if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          } />
          <Route path="/employees/add" element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          } />
         <Route path="/employees/edit/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          
          <Route path="/departments" element={
            <ProtectedRoute>
              <DepartmentList />
            </ProtectedRoute>
          } />
          <Route path="/departments/add" element={
            <ProtectedRoute>
              <AddDepartment />
            </ProtectedRoute>
          } />
          <Route path="/departments/:id/edit" element={
            <ProtectedRoute>
              <EditDepartment />
            </ProtectedRoute>
          } />
          <Route path="/designations" element={
            <ProtectedRoute>
              <DesignationList />
            </ProtectedRoute>
          } />
          <Route path="/designations/add" element={
            <ProtectedRoute>
              <AddDesignation />
            </ProtectedRoute>
          } />
          <Route path="/designations/:id/edit" element={
            <ProtectedRoute>
              <EditDesignation />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
