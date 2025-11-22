import React from 'react';
import { Users, Building2, Calendar, CheckCircle } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAppointmentStore } from '../../store/appointmentStore';

export const AdminDashboardPage: React.FC = () => {
  const users = useAuthStore(state => state.users);
  const properties = usePropertyStore(state => state.properties);
  const appointments = useAppointmentStore(state => state.appointments);

  const pendingAgents = users.filter(u => u.role === 'agent' && u.status === 'pending');
  const pendingProperties = properties.filter(p => p.status === 'pending');
  const activeAgents = users.filter(u => u.role === 'agent' && u.status === 'active');

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Total Users</p>
                <Users className="w-8 h-8 text-gold" />
              </div>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Properties</p>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{properties.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Appointments</p>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{appointments.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Active Agents</p>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{activeAgents.length}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Pending Agents</span>
                  <span className="text-lg font-bold text-yellow-600">{pendingAgents.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Pending Properties</span>
                  <span className="text-lg font-bold text-yellow-600">{pendingProperties.length}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">System Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customers</span>
                  <span className="font-semibold">{users.filter(u => u.role === 'customer').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agents</span>
                  <span className="font-semibold">{users.filter(u => u.role === 'agent').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Properties</span>
                  <span className="font-semibold">{properties.filter(p => p.status === 'active').length}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
