// src/services/designationApi.ts

// NOTE: The API contract uses `title`, while your old mock store used `name`.
// We will follow the API contract.
export interface Designation {
  id: string;
  title: string;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDesignationRequest {
  title: string;
  level?: number;
  is_active?: boolean;
}

export interface UpdateDesignationRequest {
  id: string;
  title?: string;
  level?: number;
  is_active?: boolean;
}

// Re-using the same helpers from departmentApi.ts
// It's good practice to move these to a shared util file (e.g., `src/lib/apiUtils.ts`)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const tenantCode = localStorage.getItem('tenant_code');
  if (!token) throw new Error('No authentication token found');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Tenant-Code': tenantCode || '',
  };
};

const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    const { useAuthStore } = await import('../stores/authStore');
    useAuthStore.getState().logout();
    throw new ApiError('Session expired. Please login again.', 401);
  }
  let errorMessage = 'API request failed';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (e) {
    // Ignore if parsing fails
  }
  throw new ApiError(errorMessage, response.status);
};


export const designationApi = {
  // GET /designations
  getDesignations: async (params: { search?: string } = {}): Promise<Designation[]> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    
    const url = `${API_BASE_URL}/designations?${searchParams.toString()}`;
    console.log('Fetching designations from:', url);

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // GET /designations/:id
  getDesignationById: async (id: string): Promise<Designation> => {
    const url = `${API_BASE_URL}/designations/${id}`;
    console.log('Fetching designation by ID from:', url);

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // POST /designations
  createDesignation: async (data: CreateDesignationRequest): Promise<Designation> => {
    const url = `${API_BASE_URL}/designations`;
    console.log('Creating designation at:', url, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // PUT /designations/:id
  updateDesignation: async (data: UpdateDesignationRequest): Promise<Designation> => {
    const { id, ...updateData } = data;
    const url = `${API_BASE_URL}/designations/${id}`;
    console.log('Updating designation at:', url, updateData);

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },

  // DELETE /designations/:id
  deleteDesignation: async (id: string): Promise<void> => {
    const url = `${API_BASE_URL}/designations/${id}`;
    console.log('Deleting designation at:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    // No content is expected on successful deletion
  },
};
