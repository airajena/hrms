// hooks/useDepartments.ts (note the 's' at the end)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi, CreateDepartmentRequest, UpdateDepartmentRequest } from '../services/departmentApi';
import { toast } from './use-toast';

// Query keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...departmentKeys.lists(), filters] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

// Get departments with pagination and filters
export const useDepartments = (params: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
} = {}) => {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => departmentApi.getDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get department by ID
export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentApi.getDepartmentById(id),
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Create department mutation
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentApi.createDepartment(data),
    onSuccess: (newDepartment) => {
      // Invalidate and refetch departments list
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      
      toast({
        title: "Department Created",
        description: `${newDepartment.name} has been added successfully.`,
      });
    },
    onError: (error: Error) => {
      console.error('Create department error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });
};

// Update department mutation
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDepartmentRequest) => departmentApi.updateDepartment(data),
    onSuccess: (updatedDepartment) => {
      // Update specific department in cache
      queryClient.setQueryData(
        departmentKeys.detail(updatedDepartment.id),
        updatedDepartment
      );
      
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      
      toast({
        title: "Department Updated",
        description: `${updatedDepartment.name} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      console.error('Update department error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update department",
        variant: "destructive",
      });
    },
  });
};

// Delete department mutation
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: departmentKeys.detail(deletedId) });
      
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      
      toast({
        title: "Department Deleted",
        description: "Department has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Delete department error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    },
  });
};
