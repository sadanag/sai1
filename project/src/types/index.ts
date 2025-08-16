export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  face_data?: string;
  is_active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  face_verified: boolean;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  leave_type: 'sick' | 'casual' | 'vacation' | 'emergency';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  employee: Employee | null;
  loading: boolean;
}