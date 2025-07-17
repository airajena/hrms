// src/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/userApi';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { toast } from './use-toast';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook to fetch a list of users with filters.
 * Aligned with GET /users endpoint.
 */
export const useUsers = (params: {
  search?: string;
  status?: string[];
  department_id?: string[];
  type_code?: string[];
} = {}) => {
  // The query expects to receive a direct array of User objects, matching the API contract.
  return useQuery<User[], Error>({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single user by their ID.
 * Aligned with GET /users/<id> endpoint.
 */
export const useUser = (id: string) => {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

/**
 * Hook to create a new user.
 * Aligned with POST /users endpoint.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, CreateUserRequest>({
    mutationFn: userApi.createUser,
    onSuccess: (newUser) => {
      // When a user is created, invalidate the list queries to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: `Employee "${newUser.first_name} ${newUser.last_name}" has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Employee",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to update an existing user.
 * Aligned with PUT /users/<id> endpoint.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, { id: string; data: UpdateUserRequest }>({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate lists and update the specific user's cache for immediate UI updates
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      toast({
        title: "Success",
        description: `Employee "${updatedUser.first_name} ${updatedUser.last_name}" has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Employee",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to soft-delete a user.
 * Aligned with DELETE /users/<id> endpoint.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  // The mutation now expects the full response object from the DELETE API
  return useMutation<{ id: string; is_active: boolean; is_deleted: boolean; message: string }, Error, string>({
    mutationFn: async (id: string) => {
      // Call the API and get the response
      const response = await userApi.deleteUser(id);
      // You may need to fetch the user or return the deleted info, adjust as needed
      return {
        id,
        is_active: false,
        is_deleted: true,
        message: response.message,
      };
    },
    onSuccess: (data, deletedId) => {
      // Invalidate lists to remove the user and also remove the detailed query from cache
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      toast({
        title: "Employee Deleted",
        description: data.message || "The employee has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Employee",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
};
