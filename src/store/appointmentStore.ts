import { create } from 'zustand';
import type { Appointment } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils/helpers';

interface AppointmentState {
  appointments: Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
  getAppointmentsByCustomer: (customerId: string) => Appointment[];
  getAppointmentsByAgent: (agentId: string) => Appointment[];
  getAppointmentsByProperty: (propertyId: string) => Appointment[];
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string, reason: string) => void;
  cancelAppointmentsByProperty: (propertyId: string) => void;
  initializeAppointments: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],

  initializeAppointments: () => {
    const appointments = storageService.getAppointments();
    set({ appointments });
  },

  getAppointmentById: (id: string) => {
    return get().appointments.find(a => a.id === id);
  },

  getAppointmentsByCustomer: (customerId: string) => {
    return get().appointments.filter(a => a.customerId === customerId);
  },

  getAppointmentsByAgent: (agentId: string) => {
    return get().appointments.filter(a => a.agentId === agentId);
  },

  getAppointmentsByProperty: (propertyId: string) => {
    return get().appointments.filter(a => a.propertyId === propertyId);
  },

  createAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { appointments } = get();
    const updatedAppointments = [...appointments, newAppointment];
    
    storageService.setAppointments(updatedAppointments);
    set({ appointments: updatedAppointments });
    
    return newAppointment;
  },

  updateAppointment: (id: string, updates: Partial<Appointment>) => {
    const { appointments } = get();
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
        : appointment
    );
    
    storageService.setAppointments(updatedAppointments);
    set({ appointments: updatedAppointments });
  },

  cancelAppointment: (id: string, reason: string) => {
    get().updateAppointment(id, {
      status: 'cancelled',
      cancellationReason: reason,
    });
  },

  cancelAppointmentsByProperty: (propertyId: string) => {
    const { appointments } = get();
    const updatedAppointments = appointments.map(appointment =>
      appointment.propertyId === propertyId && appointment.status !== 'cancelled' && appointment.status !== 'completed'
        ? { ...appointment, status: 'cancelled' as const, cancellationReason: 'Property no longer available', updatedAt: new Date().toISOString() }
        : appointment
    );
    
    storageService.setAppointments(updatedAppointments);
    set({ appointments: updatedAppointments });
  },
}));
