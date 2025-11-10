export type UserRole = 'customer' | 'agent' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected';
export type PropertyType = 'House' | 'Condo' | 'Apartment' | 'Lot';
export type PropertyStatus = 'pending' | 'active' | 'sold' | 'rejected';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type ReviewFilterType = 'all' | 'published' | 'pending';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card';
export type ContractStatus = 'active' | 'expired' | 'terminated';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'other';
export type InquiryCategory = 'general' | 'property' | 'booking' | 'payment' | 'technical' | 'complaint';
export type InquiryPriority = 'low' | 'medium' | 'high';
export type InquiryStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type EquipmentType = 'laptop' | 'phone' | 'tablet' | 'camera' | 'vehicle' | 'other';
export type EquipmentStatus = 'available' | 'assigned' | 'maintenance' | 'retired';
export type VehicleType = 'sedan' | 'suv' | 'van' | 'truck';
export type VehicleStatus = 'available' | 'assigned' | 'maintenance' | 'retired';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';
export type Condition = 'excellent' | 'good' | 'fair' | 'poor';

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

export interface Payment {
  id: string;
  appointmentId: string;
  customerId: string;
  propertyId: string;
  agentId: string;
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
  dueDate: string;
  receiptNumber: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  appointmentId: string;
  customerId: string;
  propertyId: string;
  agentId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  terms: string;
  status: ContractStatus;
  signedDate?: string;
  documentUrl?: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  category: MaintenanceCategory;
  estimatedCost?: number;
  actualCost?: number;
  contractorName?: string;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  userId: string;
  userRole: UserRole;
  message: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  ticketNumber: string;
  customerId: string;
  propertyId?: string;
  agentId?: string;
  subject: string;
  description: string;
  category: InquiryCategory;
  priority: InquiryPriority;
  status: InquiryStatus;
  assignedTo?: string;
  responses: InquiryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo?: string;
  assignedDate?: string;
  purchaseDate: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  condition: Condition;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  assignedTo?: string;
  assignedDate?: string;
  mileage: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
  fuelType: FuelType;
  condition: Condition;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
