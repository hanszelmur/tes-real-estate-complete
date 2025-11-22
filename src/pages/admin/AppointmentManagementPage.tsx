import React, { useState } from 'react';
import { Calendar, MapPin, Search, User } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Input } from '../../components/shared/Input';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/helpers';
import type { AppointmentStatus } from '../../types';

export const AppointmentManagementPage: React.FC = () => {
  const appointments = useAppointmentStore(state => state.appointments);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const users = useAuthStore(state => state.users);
  
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredAppointments = [...appointments];
  
  if (filter !== 'all') {
    filteredAppointments = filteredAppointments.filter(a => a.status === filter);
  }

  if (searchQuery) {
    filteredAppointments = filteredAppointments.filter(a => {
      const property = getPropertyById(a.propertyId);
      const customer = users.find(u => u.id === a.customerId);
      const agent = users.find(u => u.id === a.agentId);
      return (
        property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property?.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  // Sort by date (most recent first)
  filteredAppointments.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          Appointments Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by property, customer, or agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
                filter === f
                  ? 'bg-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-16 h-16" />}
            title="No appointments found"
            description={searchQuery ? 'Try adjusting your search query' : `No ${filter} appointments available`}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map((appointment) => {
              const property = getPropertyById(appointment.propertyId);
              const customer = users.find(u => u.id === appointment.customerId);
              const agent = users.find(u => u.id === appointment.agentId);
              
              if (!property || !customer || !agent) return null;

              return (
                <Card key={appointment.id}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={property.photos[0]}
                        alt={property.title}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{property.title}</h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              {property.location}
                            </div>
                          </div>
                          <Badge status={appointment.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Customer:</strong>
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{customer.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{customer.email}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Agent:</strong>
                            </p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{agent.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{agent.email}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span><strong>Date:</strong> {formatDate(appointment.date)}</span>
                          </div>
                          <span><strong>Time:</strong> {appointment.time}</span>
                        </div>

                        {appointment.specialRequests && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Special Requests:</strong> {appointment.specialRequests}
                            </p>
                          </div>
                        )}

                        {appointment.cancellationReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-900">
                              <strong>Cancellation Reason:</strong> {appointment.cancellationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
