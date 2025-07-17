// src/services/roleApi.ts
import { Role } from '../types';

// Ensure the base URL is consistent and doesn't have a trailing slash
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/';

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
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export const roleApi = {
  /**
   * Fetches a list of all available roles.
   */
  getRoles: async (): Promise<Role[]> => {
    return apiFetch<Role[]>(`${API_BASE_URL}/roles`, {
      headers: getAuthHeaders(),
    });
  },
};
