import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Star, 
  User, 
  Users,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { Logo } from '../shared/Logo';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Customer routes
  { path: '/customer/dashboard', label: 'Browse', icon: <Building2 className="w-5 h-5" />, roles: ['customer'] },
  { path: '/customer/bookings', label: 'My Bookings', icon: <Calendar className="w-5 h-5" />, roles: ['customer'] },
  { path: '/customer/reviews', label: 'My Reviews', icon: <Star className="w-5 h-5" />, roles: ['customer'] },
  { path: '/customer/profile', label: 'Profile', icon: <User className="w-5 h-5" />, roles: ['customer'] },
  
  // Agent routes
  { path: '/agent/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['agent'] },
  { path: '/agent/properties', label: 'Properties', icon: <Building2 className="w-5 h-5" />, roles: ['agent'] },
  { path: '/agent/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" />, roles: ['agent'] },
  { path: '/agent/performance', label: 'Performance', icon: <BarChart3 className="w-5 h-5" />, roles: ['agent'] },
  { path: '/agent/profile', label: 'Profile', icon: <User className="w-5 h-5" />, roles: ['agent'] },
  
  // Admin routes
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/agents', label: 'Agent Approvals', icon: <CheckCircle className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/properties', label: 'Properties', icon: <Building2 className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/reviews', label: 'Reviews', icon: <Star className="w-5 h-5" />, roles: ['admin'] },
  { path: '/admin/menu', label: 'More', icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
];

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return null;

  const userNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {userNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gold text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
