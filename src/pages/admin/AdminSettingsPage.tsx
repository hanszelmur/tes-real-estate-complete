import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe,
  Clock,
  DollarSign
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const settingsCategories = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'General Settings',
      description: 'Configure basic system settings and preferences',
      items: ['System Name', 'Logo', 'Contact Information', 'Business Hours'],
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Notifications',
      description: 'Manage notification preferences and templates',
      items: ['Email Notifications', 'SMS Alerts', 'Push Notifications', 'Notification Templates'],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security',
      description: 'Security and access control settings',
      items: ['Password Policy', 'Two-Factor Authentication', 'Session Timeout', 'IP Whitelist'],
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Payment Settings',
      description: 'Configure payment methods and billing',
      items: ['Payment Gateways', 'Currency Settings', 'Tax Configuration', 'Invoice Templates'],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Configuration',
      description: 'SMTP and email delivery settings',
      items: ['SMTP Server', 'Email Templates', 'Sender Address', 'Email Logs'],
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Website Settings',
      description: 'Public website configuration',
      items: ['Homepage Banner', 'Featured Properties', 'SEO Settings', 'Social Media Links'],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Booking Rules',
      description: 'Configure booking and appointment rules',
      items: ['Booking Windows', 'Cancellation Policy', 'Advance Notice', 'Time Slots'],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Data Management',
      description: 'Backup, export, and data retention settings',
      items: ['Auto Backup', 'Data Export', 'Data Retention', 'Archive Settings'],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {settingsCategories.map((category, index) => (
            <Card key={index}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 rounded-lg text-gold">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">
                  Configure
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Message */}
        <Card>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Settings Management</p>
              <p>
                System settings allow you to customize the behavior and appearance of your TES Real Estate platform. 
                Changes made here will affect all users and should be configured carefully.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
