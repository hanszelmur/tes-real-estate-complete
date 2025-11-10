import type { 
  User, 
  Property, 
  Appointment, 
  Review, 
  Notification, 
  Payment, 
  Contract, 
  MaintenanceRequest, 
  Inquiry, 
  Equipment, 
  Vehicle 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'tes_users',
  PROPERTIES: 'tes_properties',
  APPOINTMENTS: 'tes_appointments',
  REVIEWS: 'tes_reviews',
  NOTIFICATIONS: 'tes_notifications',
  CURRENT_USER: 'tes_current_user',
  PAYMENTS: 'tes_payments',
  CONTRACTS: 'tes_contracts',
  MAINTENANCE: 'tes_maintenance',
  INQUIRIES: 'tes_inquiries',
  EQUIPMENT: 'tes_equipment',
  VEHICLES: 'tes_vehicles',
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

// Payment functions
export const loadPayments = (): Payment[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
};

export const savePayments = (payments: Payment[]): void => {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

// Contract functions
export const loadContracts = (): Contract[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRACTS) || '[]');
};

export const saveContracts = (contracts: Contract[]): void => {
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
};

// Maintenance functions
export const loadMaintenanceRequests = (): MaintenanceRequest[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '[]');
};

export const saveMaintenanceRequests = (requests: MaintenanceRequest[]): void => {
  localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(requests));
};

// Inquiry functions
export const loadInquiries = (): Inquiry[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
};

export const saveInquiries = (inquiries: Inquiry[]): void => {
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
};

// Equipment functions
export const loadEquipment = (): Equipment[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPMENT) || '[]');
};

export const saveEquipment = (equipment: Equipment[]): void => {
  localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
};

// Vehicle functions
export const loadVehicles = (): Vehicle[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
};

export const saveVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
};
