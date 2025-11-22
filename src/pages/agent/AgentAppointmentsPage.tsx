import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { toast } from '../../components/shared/Toast';
import { useAuthStore } from '../../store/authStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePropertyStore } from '../../store/propertyStore';
import { notificationService } from '../../services/notificationService';
import { formatDate } from '../../utils/helpers';

export const AgentAppointmentsPage: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const users = useAuthStore(state => state.users);
  const getAppointmentsByAgent = useAppointmentStore(state => state.getAppointmentsByAgent);
  const updateAppointment = useAppointmentStore(state => state.updateAppointment);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);

  if (!currentUser) return null;

  const appointments = getAppointmentsByAgent(currentUser.id);

  const handleConfirm = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    updateAppointment(appointmentId, { status: 'confirmed' });
    
    const property = getPropertyById(appointment.propertyId);
    if (property) {
      notificationService.notifyCustomerConfirmed(appointment.customerId, property.title, appointmentId);
    }

    toast.success('Appointment confirmed');
  };

  const handleComplete = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    updateAppointment(appointmentId, { status: 'completed' });
    
    const property = getPropertyById(appointment.propertyId);
    if (property) {
      notificationService.notifyCustomerCompleted(appointment.customerId, property.title, appointmentId);
    }

    toast.success('Appointment marked as completed');
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Appointments</h1>

        <div className="space-y-4">
          {appointments.map((appointment) => {
            const property = getPropertyById(appointment.propertyId);
            const customer = users.find(u => u.id === appointment.customerId);
            if (!property) return null;

            return (
              <Card key={appointment.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <p className="text-gray-600">Customer: {customer?.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(appointment.date)} at {appointment.time}</p>
                    </div>
                    <Badge status={appointment.status} />
                  </div>

                  {appointment.specialRequests && (
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Requests:</strong> {appointment.specialRequests}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                      <Button size="sm" onClick={() => handleConfirm(appointment.id)}>
                        Confirm
                      </Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button size="sm" onClick={() => handleComplete(appointment.id)}>
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};
