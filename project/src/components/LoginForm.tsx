import React, { useState } from 'react';
import { LogIn, Phone, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (employeeId: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [step, setStep] = useState<'employeeId' | 'otp'>('employeeId');
  const [employeeId, setEmployeeId] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleEmployeeIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId.trim()) {
      setStep('otp');
      setError('');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onLogin(employeeId, otp);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Login</h1>
            <p className="text-gray-600">Access your attendance dashboard</p>
          </div>

          {step === 'employeeId' ? (
            <form onSubmit={handleEmployeeIdSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your employee ID"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 font-medium"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Verification
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to your registered phone number
                </p>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-wider"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Demo: Use 123456 as OTP
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('employeeId')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Login'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};