import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/helpers';

export const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const getAppointmentsByCustomer = useAppointmentStore(state => state.getAppointmentsByCustomer);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  if (!currentUser) return null;

  let appointments = getAppointmentsByCustomer(currentUser.id);
  
  if (filter !== 'all') {
    appointments = appointments.filter(a => a.status === filter);
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            My Bookings
          </h1>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
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

          {appointments.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-16 h-16" />}
              title="No bookings found"
              description="You haven't made any bookings yet"
              action={
                <Button onClick={() => navigate('/customer/dashboard')}>
                  Browse Properties
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {appointments.map((appointment) => {
                const property = getPropertyById(appointment.propertyId);
                if (!property) return null;

                return (
                  <Card key={appointment.id}>
                    <div className="p-6 flex flex-col md:flex-row gap-4">
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
                        <div className="text-sm text-gray-600 mb-3">
                          <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                          <p><strong>Time:</strong> {appointment.time}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/customer/bookings/${appointment.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
