import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../../components/shared/Logo';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Button } from '../../components/shared/Button';
import { toast } from '../../components/shared/Toast';
import type { UserRole } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'agent']),
  licenseNumber: z.string().optional(),
  agency: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'agent') {
    return data.licenseNumber && data.agency;
  }
  return true;
}, {
  message: 'License number and agency are required for agents',
  path: ['licenseNumber'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    
    try {
      const newUser = register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role as UserRole,
        status: data.role === 'agent' ? 'pending' : 'active',
        licenseNumber: data.licenseNumber,
        agency: data.agency,
      });
      
      if (newUser.role === 'customer') {
        toast.success('Account created successfully!');
        navigate('/customer/dashboard');
      } else if (newUser.role === 'agent') {
        toast.info('Your agent application has been submitted and is pending approval');
        navigate('/agent/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join TES Real Estate today</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select
              label="Account Type"
              options={[
                { value: 'customer', label: 'Customer' },
                { value: 'agent', label: 'Agent' },
              ]}
              error={errors.role?.message}
              {...registerField('role')}
            />

            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...registerField('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...registerField('email')}
            />

            <Input
              label="Phone Number"
              placeholder="+63 917 123 4567"
              error={errors.phone?.message}
              {...registerField('phone')}
            />

            {selectedRole === 'agent' && (
              <>
                <Input
                  label="License Number"
                  placeholder="PRC-12345"
                  error={errors.licenseNumber?.message}
                  {...registerField('licenseNumber')}
                />

                <Input
                  label="Agency"
                  placeholder="Your Real Estate Agency"
                  error={errors.agency?.message}
                  {...registerField('agency')}
                />
              </>
            )}

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...registerField('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...registerField('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-gold hover:text-gold-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
