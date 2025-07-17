
export interface User {
  id: string;
  username: string;
  email: string;
  emp_code: string;
  first_name: string;
  last_name: string;
  type_code: EmployeeType;
  status: EmployeeStatus;
  phone: string | null;
  dob: string | null; // Date as string
  doj: string; // Date as string
  probation_end: string | null; // Date as string
  department_id: string | null;
  designation_id: string | null;
  department: {
    id: string;
    name: string;
  } | null;
  designation: {
    id:string;
    title: string;
  } | null;
  role: {
    id: string;
    name: string;
  } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Enums for dropdowns and filters
export enum EmployeeType {
  Regular = 'Regular',
  Outsourced = 'Outsourced',
  Contractual = 'Contractual',
  Intern = 'Intern',
}

export enum EmployeeStatus {
  Probation = 'Probation',
  Confirmed = 'Confirmed',
  Exited = 'Exited',
}

// Request types for POST and PUT
export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string; // Required on create
  role_id: string;
  emp_code: string;
  type_code: EmployeeType;
  first_name: string;
  last_name: string;
  phone?: string;
  dob?: string;
  doj: string;
  status: EmployeeStatus;
  probation_end?: string;
  department_id?: string;
  designation_id?: string;
}

export interface UpdateUserRequest extends Omit<CreateUserRequest, 'password'> {
  id: string; // ID is part of the request for mutation function
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours: number;
  overtime: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  location?: string;
}

export interface Department {
  id: string;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: string;
  title: string;
  level?: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingApprovals: number;
  totalDepartments: number;
  newJoinersThisMonth: number;
}
