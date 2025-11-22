import { create } from 'zustand';
import type { Inquiry } from '../types';
import { loadInquiries, saveInquiries } from '../services/storage';
import { DEMO_INQUIRIES } from '../utils/constants';

interface InquiryStore {
  inquiries: Inquiry[];
  initializeInquiries: () => void;
  loadInquiries: () => void;
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiry: (id: string, updates: Partial<Inquiry>) => void;
  deleteInquiry: (id: string) => void;
  getInquiryById: (id: string) => Inquiry | undefined;
  getInquiriesByCustomer: (customerId: string) => Inquiry[];
  getInquiriesByAgent: (agentId: string) => Inquiry[];
}

export const useInquiryStore = create<InquiryStore>((set, get) => ({
  inquiries: [],

  initializeInquiries: () => {
    const inquiries = loadInquiries();
    if (inquiries.length === 0) {
      saveInquiries(DEMO_INQUIRIES);
      set({ inquiries: DEMO_INQUIRIES });
    } else {
      set({ inquiries });
    }
  },

  loadInquiries: () => {
    const inquiries = loadInquiries();
    set({ inquiries });
  },

  addInquiry: (inquiry) => {
    const inquiries = [...get().inquiries, inquiry];
    set({ inquiries });
    saveInquiries(inquiries);
  },

  updateInquiry: (id, updates) => {
    const inquiries = get().inquiries.map((i) =>
      i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
    );
    set({ inquiries });
    saveInquiries(inquiries);
  },

  deleteInquiry: (id) => {
    const inquiries = get().inquiries.filter((i) => i.id !== id);
    set({ inquiries });
    saveInquiries(inquiries);
  },

  getInquiryById: (id) => {
    return get().inquiries.find((i) => i.id === id);
  },

  getInquiriesByCustomer: (customerId) => {
    return get().inquiries.filter((i) => i.customerId === customerId);
  },

  getInquiriesByAgent: (agentId) => {
    return get().inquiries.filter((i) => i.agentId === agentId);
  },
}));
