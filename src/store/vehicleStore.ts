import { create } from 'zustand';
import type { Vehicle } from '../types';
import { loadVehicles, saveVehicles } from '../services/storage';
import { DEMO_VEHICLES } from '../utils/constants';

interface VehicleStore {
  vehicles: Vehicle[];
  initializeVehicles: () => void;
  loadVehicles: () => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByAgent: (agentId: string) => Vehicle[];
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],

  initializeVehicles: () => {
    const vehicles = loadVehicles();
    if (vehicles.length === 0) {
      saveVehicles(DEMO_VEHICLES);
      set({ vehicles: DEMO_VEHICLES });
    } else {
      set({ vehicles });
    }
  },

  loadVehicles: () => {
    const vehicles = loadVehicles();
    set({ vehicles });
  },

  addVehicle: (vehicle) => {
    const vehicles = [...get().vehicles, vehicle];
    set({ vehicles });
    saveVehicles(vehicles);
  },

  updateVehicle: (id, updates) => {
    const vehicles = get().vehicles.map((v) =>
      v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
    );
    set({ vehicles });
    saveVehicles(vehicles);
  },

  deleteVehicle: (id) => {
    const vehicles = get().vehicles.filter((v) => v.id !== id);
    set({ vehicles });
    saveVehicles(vehicles);
  },

  getVehicleById: (id) => {
    return get().vehicles.find((v) => v.id === id);
  },

  getVehiclesByAgent: (agentId) => {
    return get().vehicles.filter((v) => v.assignedTo === agentId);
  },
}));
