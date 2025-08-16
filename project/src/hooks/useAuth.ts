import { useState, useEffect } from 'react';
import { Employee, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    employee: null,
    loading: true
  });

  useEffect(() => {
    // Check for existing session
    const savedEmployee = localStorage.getItem('employee');
    if (savedEmployee) {
      setAuthState({
        isAuthenticated: true,
        employee: JSON.parse(savedEmployee),
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (employeeId: string, otp: string) => {
    // Simulate OTP verification and employee lookup
    if (otp === '123456') {
      const mockEmployee: Employee = {
        id: '1',
        employee_id: employeeId,
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1234567890',
        face_data: 'mock_face_data',
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('employee', JSON.stringify(mockEmployee));
      setAuthState({
        isAuthenticated: true,
        employee: mockEmployee,
        loading: false
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP' };
  };

  const logout = () => {
    localStorage.removeItem('employee');
    setAuthState({
      isAuthenticated: false,
      employee: null,
      loading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};