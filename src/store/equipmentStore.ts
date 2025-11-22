import { create } from 'zustand';
import type { Equipment } from '../types';
import { loadEquipment, saveEquipment } from '../services/storage';
import { DEMO_EQUIPMENT } from '../utils/constants';

interface EquipmentStore {
  equipment: Equipment[];
  initializeEquipment: () => void;
  loadEquipment: () => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getEquipmentByAgent: (agentId: string) => Equipment[];
}

export const useEquipmentStore = create<EquipmentStore>((set, get) => ({
  equipment: [],

  initializeEquipment: () => {
    const equipment = loadEquipment();
    if (equipment.length === 0) {
      saveEquipment(DEMO_EQUIPMENT);
      set({ equipment: DEMO_EQUIPMENT });
    } else {
      set({ equipment });
    }
  },

  loadEquipment: () => {
    const equipment = loadEquipment();
    set({ equipment });
  },

  addEquipment: (equipment) => {
    const equipmentList = [...get().equipment, equipment];
    set({ equipment: equipmentList });
    saveEquipment(equipmentList);
  },

  updateEquipment: (id, updates) => {
    const equipment = get().equipment.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    set({ equipment });
    saveEquipment(equipment);
  },

  deleteEquipment: (id) => {
    const equipment = get().equipment.filter((e) => e.id !== id);
    set({ equipment });
    saveEquipment(equipment);
  },

  getEquipmentById: (id) => {
    return get().equipment.find((e) => e.id === id);
  },

  getEquipmentByAgent: (agentId) => {
    return get().equipment.filter((e) => e.assignedTo === agentId);
  },
}));
