import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { AttendanceRecord } from '../types';

interface AttendanceHistoryProps {
  employeeId: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ employeeId }) => {
  const { attendanceHistory, loading } = useAttendance(employeeId);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'absent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const calculateWorkingHours = (record: AttendanceRecord) => {
    if (!record.clock_out) return 'Ongoing';
    
    const clockIn = new Date(record.clock_in);
    const clockOut = new Date(record.clock_out);
    const diff = clockOut.getTime() - clockIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance History</h2>
        <p className="text-gray-600 mt-1">Track your attendance records</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Records</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {attendanceHistory.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance records found</p>
            </div>
          ) : (
            attendanceHistory.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {formatDate(record.date)}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>In: {formatTime(record.clock_in)}</span>
                        </div>
                        {record.clock_out && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Out: {formatTime(record.clock_out)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border mb-2 ${getStatusColor(record.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(record.status)}
                        <span>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Hours: {calculateWorkingHours(record)}</p>
                      <p className="text-xs mt-1">
                        {record.face_verified ? '✅ Face Verified' : '❌ Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};