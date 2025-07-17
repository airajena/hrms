// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  tenantCode: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantCode: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  setTenantCode: (tenantCode: string) => void;
  checkAuth: () => boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tenantCode: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string, tenantCode: string) => {
        try {
          console.log('Attempting login with:', { email, tenantCode });

          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Tenant-Code': tenantCode,
            },
            body: JSON.stringify({ email, password }),
          });

          console.log('Login response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log('Login error data:', errorData);
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await response.json();
          console.log('Login successful, received token:', data.token ? 'Present' : 'Missing');
          console.log('Full login response data:', data);

          const token = data.token || data.access_token; 
          
          console.log('Login successful, received token:', token ? 'Present' : 'Missing');
          console.log('Full login response data:', data);

          // 2. Add a guard clause to fail early if no token is found.
          if (!token) {
            console.error('Login response did not include a token.', data);
            throw new Error('Authentication failed: No token received from server.');
          }
          
          // Store authentication data in both state and localStorage
          // 3. Use the extracted 'token' variable.
          const authData = {
            user: data.user, 
            token: token, // Use the extracted token
            tenantCode: tenantCode,
            isAuthenticated: true
          };
          
          set(authData);
          
          localStorage.setItem('token', token); // Use the extracted token
          localStorage.setItem('tenant_code', tenantCode);
          
          console.log('Token stored in localStorage:', localStorage.getItem('token') ? 'Success' : 'Failed');
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          // Set isAuthenticated to false to be safe
          set({ isAuthenticated: false, token: null, user: null });
          throw error;
        }
      },
      
       logout: () => {
        console.log('Logging out user');
        set({ 
          user: null, 
          token: null, 
          tenantCode: null,
          isAuthenticated: false 
        });
        localStorage.removeItem('token');
        localStorage.removeItem('tenant_code');
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('token', token);
      },
      
      setTenantCode: (tenantCode: string) => {
        set({ tenantCode });
        localStorage.setItem('tenant_code', tenantCode);
      },
      
      checkAuth: () => {
        const state = get();
        const token = localStorage.getItem('token');
        const tenantCode = localStorage.getItem('tenant_code');
        
        console.log('Auth check:', { 
          hasToken: !!token, 
          hasTenantCode: !!tenantCode,
          isAuthenticated: state.isAuthenticated 
        });
        
        return !!(token && tenantCode && state.isAuthenticated);
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tenantCode: state.tenantCode,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
