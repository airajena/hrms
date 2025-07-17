// src/hooks/useDesignations.ts
// This file is mostly correct as you provided it. Just ensure the imports are right.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Make sure this path is correct
import { designationApi, CreateDesignationRequest, UpdateDesignationRequest } from '../services/designationApi';
import { toast } from './use-toast';

// Query keys
export const designationKeys = {
  all: ['designations'] as const,
  lists: () => [...designationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...designationKeys.lists(), filters] as const,
  details: () => [...designationKeys.all, 'detail'] as const,
  detail: (id: string) => [...designationKeys.details(), id] as const,
};

// Get designations with pagination and filters
export const useDesignations = (params: {
  page?: number;
  page_size?: number;
  search?: string;
  level?: number;
  department_id?: string;
} = {}) => {
  return useQuery({
    queryKey: designationKeys.list(params),
    queryFn: () => designationApi.getDesignations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get designation by ID
export const useDesignation = (id: string) => {
  return useQuery({
    queryKey: designationKeys.detail(id),
    queryFn: () => designationApi.getDesignationById(id),
    enabled: !!id, // Only run query if ID is present
  });
};

// Create designation mutation
export const useCreateDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDesignationRequest) => designationApi.createDesignation(data),
    onSuccess: (newDesignation) => {
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      toast({
        title: "Designation Created",
        description: `${newDesignation.title} has been added successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create designation",
        variant: "destructive",
      });
    },
  });
};

// Update designation mutation
export const useUpdateDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDesignationRequest) => designationApi.updateDesignation(data),
    onSuccess: (updatedDesignation) => {
      // Optimistically update the cache for the specific item
      queryClient.setQueryData(
        designationKeys.detail(updatedDesignation.id),
        updatedDesignation
      );
      // Invalidate the list to refetch in the background
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      
      toast({
        title: "Designation Updated",
        description: `${updatedDesignation.title} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update designation",
        variant: "destructive",
      });
    },
  });
};

// Delete designation mutation
export const useDeleteDesignation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => designationApi.deleteDesignation(id),
    onSuccess: (_, deletedId) => {
      // When a delete is successful, invalidate the list query to refetch
      queryClient.invalidateQueries({ queryKey: designationKeys.lists() });
      
      toast({
        title: "Designation Deleted",
        description: "Designation has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete designation",
        variant: "destructive",
      });
    },
  });
};
