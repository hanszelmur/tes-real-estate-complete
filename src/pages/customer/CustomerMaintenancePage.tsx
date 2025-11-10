import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Textarea } from '../../components/shared/Textarea';
import { Select } from '../../components/shared/Select';
import { Modal } from '../../components/shared/Modal';
import { EmptyState } from '../../components/shared/EmptyState';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Wrench, Plus } from 'lucide-react';
import { format } from 'date-fns';
import type { MaintenanceRequest } from '../../types';

export const CustomerMaintenancePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { requests, initializeRequests, addRequest } = useMaintenanceStore();
  const { properties, initializeProperties } = usePropertyStore();
  const { createNotification } = useNotificationStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'other' as const,
  });

  useEffect(() => {
    initializeRequests();
    initializeProperties();
  }, [initializeRequests, initializeProperties]);

  const customerRequests = currentUser
    ? requests.filter(r => r.customerId === currentUser.id)
    : [];

  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const getStatusBadge = (status: string) => {
    return <Badge status={status} />;
  };

  const getPriorityBadge = (priority: string) => {
    return <Badge status={priority} />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const property = properties.find(p => p.id === formData.propertyId);
    if (!property) return;

    const newRequest: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      propertyId: formData.propertyId,
      customerId: currentUser.id,
      agentId: property.agentId,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'pending',
      category: formData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addRequest(newRequest);
    createNotification({
      userId: currentUser.id,
      type: 'success',
      title: 'Maintenance Request Submitted',
      message: `Your request for "${formData.title}" has been submitted successfully.`,
      link: '/customer/maintenance',
    });

    setShowModal(false);
    setFormData({
      propertyId: '',
      title: '',
      description: '',
      priority: 'medium',
      category: 'other',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">Submit and track maintenance requests</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <Card key={status}>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {customerRequests.filter(r => r.status === status).length}
                </p>
                <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Requests List */}
        {customerRequests.length === 0 ? (
          <EmptyState
            icon={<Wrench className="w-12 h-12" />}
            title="No maintenance requests"
            description="You haven't submitted any maintenance requests yet."
            action={
              <Button onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {customerRequests.map((request) => {
              const property = getProperty(request.propertyId);
              return (
                <Card key={request.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                        <p className="text-sm text-gray-600">{property?.title}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">{request.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900 capitalize">{request.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {request.scheduledDate && (
                        <div>
                          <p className="text-gray-600">Scheduled</p>
                          <p className="font-semibold text-gray-900">
                            {format(new Date(request.scheduledDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {request.completedDate && (
                        <div>
                          <p className="text-gray-600">Completed</p>
                          <p className="font-semibold text-gray-900">
                            {format(new Date(request.completedDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* New Request Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Submit Maintenance Request"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Property"
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              options={[
                { value: '', label: 'Select a property' },
                ...properties.filter(p => p.status === 'active').map((property) => ({
                  value: property.id,
                  label: property.title,
                })),
              ]}
              required
            />

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Leaking faucet in kitchen"
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about the issue..."
              rows={4}
              required
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'structural', label: 'Structural' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};
