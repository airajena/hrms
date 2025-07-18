import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/userApi';
import { CreateUserRequest, UpdateUserRequest, User } from '../types';
import { toast } from './use-toast';

// Consistent query keys for caching user data
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Fetches a list of users based on filter parameters.
 * This is used by EmployeeList.tsx.
 */
export const useUsers = (params: {
  search?: string;
  status?: string[];
  department_id?: string[];
  type_code?: string[];
} = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetches a single user by their ID.
 */
export const useUser = (id?: string) => {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => userApi.getUserById(id!),
    enabled: !!id, // Only run the query if an ID is provided
  });
};

/**
 * Provides a mutation function for creating a new user.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: (newUser) => {
      // When creation is successful, refetch the entire list of users
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Employee Created",
        description: `${newUser.first_name} ${newUser.last_name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Provides a mutation function for updating an existing user.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Optimistically update the user's detail cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate the list to ensure it's fresh
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Employee Updated",
        description: `${updatedUser.first_name} ${updatedUser.last_name}'s data has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Provides a mutation function for deleting a user.
 * This is used by EmployeeList.tsx.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Invalidate the user list to reflect the deletion
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Employee Deleted",
        description: "The employee has been successfully removed.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};