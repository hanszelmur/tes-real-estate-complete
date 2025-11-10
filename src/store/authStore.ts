import { create } from 'zustand';
import type { User } from '../types';
import { storageService } from '../services/storage';
import { DEMO_USERS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  users: [],

  initializeAuth: () => {
    const users = storageService.getUsers();
    if (users.length === 0) {
      storageService.setUsers(DEMO_USERS);
      set({ users: DEMO_USERS });
    } else {
      set({ users });
    }
    
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      // Refresh user data from storage
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        storageService.setCurrentUser(updatedUser);
        set({ currentUser: updatedUser });
      }
    }
  },

  login: (email: string, password: string) => {
    const { users } = get();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      storageService.setCurrentUser(user);
      set({ currentUser: user });
      return user;
    }
    
    return null;
  },

  logout: () => {
    storageService.setCurrentUser(null);
    set({ currentUser: null });
  },

  register: (userData) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: userData.role === 'agent' ? 'pending' : 'active',
    };

    const { users } = get();
    const updatedUsers = [...users, newUser];
    
    storageService.setUsers(updatedUsers);
    set({ users: updatedUsers });
    
    if (newUser.status === 'active') {
      storageService.setCurrentUser(newUser);
      set({ currentUser: newUser });
    }
    
    return newUser;
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    const { users, currentUser } = get();
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    
    storageService.setUsers(updatedUsers);
    set({ users: updatedUsers });
    
    if (currentUser?.id === userId) {
      const updatedCurrentUser = { ...currentUser, ...updates };
      storageService.setCurrentUser(updatedCurrentUser);
      set({ currentUser: updatedCurrentUser });
    }
  },

  updateProfile: (updates: Partial<User>) => {
    const { currentUser } = get();
    if (currentUser) {
      get().updateUser(currentUser.id, updates);
    }
  },
}));
