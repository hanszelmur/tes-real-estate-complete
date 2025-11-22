import { create } from 'zustand';
import type { MaintenanceRequest } from '../types';
import { loadMaintenanceRequests, saveMaintenanceRequests } from '../services/storage';
import { DEMO_MAINTENANCE } from '../utils/constants';

interface MaintenanceStore {
  requests: MaintenanceRequest[];
  initializeRequests: () => void;
  loadRequests: () => void;
  addRequest: (request: MaintenanceRequest) => void;
  updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  deleteRequest: (id: string) => void;
  getRequestById: (id: string) => MaintenanceRequest | undefined;
  getRequestsByCustomer: (customerId: string) => MaintenanceRequest[];
  getRequestsByAgent: (agentId: string) => MaintenanceRequest[];
  getRequestsByProperty: (propertyId: string) => MaintenanceRequest[];
}

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  requests: [],

  initializeRequests: () => {
    const requests = loadMaintenanceRequests();
    if (requests.length === 0) {
      saveMaintenanceRequests(DEMO_MAINTENANCE);
      set({ requests: DEMO_MAINTENANCE });
    } else {
      set({ requests });
    }
  },

  loadRequests: () => {
    const requests = loadMaintenanceRequests();
    set({ requests });
  },

  addRequest: (request) => {
    const requests = [...get().requests, request];
    set({ requests });
    saveMaintenanceRequests(requests);
  },

  updateRequest: (id, updates) => {
    const requests = get().requests.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    set({ requests });
    saveMaintenanceRequests(requests);
  },

  deleteRequest: (id) => {
    const requests = get().requests.filter((r) => r.id !== id);
    set({ requests });
    saveMaintenanceRequests(requests);
  },

  getRequestById: (id) => {
    return get().requests.find((r) => r.id === id);
  },

  getRequestsByCustomer: (customerId) => {
    return get().requests.filter((r) => r.customerId === customerId);
  },

  getRequestsByAgent: (agentId) => {
    return get().requests.filter((r) => r.agentId === agentId);
  },

  getRequestsByProperty: (propertyId) => {
    return get().requests.filter((r) => r.propertyId === propertyId);
  },
}));
