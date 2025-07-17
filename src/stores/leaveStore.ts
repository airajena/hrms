
import { create } from 'zustand';

export interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

interface LeaveStore {
  types: LeaveType[];
  requests: LeaveRequest[];
  addLeaveType: (type: Omit<LeaveType, 'id'>) => void;
  submitRequest: (request: Omit<LeaveRequest, 'id' | 'appliedAt'>) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
}

const mockLeaveTypes: LeaveType[] = [
  { id: 'LT001', name: 'Annual Leave', maxDays: 21, color: '#10b981' },
  { id: 'LT002', name: 'Sick Leave', maxDays: 12, color: '#f59e0b' },
  { id: 'LT003', name: 'Maternity Leave', maxDays: 180, color: '#ec4899' },
  { id: 'LT004', name: 'Emergency Leave', maxDays: 5, color: '#ef4444' },
];

const mockLeaveRequests: LeaveRequest[] = Array.from({ length: 30 }, (_, i) => ({
  id: `LR-${String(i + 1).padStart(3, '0')}`,
  employeeId: `EMP-${String((i % 25) + 1).padStart(3, '0')}`,
  employeeName: `Employee ${i + 1}`,
  type: mockLeaveTypes[i % 4].name,
  startDate: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
  endDate: new Date(2024, (i % 12), (i % 28) + 3).toISOString().split('T')[0],
  days: 3,
  reason: `Leave reason for employee ${i + 1}`,
  status: ['Pending', 'Approved', 'Rejected'][i % 3] as any,
  appliedAt: new Date(2024, (i % 12), (i % 28)).toISOString(),
}));

export const useLeaveStore = create<LeaveStore>((set) => ({
  types: mockLeaveTypes,
  requests: mockLeaveRequests,
  addLeaveType: (type) => set((state) => ({
    types: [...state.types, { ...type, id: `LT${String(state.types.length + 1).padStart(3, '0')}` }]
  })),
  submitRequest: (request) => set((state) => ({
    requests: [...state.requests, { 
      ...request, 
      id: `LR-${String(state.requests.length + 1).padStart(3, '0')}`,
      appliedAt: new Date().toISOString()
    }]
  })),
  approveRequest: (requestId) => set((state) => ({
    requests: state.requests.map(req => 
      req.id === requestId ? { ...req, status: 'Approved' } : req
    )
  })),
  rejectRequest: (requestId) => set((state) => ({
    requests: state.requests.map(req => 
      req.id === requestId ? { ...req, status: 'Rejected' } : req
    )
  })),
}));
