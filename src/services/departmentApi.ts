import { Department } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface CreateDepartmentRequest {
  name: string;
  is_active?: boolean;
}

export interface UpdateDepartmentRequest {
  id: string;
  name: string;
  is_active: boolean;
}

class DepartmentApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'DepartmentApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const tenantCode = localStorage.getItem('tenant_code');
  
  console.log('Auth Debug:', { 
    token: token ? `Present (${token.substring(0, 20)}...)` : 'Missing', 
    tenantCode 
  });
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Tenant-Code': tenantCode || '',
  };
};

const handleApiError = async (response: Response) => {
  console.log('API Error Response:', response.status, response.statusText);
  
  if (response.status === 401) {
    console.log('401 Error - Token expired or invalid');
    // Clear invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('tenant_code');
    
    // Import and logout
    const { useAuthStore } = await import('../stores/authStore');
    useAuthStore.getState().logout();
    
    throw new DepartmentApiError('Session expired. Please login again.', 401);
  }
  
  let errorMessage = 'API request failed';
  try {
    const errorData = await response.json();
    console.log('Error Data:', errorData);
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (e) {
    console.log('Failed to parse error response');
  }
  
  throw new DepartmentApiError(errorMessage, response.status);
};

export const departmentApi = {
  getDepartments: async (params: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
  } = {}): Promise<Department[]> => {
    console.log('Fetching departments with params:', params);
    
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/departments${queryString ? `?${queryString}` : ''}`;

    console.log('Request URL:', url);
    
    try {
      const headers = getAuthHeaders();
      console.log('Request Headers:', headers);

      const response = await fetch(url, {
        headers,
      });

      console.log('Response Status:', response.status);

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      console.log('Response Data:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  // Create new department
  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    console.log('Creating department:', data);
    
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Update department
  updateDepartment: async (data: UpdateDepartmentRequest): Promise<Department> => {
    const { id, ...updateData } = data;
    console.log('Updating department:', id, updateData);
    
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  // Delete department
  deleteDepartment: async (id: string): Promise<void> => {
    console.log('Deleting department:', id);
    
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  },

  // Get department by ID
  getDepartmentById: async (id: string): Promise<Department> => {
    console.log('Fetching department by ID:', id);
    
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },
};
