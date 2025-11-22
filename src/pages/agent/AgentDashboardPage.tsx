import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, Star, TrendingUp, Plus } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useReviewStore } from '../../store/reviewStore';

export const AgentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const getPropertiesByAgent = usePropertyStore(state => state.getPropertiesByAgent);
  const getAppointmentsByAgent = useAppointmentStore(state => state.getAppointmentsByAgent);
  const reviews = useReviewStore(state => state.reviews);

  if (!currentUser) return null;

  if (currentUser.status === 'pending') {
    return (
      <MainLayout>
        <div className="p-8 max-w-2xl mx-auto">
          <Card>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Application Pending</h2>
              <p className="text-gray-600">
                Your agent application is pending approval from the administrator.
                You will be notified once your application is reviewed.
              </p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (currentUser.status === 'rejected') {
    return (
      <MainLayout>
        <div className="p-8 max-w-2xl mx-auto">
          <Card>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Application Rejected</h2>
              <p className="text-gray-600">
                Unfortunately, your agent application was not approved.
                Please contact support for more information.
              </p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const properties = getPropertiesByAgent(currentUser.id);
  const appointments = getAppointmentsByAgent(currentUser.id);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const agentReviews = reviews.filter(r => 
    properties.some(p => p.id === r.propertyId)
  );
  const avgRating = agentReviews.length > 0
    ? agentReviews.reduce((sum, r) => sum + r.rating, 0) / agentReviews.length
    : 0;

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={() => navigate('/agent/properties/add')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Properties</p>
                <Building2 className="w-8 h-8 text-gold" />
              </div>
              <p className="text-3xl font-bold">{properties.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Pending</p>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold">{pendingAppointments.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Reviews</p>
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{agentReviews.length}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Avg Rating</p>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button fullWidth onClick={() => navigate('/agent/properties/add')}>
                  Add New Property
                </Button>
                <Button fullWidth variant="secondary" onClick={() => navigate('/agent/appointments')}>
                  View Appointments
                </Button>
                <Button fullWidth variant="secondary" onClick={() => navigate('/agent/properties')}>
                  Manage Properties
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
              {pendingAppointments.length === 0 ? (
                <p className="text-gray-600">No pending appointments</p>
              ) : (
                <div className="space-y-3">
                  {pendingAppointments.slice(0, 3).map(apt => {
                    const prop = properties.find(p => p.id === apt.propertyId);
                    return (
                      <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm">{prop?.title}</p>
                        <p className="text-xs text-gray-600">{apt.date} at {apt.time}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
