import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { toast } from '../../components/shared/Toast';
import { usePropertyStore } from '../../store/propertyStore';
import { notificationService } from '../../services/notificationService';
import { formatCurrency } from '../../utils/helpers';

export const AdminPropertiesPage: React.FC = () => {
  const properties = usePropertyStore(state => state.properties);
  const updateProperty = usePropertyStore(state => state.updateProperty);

  const handleApprove = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    updateProperty(propertyId, { status: 'active' });
    notificationService.notifyAgentPropertyApproved(property.agentId, property.title);
    toast.success('Property approved successfully');
  };

  const handleReject = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    updateProperty(propertyId, { status: 'rejected', rejectionReason: reason });
    notificationService.notifyAgentPropertyRejected(property.agentId, property.title, reason);
    toast.success('Property rejected');
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Property Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <div className="relative h-48">
                <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge status={property.status} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                <p className="text-2xl font-bold text-gold mb-3">{formatCurrency(property.price)}</p>
                {property.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(property.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(property.id)}>Reject</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
