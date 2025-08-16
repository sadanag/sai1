import { useState, useEffect } from 'react';
import { LeaveRequest } from '../types';

export const useLeaves = (employeeId: string) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, [employeeId]);

  const loadLeaves = () => {
    const savedLeaves = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    const employeeLeaves = savedLeaves.filter((l: LeaveRequest) => l.employee_id === employeeId);
    setLeaves(employeeLeaves);
    setLoading(false);
  };

  const applyLeave = async (leaveData: Omit<LeaveRequest, 'id' | 'employee_id' | 'status' | 'created_at'>) => {
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      employee_id: employeeId,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...leaveData
    };

    const savedLeaves = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    savedLeaves.push(newLeave);
    localStorage.setItem('leave_requests', JSON.stringify(savedLeaves));
    
    setLeaves(prev => [newLeave, ...prev]);
    return { success: true };
  };

  return {
    leaves,
    loading,
    applyLeave
  };
};