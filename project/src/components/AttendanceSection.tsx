import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Camera } from 'lucide-react';
import { Employee } from '../types';
import { useAttendance } from '../hooks/useAttendance';
import { FaceVerification } from './FaceVerification';

interface AttendanceSectionProps {
  employee: Employee;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({ employee }) => {
  const { todayRecord, loading, clockIn, clockOut } = useAttendance(employee.employee_id);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'in' | 'out'>('in');

  const handleClockAction = (action: 'in' | 'out') => {
    setVerificationAction(action);
    setShowFaceVerification(true);
  };

  const handleFaceVerification = async (verified: boolean) => {
    setShowFaceVerification(false);
    
    if (verified) {
      if (verificationAction === 'in') {
        await clockIn(true);
      } else {
        await clockOut(true);
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-gray-700">Clock In</span>
              </div>
              <div className="text-right">
                {todayRecord?.clock_in ? (
                  <div>
                    <div className="font-bold text-green-600">{formatTime(todayRecord.clock_in)}</div>
                    <div className="text-xs text-gray-500">
                      {todayRecord.status === 'late' ? '⚠️ Late' : '✅ On Time'}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Not clocked in</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-orange-500" />
                <span className="font-medium text-gray-700">Clock Out</span>
              </div>
              <div className="text-right">
                {todayRecord?.clock_out ? (
                  <div className="font-bold text-orange-600">{formatTime(todayRecord.clock_out)}</div>
                ) : (
                  <span className="text-gray-400">Not clocked out</span>
                )}
              </div>
            </div>
          </div>

          {/* Face Verification Status */}
          {todayRecord && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
              {todayRecord.face_verified ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Face Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600">Face Not Verified</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            {!todayRecord?.clock_in ? (
              <button
                onClick={() => handleClockAction('in')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium flex items-center justify-center space-x-3"
              >
                <Camera className="w-5 h-5" />
                <span>Clock In with Face Verification</span>
              </button>
            ) : !todayRecord?.clock_out ? (
              <button
                onClick={() => handleClockAction('out')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center justify-center space-x-3"
              >
                <Camera className="w-5 h-5" />
                <span>Clock Out with Face Verification</span>
              </button>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Done for Today!</h3>
                <p className="text-gray-600">You have successfully completed your attendance for today.</p>
              </div>
            )}

            {/* Working Hours */}
            {todayRecord?.clock_in && todayRecord?.clock_out && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-2">Today's Working Hours</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {(() => {
                      const clockIn = new Date(todayRecord.clock_in);
                      const clockOut = new Date(todayRecord.clock_out);
                      const diff = clockOut.getTime() - clockIn.getTime();
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}m`;
                    })()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Face Verification Modal */}
      {showFaceVerification && (
        <FaceVerification
          onVerify={handleFaceVerification}
          onCancel={() => setShowFaceVerification(false)}
          employeeName={employee.name}
        />
      )}
    </>
  );
};