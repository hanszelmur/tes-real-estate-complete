import { create } from 'zustand';
import type { Property } from '../types';
import { storageService } from '../services/storage';
import { DEMO_PROPERTIES } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface PropertyState {
  properties: Property[];
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByAgent: (agentId: string) => Property[];
  getActiveProperties: () => Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  incrementViews: (id: string) => void;
  initializeProperties: () => void;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],

  initializeProperties: () => {
    const properties = storageService.getProperties();
    if (properties.length === 0) {
      storageService.setProperties(DEMO_PROPERTIES);
      set({ properties: DEMO_PROPERTIES });
    } else {
      set({ properties });
    }
  },

  getPropertyById: (id: string) => {
    return get().properties.find(p => p.id === id);
  },

  getPropertiesByAgent: (agentId: string) => {
    return get().properties.filter(p => p.agentId === agentId);
  },

  getActiveProperties: () => {
    return get().properties.filter(p => p.status === 'active');
  },

  addProperty: (propertyData) => {
    const newProperty: Property = {
      ...propertyData,
      id: generateId(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { properties } = get();
    const updatedProperties = [...properties, newProperty];
    
    storageService.setProperties(updatedProperties);
    set({ properties: updatedProperties });
    
    return newProperty;
  },

  updateProperty: (id: string, updates: Partial<Property>) => {
    const { properties } = get();
    const updatedProperties = properties.map(property =>
      property.id === id
        ? { ...property, ...updates, updatedAt: new Date().toISOString() }
        : property
    );
    
    storageService.setProperties(updatedProperties);
    set({ properties: updatedProperties });
  },

  deleteProperty: (id: string) => {
    const { properties } = get();
    const updatedProperties = properties.filter(p => p.id !== id);
    
    storageService.setProperties(updatedProperties);
    set({ properties: updatedProperties });
  },

  incrementViews: (id: string) => {
    const { properties } = get();
    const property = properties.find(p => p.id === id);
    
    if (property) {
      get().updateProperty(id, { views: property.views + 1 });
    }
  },
}));
