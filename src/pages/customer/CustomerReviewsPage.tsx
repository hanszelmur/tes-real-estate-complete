import React, { useState } from 'react';
import { Star, Trash2, Edit, Calendar } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { EmptyState } from '../../components/shared/EmptyState';
import { useReviewStore } from '../../store/reviewStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/shared/Toast';
import { formatDate } from '../../utils/helpers';
import type { ReviewFilterType } from '../../types';

export const CustomerReviewsPage: React.FC = () => {
  const currentUser = useAuthStore(state => state.currentUser);
  const getReviewsByCustomer = useReviewStore(state => state.getReviewsByCustomer);
  const deleteReview = useReviewStore(state => state.deleteReview);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  
  const [filter, setFilter] = useState<ReviewFilterType>('all');

  if (!currentUser) return null;

  let reviews = getReviewsByCustomer(currentUser.id);
  
  if (filter === 'published') {
    reviews = reviews.filter(r => !r.flagged);
  } else if (filter === 'pending') {
    reviews = reviews.filter(r => r.flagged);
  }

  const handleDelete = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
      toast.success('Review deleted successfully');
    }
  };

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            My Reviews
          </h1>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'published', 'pending'] as ReviewFilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
                  filter === f
                    ? 'bg-gold text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {reviews.length === 0 ? (
            <EmptyState
              icon={<Star className="w-16 h-16" />}
              title="No reviews found"
              description={`You haven't ${filter === 'all' ? 'written any reviews yet' : `any ${filter} reviews`}`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((review) => {
                const property = getPropertyById(review.propertyId);
                if (!property) return null;

                return (
                  <Card key={review.id}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                          <div className="flex items-center gap-4 mb-2">
                            {renderStars(review.rating)}
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                          {review.flagged && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Pending Review
                            </span>
                          )}
                          {review.adminEdited && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                              Edited by Admin
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleEdit}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.adminNote && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <strong>Admin Note:</strong> {review.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
