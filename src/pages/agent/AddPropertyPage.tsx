import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { Button } from '../../components/shared/Button';
import { toast } from '../../components/shared/Toast';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { PROPERTY_TYPES } from '../../utils/constants';

export const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.currentUser);
  const addProperty = usePropertyStore(state => state.addProperty);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    if (!currentUser) return;

    addProperty({
      agentId: currentUser.id,
      title: data.title,
      type: data.type,
      price: parseFloat(data.price),
      location: data.location,
      bedrooms: parseInt(data.bedrooms),
      bathrooms: parseInt(data.bathrooms),
      area: parseFloat(data.area),
      description: data.description,
      photos: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      status: 'pending',
    });

    toast.success('Property submitted for approval');
    navigate('/agent/properties');
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/agent/properties')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Add New Property</h1>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input label="Title" {...register('title')} required />
              <Select
                label="Type"
                options={PROPERTY_TYPES.map(t => ({ value: t, label: t }))}
                {...register('type')}
                required
              />
              <Input label="Price (₱)" type="number" {...register('price')} required />
              <Input label="Location" {...register('location')} required />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Bedrooms" type="number" {...register('bedrooms')} required />
                <Input label="Bathrooms" type="number" {...register('bathrooms')} required />
                <Input label="Area (sqm)" type="number" {...register('area')} required />
              </div>
              <Textarea label="Description" rows={5} {...register('description')} required />
              <Button type="submit" fullWidth>Submit Property</Button>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
