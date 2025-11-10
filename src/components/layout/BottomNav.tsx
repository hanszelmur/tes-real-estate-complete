import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Star, 
  User, 
  CheckCircle,
  Settings
} from 'lucide-react';
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
  { path: '/customer/dashboard', label: 'Browse', icon: <Building2 className="w-6 h-6" />, roles: ['customer'] },
  { path: '/customer/bookings', label: 'Bookings', icon: <Calendar className="w-6 h-6" />, roles: ['customer'] },
  { path: '/customer/reviews', label: 'Reviews', icon: <Star className="w-6 h-6" />, roles: ['customer'] },
  { path: '/customer/profile', label: 'Profile', icon: <User className="w-6 h-6" />, roles: ['customer'] },
  
  // Agent routes
  { path: '/agent/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" />, roles: ['agent'] },
  { path: '/agent/properties', label: 'Properties', icon: <Building2 className="w-6 h-6" />, roles: ['agent'] },
  { path: '/agent/appointments', label: 'Bookings', icon: <Calendar className="w-6 h-6" />, roles: ['agent'] },
  { path: '/agent/profile', label: 'Profile', icon: <User className="w-6 h-6" />, roles: ['agent'] },
  
  // Admin routes (showing only 4 most important)
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" />, roles: ['admin'] },
  { path: '/admin/agents', label: 'Agents', icon: <CheckCircle className="w-6 h-6" />, roles: ['admin'] },
  { path: '/admin/properties', label: 'Properties', icon: <Building2 className="w-6 h-6" />, roles: ['admin'] },
  { path: '/admin/menu', label: 'More', icon: <Settings className="w-6 h-6" />, roles: ['admin'] },
];

export const BottomNav: React.FC = () => {
  const { currentUser } = useAuthStore();

  if (!currentUser) return null;

  const userNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <nav className="flex items-center justify-around h-16">
        {userNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] ${
                isActive
                  ? 'text-gold'
                  : 'text-gray-500'
              }`
            }
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
