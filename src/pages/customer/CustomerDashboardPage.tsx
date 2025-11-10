import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Home as HomeIcon } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { EmptyState } from '../../components/shared/EmptyState';
import { usePropertyStore } from '../../store/propertyStore';
import { formatCurrency } from '../../utils/helpers';
import { PROPERTY_TYPES, LOCATIONS } from '../../utils/constants';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const getActiveProperties = usePropertyStore(state => state.getActiveProperties);
  const [properties, setProperties] = useState(getActiveProperties());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    let filtered = getActiveProperties();

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(p => p.location === locationFilter);
    }

    setProperties(filtered);
  }, [searchQuery, typeFilter, locationFilter]);

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Browse Properties
          </h1>
          <p className="text-gray-600">Find your dream property</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            options={[
              { value: '', label: 'All Types' },
              ...PROPERTY_TYPES.map(type => ({ value: type, label: type })),
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />

          <Select
            options={[
              { value: '', label: 'All Locations' },
              ...LOCATIONS.map(loc => ({ value: loc, label: loc })),
            ]}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        {properties.length === 0 ? (
          <EmptyState
            icon={<HomeIcon className="w-16 h-16" />}
            title="No properties found"
            description="Try adjusting your filters or search query"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                onClick={() => navigate(`/customer/properties/${property.id}`)}
              >
                <div className="relative h-48">
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge status={property.status} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-2xl font-bold text-gold mb-2">
                    {formatCurrency(property.price)}
                  </p>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms} BR</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} BA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{property.area} sqm</span>
                    </div>
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
