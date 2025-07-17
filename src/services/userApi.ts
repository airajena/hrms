// src/services/userApi.ts
import { User, CreateUserRequest, UpdateUserRequest } from '../types';

// Using the root URL to match your Flask configuration.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const tenantCode = localStorage.getItem('tenant_code');
  if (!token) throw new Error('Authentication token not found.');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Tenant-Code': tenantCode || '',
  };
};

const apiFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  // FIX: This ensures that even if API_BASE_URL has a trailing slash, 
  // we won't get double slashes in the final URL.
  const fullUrl = new URL(url, API_BASE_URL).href;

  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error ? JSON.stringify(errorData.error) : (errorData.message || 'An unknown API error occurred');
        throw new Error(errorMessage);
    }
    if (response.status === 204) return null as T;
    return response.json();
  } catch (error) {
    console.error(`API Fetch Error on ${fullUrl}:`, error);
    throw error;
  }
};

export const userApi = {
  getUsers: async (params: {
    search?: string;
    status?: string[];
    department_id?: string[];
    type_code?: string[];
  } = {}): Promise<User[]> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    params.status?.forEach(s => searchParams.append('status', s));
    params.department_id?.forEach(d => searchParams.append('department_id', d));
    params.type_code?.forEach(t => searchParams.append('type_code', t));

    // The path starts with a slash to signify it's from the root of the base URL.
    return apiFetch<User[]>(`/users?${searchParams}`, {
      headers: getAuthHeaders(),
    });
  },

  getUserById: async (id: string): Promise<User> => {
    if (!id) throw new Error('User ID is required.');
    return apiFetch<User>(`/users/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    return apiFetch<User>('/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return apiFetch<User>(`/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: string): Promise<{ id: string; message: string }> => {
    return apiFetch<{ id: string; message: string }>(`/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
};
