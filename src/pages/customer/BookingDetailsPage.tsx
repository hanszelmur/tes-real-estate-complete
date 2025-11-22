import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Textarea } from '../../components/shared/Textarea';
import { Avatar } from '../../components/shared/Avatar';
import { toast } from '../../components/shared/Toast';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/helpers';
import { notificationService } from '../../services/notificationService';

export const BookingDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getAppointmentById = useAppointmentStore(state => state.getAppointmentById);
  const cancelAppointment = useAppointmentStore(state => state.cancelAppointment);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const users = useAuthStore(state => state.users);
  const currentUser = useAuthStore(state => state.currentUser);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const appointment = getAppointmentById(id!);
  const property = appointment ? getPropertyById(appointment.propertyId) : null;
  const agent = appointment ? users.find(u => u.id === appointment.agentId) : null;

  if (!appointment || !property || !currentUser) {
    return <MainLayout><div className="p-8">Booking not found</div></MainLayout>;
  }

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    cancelAppointment(appointment.id, cancelReason);
    
    if (agent) {
      notificationService.notifyAppointmentCancelled(
        agent.id,
        property.title,
        cancelReason,
        appointment.id
      );
    }

    toast.success('Booking cancelled successfully');
    setShowCancelModal(false);
    navigate('/customer/bookings');
  };

  const canCancel = appointment.status === 'pending';
  const canReview = appointment.status === 'completed';

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Bookings</span>
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            Booking Details
          </h1>

          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Appointment Information</h2>
                  <Badge status={appointment.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                      <p className="font-semibold">{formatDate(appointment.date)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <p className="font-semibold">{appointment.time}</p>
                    </div>
                  </div>
                </div>

                {appointment.specialRequests && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                    <p className="text-gray-700">{appointment.specialRequests}</p>
                  </div>
                )}

                {appointment.cancellationReason && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Cancellation Reason</p>
                    <p className="text-gray-700">{appointment.cancellationReason}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Property Details</h2>
                <div className="flex gap-4">
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/customer/properties/${property.id}`)}
                    >
                      View Property
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Agent Information</h2>
                <div className="flex items-center gap-3">
                  <Avatar name={agent?.name || 'Agent'} size="lg" />
                  <div>
                    <p className="font-semibold">{agent?.name}</p>
                    <p className="text-sm text-gray-600">{agent?.agency}</p>
                    <p className="text-sm text-gray-600">{agent?.phone}</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              {canCancel && (
                <Button
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Booking
                </Button>
              )}
              {canReview && (
                <Button
                  onClick={() => navigate(`/customer/reviews/new?appointmentId=${appointment.id}`)}
                >
                  Leave Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              Keep Booking
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Cancel Booking
            </Button>
          </>
        }
      >
        <Textarea
          label="Reason for cancellation"
          placeholder="Please provide a reason..."
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>
    </MainLayout>
  );
};
