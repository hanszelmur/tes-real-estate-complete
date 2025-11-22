import { create } from 'zustand';
import type { Review } from '../types';
import { storageService } from '../services/storage';
import { generateId } from '../utils/helpers';

interface ReviewState {
  reviews: Review[];
  getReviewById: (id: string) => Review | undefined;
  getReviewsByProperty: (propertyId: string) => Review[];
  getReviewsByCustomer: (customerId: string) => Review[];
  getReviewByAppointment: (appointmentId: string) => Review | undefined;
  createReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'flagged' | 'adminEdited'>) => Review;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  flagReview: (id: string, reason: string) => void;
  initializeReviews: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],

  initializeReviews: () => {
    const reviews = storageService.getReviews();
    set({ reviews });
  },

  getReviewById: (id: string) => {
    return get().reviews.find(r => r.id === id);
  },

  getReviewsByProperty: (propertyId: string) => {
    return get().reviews.filter(r => r.propertyId === propertyId);
  },

  getReviewsByCustomer: (customerId: string) => {
    return get().reviews.filter(r => r.customerId === customerId);
  },

  getReviewByAppointment: (appointmentId: string) => {
    return get().reviews.find(r => r.appointmentId === appointmentId);
  },

  createReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: generateId(),
      flagged: false,
      adminEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { reviews } = get();
    const updatedReviews = [...reviews, newReview];
    
    storageService.setReviews(updatedReviews);
    set({ reviews: updatedReviews });
    
    return newReview;
  },

  updateReview: (id: string, updates: Partial<Review>) => {
    const { reviews } = get();
    const updatedReviews = reviews.map(review =>
      review.id === id
        ? { ...review, ...updates, updatedAt: new Date().toISOString() }
        : review
    );
    
    storageService.setReviews(updatedReviews);
    set({ reviews: updatedReviews });
  },

  deleteReview: (id: string) => {
    const { reviews } = get();
    const updatedReviews = reviews.filter(r => r.id !== id);
    
    storageService.setReviews(updatedReviews);
    set({ reviews: updatedReviews });
  },

  flagReview: (id: string, reason: string) => {
    get().updateReview(id, {
      flagged: true,
      flagReason: reason,
    });
  },
}));
