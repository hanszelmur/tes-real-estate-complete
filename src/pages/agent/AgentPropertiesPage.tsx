import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { formatCurrency } from '../../utils/helpers';

export const AgentPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const getPropertiesByAgent = usePropertyStore(state => state.getPropertiesByAgent);
  const deleteProperty = usePropertyStore(state => state.deleteProperty);

  if (!currentUser) return null;

  const properties = getPropertiesByAgent(currentUser.id);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Properties</h1>
          <Button onClick={() => navigate('/agent/properties/add')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

        {properties.length === 0 ? (
          <EmptyState
            title="No properties yet"
            description="Start by adding your first property"
            action={<Button onClick={() => navigate('/agent/properties/add')}>Add Property</Button>}
          />
        ) : (
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
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => navigate(`/agent/properties/${property.id}/edit`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
