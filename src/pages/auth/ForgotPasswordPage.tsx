import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/shared/Logo';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { toast } from '../../components/shared/Toast';

export const ForgotPasswordPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Password reset functionality is not implemented in this demo');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
            />

            <Button type="submit" fullWidth>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gold hover:text-gold-600">
              Back to Sign In
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              This is a demo feature. Password reset functionality is not implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
