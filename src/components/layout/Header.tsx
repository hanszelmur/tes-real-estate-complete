import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Logo } from '../shared/Logo';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount);

  if (!currentUser) return null;

  const unreadCount = getUnreadCount(currentUser.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <Logo size="sm" />
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-gray-900 lg:hidden">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
