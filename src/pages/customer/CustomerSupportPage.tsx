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
import { useInquiryStore } from '../../store/inquiryStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { HelpCircle, Plus, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Inquiry } from '../../types';

export const CustomerSupportPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { inquiries, initializeInquiries, addInquiry } = useInquiryStore();
  const { createNotification } = useNotificationStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    subject: string;
    description: string;
    category: Inquiry['category'];
    priority: Inquiry['priority'];
  }>({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  useEffect(() => {
    initializeInquiries();
  }, [initializeInquiries]);

  const customerInquiries = currentUser
    ? inquiries.filter(i => i.customerId === currentUser.id)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const ticketNumber = `TKT-2025-${String(Date.now()).slice(-6)}`;
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      ticketNumber,
      customerId: currentUser.id,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addInquiry(newInquiry);
    createNotification({
      userId: currentUser.id,
      type: 'success',
      title: 'Support Ticket Created',
      message: `Your ticket ${ticketNumber} has been created successfully.`,
      link: '/customer/support',
    });

    setShowModal(false);
    setFormData({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support & Inquiries</h1>
            <p className="text-gray-600 mt-1">Get help with your questions and concerns</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
            <Card key={status}>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {customerInquiries.filter(i => i.status === status).length}
                </p>
                <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Inquiries List */}
        {customerInquiries.length === 0 ? (
          <EmptyState
            icon={<HelpCircle className="w-12 h-12" />}
            title="No support tickets"
            description="You haven't created any support tickets yet."
            action={
              <Button onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {customerInquiries.map((inquiry) => (
              <Card key={inquiry.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{inquiry.subject}</h3>
                      <p className="text-sm text-gray-600">Ticket: {inquiry.ticketNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge status={inquiry.status} />
                      <Badge status={inquiry.priority} />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{inquiry.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900 capitalize">{inquiry.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Responses</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {inquiry.responses.length}
                      </p>
                    </div>
                  </div>

                  {inquiry.responses.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Latest Response:</p>
                      <p className="text-sm text-gray-700">
                        {inquiry.responses[inquiry.responses.length - 1].message}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* New Ticket Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Support Ticket"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information..."
              rows={5}
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Inquiry['category'] })}
              options={[
                { value: 'general', label: 'General Inquiry' },
                { value: 'property', label: 'Property Related' },
                { value: 'booking', label: 'Booking Issue' },
                { value: 'payment', label: 'Payment Issue' },
                { value: 'technical', label: 'Technical Support' },
                { value: 'complaint', label: 'Complaint' },
              ]}
              required
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Inquiry['priority'] })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              required
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};
