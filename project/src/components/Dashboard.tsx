import React, { useState } from 'react';
import { Clock, Calendar, FileText, LogOut, User } from 'lucide-react';
import { Employee } from '../types';
import { AttendanceSection } from './AttendanceSection';
import { LeaveSection } from './LeaveSection';
import { AttendanceHistory } from './AttendanceHistory';

interface DashboardProps {
  employee: Employee;
  onLogout: () => void;
}

type TabType = 'attendance' | 'leaves' | 'history';

export const Dashboard: React.FC<DashboardProps> = ({ employee, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('attendance');

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leaves', label: 'Leaves', icon: Calendar },
    { id: 'history', label: 'History', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-sm text-gray-600">ID: {employee.employee_id}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'attendance' && <AttendanceSection employee={employee} />}
        {activeTab === 'leaves' && <LeaveSection employeeId={employee.employee_id} />}
        {activeTab === 'history' && <AttendanceHistory employeeId={employee.employee_id} />}
      </main>
    </div>
  );
};