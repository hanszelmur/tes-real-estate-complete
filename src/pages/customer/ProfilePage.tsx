import React from 'react';
import { useForm } from 'react-hook-form';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { Avatar } from '../../components/shared/Avatar';
import { toast } from '../../components/shared/Toast';
import { useAuthStore } from '../../store/authStore';

export const ProfilePage: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    },
  });

  const onSubmit = (data: any) => {
    updateProfile(data);
    toast.success('Profile updated successfully');
  };

  if (!currentUser) return null;

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Profile</h1>

          <Card>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar name={currentUser.name} size="xl" />
                <h2 className="text-xl font-bold mt-4">{currentUser.name}</h2>
                <p className="text-gray-600 capitalize">{currentUser.role}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Name" {...register('name')} />
                <Input label="Email" type="email" {...register('email')} />
                <Input label="Phone" {...register('phone')} />
                <Button type="submit" fullWidth>Save Changes</Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
