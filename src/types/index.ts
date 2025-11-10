export type UserRole = 'customer' | 'agent' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected';
export type PropertyType = 'House' | 'Condo' | 'Apartment' | 'Lot';
export type PropertyStatus = 'pending' | 'active' | 'sold' | 'rejected';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type ReviewFilterType = 'all' | 'published' | 'pending';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  licenseNumber?: string;
  agency?: string;
  createdAt: string;
}

export interface Property {
  id: string;
  agentId: string;
  title: string;
  type: PropertyType;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  photos: string[];
  status: PropertyStatus;
  rejectionReason?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  customerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  flagged: boolean;
  flagReason?: string;
  adminEdited: boolean;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
