
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi, EmployeeResponse, CreateEmployeeRequest } from '../services/employeeApi';
import { Employee } from '../types';
import { toast } from './use-toast';

// Query keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

// Get employees with pagination and filters
export const useEmployees = (params: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  department?: string;
  classification?: string;
} = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeApi.getEmployees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get employee by ID
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id,
  });
};

// Create employee mutation
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => employeeApi.createEmployee(data),
    onSuccess: (newEmployee) => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast({
        title: "Employee Created",
        description: `${newEmployee.name} has been added successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      });
    },
  });
};

// Update employee mutation
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => 
      employeeApi.updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      // Update specific employee in cache
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee.id),
        updatedEmployee
      );
      
      // Invalidate employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast({
        title: "Employee Updated",
        description: `${updatedEmployee.name} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      });
    },
  });
};

// Delete employee mutation
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: employeeKeys.detail(deletedId) });
      
      // Invalidate employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      toast({
        title: "Employee Deleted",
        description: "Employee has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete employee",
        variant: "destructive",
      });
    },
  });
};
