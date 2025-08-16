import { useState, useEffect } from 'react';
import { AttendanceRecord } from '../types';

export const useAttendance = (employeeId: string) => {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayRecord();
    loadAttendanceHistory();
  }, [employeeId]);

  const loadTodayRecord = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    const record = savedRecords.find((r: AttendanceRecord) => 
      r.employee_id === employeeId && r.date === today
    );
    setTodayRecord(record || null);
    setLoading(false);
  };

  const loadAttendanceHistory = () => {
    const savedRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    const history = savedRecords
      .filter((r: AttendanceRecord) => r.employee_id === employeeId)
      .sort((a: AttendanceRecord, b: AttendanceRecord) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    setAttendanceHistory(history);
  };

  const clockIn = async (faceVerified: boolean = true) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employee_id: employeeId,
      clock_in: now.toISOString(),
      date: today,
      status: now.getHours() > 9 ? 'late' : 'present',
      face_verified: faceVerified,
      created_at: now.toISOString()
    };

    const savedRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    savedRecords.push(newRecord);
    localStorage.setItem('attendance_records', JSON.stringify(savedRecords));
    
    setTodayRecord(newRecord);
    loadAttendanceHistory();
    
    return { success: true };
  };

  const clockOut = async (faceVerified: boolean = true) => {
    if (!todayRecord) return { success: false, error: 'No clock-in record found' };

    const now = new Date();
    const updatedRecord = {
      ...todayRecord,
      clock_out: now.toISOString(),
      face_verified: faceVerified
    };

    const savedRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    const updatedRecords = savedRecords.map((r: AttendanceRecord) => 
      r.id === todayRecord.id ? updatedRecord : r
    );
    localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
    
    setTodayRecord(updatedRecord);
    loadAttendanceHistory();
    
    return { success: true };
  };

  return {
    todayRecord,
    attendanceHistory,
    loading,
    clockIn,
    clockOut
  };
};