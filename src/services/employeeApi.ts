
import { Employee } from '../types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/';

export interface EmployeeResponse {
  employees: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  classification: string;
  status: string;
  joiningDate: string;
  basicSalary: number;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export const employeeApi = {
  // Get all employees with pagination
  getEmployees: async (params: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: string;
    department?: string;
    classification?: string;
  } = {}): Promise<EmployeeResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.department) searchParams.append('department', params.department);
    if (params.classification) searchParams.append('classification', params.classification);

    const response = await fetch(`${API_BASE_URL}/employees?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-Code': localStorage.getItem('tenant_code') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  },

  // Create new employee
  createEmployee: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-Code': localStorage.getItem('tenant_code') || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create employee');
    }

    return response.json();
  },

  // Update employee
  updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-Code': localStorage.getItem('tenant_code') || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    return response.json();
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-Code': localStorage.getItem('tenant_code') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }
  },

  // Get employee by ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-Code': localStorage.getItem('tenant_code') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }

    return response.json();
  },
};
