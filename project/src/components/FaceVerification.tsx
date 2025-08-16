import React, { useState, useEffect } from 'react';
import { Camera, Check, X, Loader } from 'lucide-react';

interface FaceVerificationProps {
  onVerify: (verified: boolean) => void;
  onCancel: () => void;
  employeeName: string;
}

export const FaceVerification: React.FC<FaceVerificationProps> = ({
  onVerify,
  onCancel,
  employeeName
}) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleComplete = () => {
    onVerify(status === 'success');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Face Verification</h3>
          <p className="text-gray-600">Please look at the camera for verification</p>
        </div>

        <div className="relative mb-6">
          <div className="w-64 h-48 bg-gray-900 rounded-lg mx-auto relative overflow-hidden">
            {/* Camera simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-teal-900 opacity-80"></div>
            
            {/* Face detection overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-32 h-40 border-2 rounded-lg transition-all duration-500 ${
                status === 'scanning' ? 'border-yellow-400 animate-pulse' :
                status === 'success' ? 'border-green-400' : 'border-red-400'
              }`}>
                <div className="w-full h-full bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Camera className={`w-8 h-8 ${
                    status === 'scanning' ? 'text-yellow-400' :
                    status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`} />
                </div>
              </div>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white opacity-60"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white opacity-60"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white opacity-60"></div>
          </div>

          {/* Status indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'scanning' ? 'bg-yellow-100' :
              status === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {status === 'scanning' && <Loader className="w-4 h-4 text-yellow-600 animate-spin" />}
              {status === 'success' && <Check className="w-4 h-4 text-green-600" />}
              {status === 'failed' && <X className="w-4 h-4 text-red-600" />}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-200 ${
                status === 'success' ? 'bg-green-500' : 
                status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {status === 'scanning' && `Verifying identity... ${progress}%`}
            {status === 'success' && `✅ Face verified for ${employeeName}`}
            {status === 'failed' && `❌ Face verification failed`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          {progress >= 100 && (
            <button
              onClick={handleComplete}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                status === 'success' 
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {status === 'success' ? 'Continue' : 'Retry'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};