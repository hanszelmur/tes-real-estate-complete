import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { Modal } from '../../components/shared/Modal';
import { toast } from '../../components/shared/Toast';
import { usePropertyStore } from '../../store/propertyStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { notificationService } from '../../services/notificationService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { TIME_SLOTS } from '../../utils/constants';

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get('propertyId');

  const getActiveProperties = usePropertyStore(state => state.getActiveProperties);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const createAppointment = useAppointmentStore(state => state.createAppointment);
  const currentUser = useAuthStore(state => state.currentUser);
  const users = useAuthStore(state => state.users);

  const [step, setStep] = useState(propertyIdParam ? 2 : 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyIdParam || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const properties = getActiveProperties();
  const selectedProperty = selectedPropertyId ? getPropertyById(selectedPropertyId) : null;

  const handleNext = () => {
    if (step === 1 && !selectedPropertyId) {
      toast.error('Please select a property');
      return;
    }
    if (step === 2 && !selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (step === 3 && !selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedProperty || !currentUser) return;

    const appointment = createAppointment({
      propertyId: selectedProperty.id,
      customerId: currentUser.id,
      agentId: selectedProperty.agentId,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      specialRequests: specialRequests || undefined,
    });

    setBookingId(appointment.id);

    // Notify agent
    const agent = users.find(u => u.id === selectedProperty.agentId);
    if (agent) {
      notificationService.notifyAgentNewBooking(
        agent.id,
        currentUser.name,
        selectedProperty.title,
        appointment.id
      );
    }

    toast.success('Appointment booked successfully!');
    setShowSuccess(true);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            Book an Appointment
          </h1>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step
                        ? 'bg-gold text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        s < step ? 'bg-gold' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs lg:text-sm font-medium">Property</span>
              <span className="text-xs lg:text-sm font-medium">Date</span>
              <span className="text-xs lg:text-sm font-medium">Time</span>
              <span className="text-xs lg:text-sm font-medium">Confirm</span>
            </div>
          </div>

          <Card>
            <div className="p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Select Property</h2>
                  <Select
                    label="Property"
                    options={[
                      { value: '', label: 'Select a property' },
                      ...properties.map(p => ({
                        value: p.id,
                        label: `${p.title} - ${formatCurrency(p.price)}`,
                      })),
                    ]}
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                  />
                </div>
              )}

              {step === 2 && selectedProperty && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Select Date</h2>
                  <p className="text-gray-600 mb-4">
                    Viewing appointment for: <strong>{selectedProperty.title}</strong>
                  </p>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Select Time</h2>
                  <p className="text-gray-600 mb-4">
                    Date: <strong>{formatDate(selectedDate)}</strong>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          selectedTime === time
                            ? 'border-gold bg-gold-50 text-gold-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && selectedProperty && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Property</p>
                    <p className="font-semibold mb-3">{selectedProperty.title}</p>
                    
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="font-semibold mb-3">
                      {formatDate(selectedDate)} at {selectedTime}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold">{selectedProperty.location}</p>
                  </div>

                  <Textarea
                    label="Special Requests (Optional)"
                    placeholder="Any specific requirements or questions..."
                    rows={4}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {step > 1 && !propertyIdParam && (
                  <Button variant="secondary" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button onClick={handleNext} fullWidth={step === 1 || !!propertyIdParam}>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} fullWidth>
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate(`/customer/bookings/${bookingId}`);
        }}
        title="Booking Confirmed!"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-lg mb-2">Your appointment has been booked successfully!</p>
          <p className="text-gray-600 mb-4">
            The agent will review and confirm your appointment soon.
          </p>
          <Button onClick={() => navigate(`/customer/bookings/${bookingId}`)}>
            View Booking
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
};
