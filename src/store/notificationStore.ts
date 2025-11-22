import { create } from 'zustand';
import type { Notification } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils/helpers';

interface NotificationState {
  notifications: Notification[];
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  initializeNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  initializeNotifications: () => {
    const notifications = storageService.getNotifications();
    set({ notifications });
  },

  getNotificationsByUser: (userId: string) => {
    return get().notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: (userId: string) => {
    return get().notifications.filter(n => n.userId === userId && !n.read).length;
  },

  createNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    const { notifications } = get();
    const updatedNotifications = [...notifications, newNotification];
    
    storageService.setNotifications(updatedNotifications);
    set({ notifications: updatedNotifications });
    
    return newNotification;
  },

  markAsRead: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    storageService.setNotifications(updatedNotifications);
    set({ notifications: updatedNotifications });
  },

  markAllAsRead: (userId: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification =>
      notification.userId === userId ? { ...notification, read: true } : notification
    );
    
    storageService.setNotifications(updatedNotifications);
    set({ notifications: updatedNotifications });
  },

  deleteNotification: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    storageService.setNotifications(updatedNotifications);
    set({ notifications: updatedNotifications });
  },
}));
