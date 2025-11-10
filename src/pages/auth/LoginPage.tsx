import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../../components/shared/Logo';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { toast } from '../../components/shared/Toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const user = login(data.email, data.password);
      
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        
        // Redirect based on role
        switch (user.role) {
          case 'customer':
            navigate('/customer/dashboard');
            break;
          case 'agent':
            if (user.status === 'pending') {
              toast.warning('Your agent application is pending approval');
            } else if (user.status === 'rejected') {
              toast.error('Your agent application has been rejected');
            }
            navigate('/agent/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
        }
      } else {
        toast.error('Invalid email or password');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-gold hover:text-gold-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 text-center">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>hans@tesrealestate.com / customer123</span>
              </div>
              <div className="flex justify-between">
                <span>Agent:</span>
                <span>juan@tesrealestate.com / agent123</span>
              </div>
              <div className="flex justify-between">
                <span>Admin:</span>
                <span>admin@tesrealestate.com / admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
