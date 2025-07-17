// src/hooks/useRoles.ts
import { useQuery } from '@tanstack/react-query';
import { roleApi } from '../services/roleApi';
import { Role } from '../types';

// Centralized query keys for roles
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
};

/**
 * Hook to fetch a list of all available roles.
 */
export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: roleKeys.lists(),
    queryFn: () => roleApi.getRoles(),
    staleTime: 1000 * 60 * 60, // 1 hour, since roles change infrequently
  });
};
