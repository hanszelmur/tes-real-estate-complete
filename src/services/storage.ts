import type { User, Property, Appointment, Review, Notification } from '../types';

const STORAGE_KEYS = {
  USERS: 'tes_users',
  PROPERTIES: 'tes_properties',
  APPOINTMENTS: 'tes_appointments',
  REVIEWS: 'tes_reviews',
  NOTIFICATIONS: 'tes_notifications',
  CURRENT_USER: 'tes_current_user',
};

export const storageService = {
  // Users
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  
  setUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  
  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
  
  // Properties
  getProperties(): Property[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROPERTIES) || '[]');
  },
  
  setProperties(properties: Property[]): void {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  },
  
  // Appointments
  getAppointments(): Appointment[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
  },
  
  setAppointments(appointments: Appointment[]): void {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },
  
  // Reviews
  getReviews(): Review[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  },
  
  setReviews(reviews: Review[]): void {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },
  
  // Notifications
  getNotifications(): Notification[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  },
  
  setNotifications(notifications: Notification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  
  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
