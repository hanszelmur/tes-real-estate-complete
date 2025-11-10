import { create } from 'zustand';
import type { Payment } from '../types';
import { loadPayments, savePayments } from '../services/storage';
import { DEMO_PAYMENTS } from '../utils/constants';

interface PaymentStore {
  payments: Payment[];
  initializePayments: () => void;
  loadPayments: () => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByCustomer: (customerId: string) => Payment[];
  getPaymentsByAgent: (agentId: string) => Payment[];
  getPaymentsByProperty: (propertyId: string) => Payment[];
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],

  initializePayments: () => {
    const payments = loadPayments();
    if (payments.length === 0) {
      savePayments(DEMO_PAYMENTS);
      set({ payments: DEMO_PAYMENTS });
    } else {
      set({ payments });
    }
  },

  loadPayments: () => {
    const payments = loadPayments();
    set({ payments });
  },

  addPayment: (payment) => {
    const payments = [...get().payments, payment];
    set({ payments });
    savePayments(payments);
  },

  updatePayment: (id, updates) => {
    const payments = get().payments.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    set({ payments });
    savePayments(payments);
  },

  deletePayment: (id) => {
    const payments = get().payments.filter((p) => p.id !== id);
    set({ payments });
    savePayments(payments);
  },

  getPaymentById: (id) => {
    return get().payments.find((p) => p.id === id);
  },

  getPaymentsByCustomer: (customerId) => {
    return get().payments.filter((p) => p.customerId === customerId);
  },

  getPaymentsByAgent: (agentId) => {
    return get().payments.filter((p) => p.agentId === agentId);
  },

  getPaymentsByProperty: (propertyId) => {
    return get().payments.filter((p) => p.propertyId === propertyId);
  },
}));
