import { create } from 'zustand';
import type { Contract } from '../types';
import { loadContracts, saveContracts } from '../services/storage';
import { DEMO_CONTRACTS } from '../utils/constants';

interface ContractStore {
  contracts: Contract[];
  initializeContracts: () => void;
  loadContracts: () => void;
  addContract: (contract: Contract) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  getContractById: (id: string) => Contract | undefined;
  getContractsByCustomer: (customerId: string) => Contract[];
  getContractsByAgent: (agentId: string) => Contract[];
  getContractsByProperty: (propertyId: string) => Contract[];
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],

  initializeContracts: () => {
    const contracts = loadContracts();
    if (contracts.length === 0) {
      saveContracts(DEMO_CONTRACTS);
      set({ contracts: DEMO_CONTRACTS });
    } else {
      set({ contracts });
    }
  },

  loadContracts: () => {
    const contracts = loadContracts();
    set({ contracts });
  },

  addContract: (contract) => {
    const contracts = [...get().contracts, contract];
    set({ contracts });
    saveContracts(contracts);
  },

  updateContract: (id, updates) => {
    const contracts = get().contracts.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ contracts });
    saveContracts(contracts);
  },

  deleteContract: (id) => {
    const contracts = get().contracts.filter((c) => c.id !== id);
    set({ contracts });
    saveContracts(contracts);
  },

  getContractById: (id) => {
    return get().contracts.find((c) => c.id === id);
  },

  getContractsByCustomer: (customerId) => {
    return get().contracts.filter((c) => c.customerId === customerId);
  },

  getContractsByAgent: (agentId) => {
    return get().contracts.filter((c) => c.agentId === agentId);
  },

  getContractsByProperty: (propertyId) => {
    return get().contracts.filter((c) => c.propertyId === propertyId);
  },
}));
