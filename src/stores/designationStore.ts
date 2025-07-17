
import { create } from 'zustand';

export interface Designation {
  id: string;
  name: string;
  level: number;
  department: string;
  employeeCount: number;
  minSalary: number;
  maxSalary: number;
  description: string;
  isActive: boolean;
}

interface DesignationState {
  designations: Designation[];
  loading: boolean;
  fetchDesignations: () => void;
  addDesignation: (designation: Omit<Designation, 'id'>) => void;
  updateDesignation: (id: string, designation: Partial<Designation>) => void;
  deleteDesignation: (id: string) => void;
  getDesignationById: (id: string) => Designation | undefined;
}

// Mock designations data with 30+ entries
const mockDesignations: Designation[] = [
  {
    id: '1',
    name: 'Port Manager',
    level: 1,
    department: 'Operations',
    employeeCount: 3,
    minSalary: 80000,
    maxSalary: 100000,
    description: 'Senior management position overseeing port operations',
    isActive: true
  },
  {
    id: '2',
    name: 'HR Manager',
    level: 1,
    department: 'Human Resources',
    employeeCount: 2,
    minSalary: 70000,
    maxSalary: 90000,
    description: 'Human resources management and strategy',
    isActive: true
  },
  {
    id: '3',
    name: 'Security Officer',
    level: 3,
    department: 'Security',
    employeeCount: 8,
    minSalary: 40000,
    maxSalary: 55000,
    description: 'Port security and safety enforcement',
    isActive: true
  },
  {
    id: '4',
    name: 'Financial Analyst',
    level: 2,
    department: 'Finance',
    employeeCount: 4,
    minSalary: 60000,
    maxSalary: 75000,
    description: 'Financial analysis and reporting',
    isActive: true
  },
  {
    id: '5',
    name: 'System Administrator',
    level: 2,
    department: 'IT',
    employeeCount: 3,
    minSalary: 65000,
    maxSalary: 80000,
    description: 'IT infrastructure management',
    isActive: true
  },
  {
    id: '6',
    name: 'Civil Engineer',
    level: 2,
    department: 'Engineering',
    employeeCount: 6,
    minSalary: 58000,
    maxSalary: 72000,
    description: 'Infrastructure design and maintenance',
    isActive: true
  },
  {
    id: '7',
    name: 'Cargo Supervisor',
    level: 3,
    department: 'Operations',
    employeeCount: 12,
    minSalary: 38000,
    maxSalary: 48000,
    description: 'Cargo handling supervision',
    isActive: true
  },
  {
    id: '8',
    name: 'Accountant',
    level: 3,
    department: 'Finance',
    employeeCount: 5,
    minSalary: 45000,
    maxSalary: 58000,
    description: 'Financial record keeping and accounting',
    isActive: true
  },
  {
    id: '9',
    name: 'Database Administrator',
    level: 2,
    department: 'IT',
    employeeCount: 2,
    minSalary: 68000,
    maxSalary: 82000,
    description: 'Database management and optimization',
    isActive: true
  },
  {
    id: '10',
    name: 'Mechanical Engineer',
    level: 2,
    department: 'Engineering',
    employeeCount: 4,
    minSalary: 60000,
    maxSalary: 74000,
    description: 'Mechanical systems design and maintenance',
    isActive: true
  },
  {
    id: '11',
    name: 'Operations Assistant',
    level: 4,
    department: 'Operations',
    employeeCount: 15,
    minSalary: 35000,
    maxSalary: 42000,
    description: 'General operations support',
    isActive: true
  },
  {
    id: '12',
    name: 'Security Guard',
    level: 4,
    department: 'Security',
    employeeCount: 20,
    minSalary: 32000,
    maxSalary: 38000,
    description: 'Basic security duties',
    isActive: true
  },
  {
    id: '13',
    name: 'HR Executive',
    level: 3,
    department: 'Human Resources',
    employeeCount: 4,
    minSalary: 50000,
    maxSalary: 62000,
    description: 'HR operations and employee relations',
    isActive: true
  },
  {
    id: '14',
    name: 'Training Coordinator',
    level: 3,
    department: 'Human Resources',
    employeeCount: 2,
    minSalary: 55000,
    maxSalary: 65000,
    description: 'Employee training and development',
    isActive: true
  },
  {
    id: '15',
    name: 'Quality Inspector',
    level: 3,
    department: 'Quality Assurance',
    employeeCount: 6,
    minSalary: 42000,
    maxSalary: 52000,
    description: 'Quality control and inspection',
    isActive: true
  },
  {
    id: '16',
    name: 'Environmental Officer',
    level: 2,
    department: 'Environmental',
    employeeCount: 3,
    minSalary: 58000,
    maxSalary: 70000,
    description: 'Environmental compliance and monitoring',
    isActive: true
  },
  {
    id: '17',
    name: 'Procurement Specialist',
    level: 3,
    department: 'Procurement',
    employeeCount: 5,
    minSalary: 48000,
    maxSalary: 60000,
    description: 'Purchasing and vendor management',
    isActive: true
  },
  {
    id: '18',
    name: 'Legal Advisor',
    level: 2,
    department: 'Legal',
    employeeCount: 2,
    minSalary: 75000,
    maxSalary: 95000,
    description: 'Legal counsel and compliance',
    isActive: true
  },
  {
    id: '19',
    name: 'Port Pilot',
    level: 2,
    department: 'Operations',
    employeeCount: 8,
    minSalary: 70000,
    maxSalary: 85000,
    description: 'Ship navigation and piloting',
    isActive: true
  },
  {
    id: '20',
    name: 'Crane Operator',
    level: 3,
    department: 'Operations',
    employeeCount: 12,
    minSalary: 45000,
    maxSalary: 55000,
    description: 'Heavy machinery operation',
    isActive: true
  },
  {
    id: '21',
    name: 'Electrical Engineer',
    level: 2,
    department: 'Engineering',
    employeeCount: 4,
    minSalary: 62000,
    maxSalary: 76000,
    description: 'Electrical systems maintenance',
    isActive: true
  },
  {
    id: '22',
    name: 'Software Developer',
    level: 3,
    department: 'IT',
    employeeCount: 3,
    minSalary: 65000,
    maxSalary: 78000,
    description: 'Software development and maintenance',
    isActive: true
  },
  {
    id: '23',
    name: 'Budget Analyst',
    level: 3,
    department: 'Finance',
    employeeCount: 2,
    minSalary: 52000,
    maxSalary: 64000,
    description: 'Budget planning and analysis',
    isActive: true
  },
  {
    id: '24',
    name: 'Safety Officer',
    level: 2,
    department: 'Security',
    employeeCount: 4,
    minSalary: 55000,
    maxSalary: 68000,
    description: 'Workplace safety and compliance',
    isActive: true
  },
  {
    id: '25',
    name: 'Documentation Clerk',
    level: 4,
    department: 'Operations',
    employeeCount: 8,
    minSalary: 30000,
    maxSalary: 38000,
    description: 'Document processing and filing',
    isActive: true
  },
  {
    id: '26',
    name: 'Maintenance Technician',
    level: 4,
    department: 'Engineering',
    employeeCount: 15,
    minSalary: 35000,
    maxSalary: 45000,
    description: 'Equipment maintenance and repair',
    isActive: true
  },
  {
    id: '27',
    name: 'Communications Officer',
    level: 3,
    department: 'Public Relations',
    employeeCount: 2,
    minSalary: 48000,
    maxSalary: 58000,
    description: 'Internal and external communications',
    isActive: true
  },
  {
    id: '28',
    name: 'Warehouse Supervisor',
    level: 3,
    department: 'Operations',
    employeeCount: 6,
    minSalary: 42000,
    maxSalary: 52000,
    description: 'Warehouse operations management',
    isActive: true
  },
  {
    id: '29',
    name: 'Tax Specialist',
    level: 3,
    department: 'Finance',
    employeeCount: 2,
    minSalary: 58000,
    maxSalary: 68000,
    description: 'Tax compliance and planning',
    isActive: true
  },
  {
    id: '30',
    name: 'Network Administrator',
    level: 3,
    department: 'IT',
    employeeCount: 2,
    minSalary: 55000,
    maxSalary: 68000,
    description: 'Network infrastructure management',
    isActive: true
  }
];

export const useDesignationStore = create<DesignationState>((set, get) => ({
  designations: mockDesignations,
  loading: false,
  fetchDesignations: () => {
    set({ loading: true });
    // Simulate API call
    setTimeout(() => {
      set({ loading: false });
    }, 1000);
  },
  addDesignation: (designationData) => {
    const newDesignation: Designation = {
      ...designationData,
      id: Date.now().toString(),
    };
    set((state) => ({
      designations: [...state.designations, newDesignation]
    }));
  },
  updateDesignation: (id, designationData) => {
    set((state) => ({
      designations: state.designations.map(desig => 
        desig.id === id ? { ...desig, ...designationData } : desig
      )
    }));
  },
  deleteDesignation: (id) => {
    set((state) => ({
      designations: state.designations.filter(desig => desig.id !== id)
    }));
  },
  getDesignationById: (id) => {
    return get().designations.find(desig => desig.id === id);
  }
}));
