
import { create } from 'zustand';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Processed' | 'Pending' | 'Draft';
  processedAt?: string;
}

interface PayrollStore {
  records: PayrollRecord[];
  isProcessing: boolean;
  processPayroll: (month: string, year: number) => void;
  generatePaySlip: (recordId: string) => void;
}

// Mock payroll data
const mockPayrollRecords: PayrollRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: `PAY-${String(i + 1).padStart(3, '0')}`,
  employeeId: `EMP-${String((i % 25) + 1).padStart(3, '0')}`,
  month: ['January', 'February', 'March', 'April', 'May'][i % 5],
  year: 2024,
  basicSalary: 25000 + (i * 500),
  allowances: 5000 + (i * 100),
  deductions: 2000 + (i * 50),
  netSalary: 28000 + (i * 550),
  status: ['Processed', 'Pending', 'Draft'][i % 3] as any,
  processedAt: i % 3 === 0 ? new Date(2024, i % 12, 15).toISOString() : undefined,
}));

export const usePayrollStore = create<PayrollStore>((set) => ({
  records: mockPayrollRecords,
  isProcessing: false,
  processPayroll: (month: string, year: number) => {
    set({ isProcessing: true });
    setTimeout(() => {
      set({ isProcessing: false });
    }, 3000);
  },
  generatePaySlip: (recordId: string) => {
    console.log(`Generating pay slip for record: ${recordId}`);
  }
}));
