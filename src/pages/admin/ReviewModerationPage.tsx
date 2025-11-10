import React, { useState } from 'react';
import { Star, Flag, Edit, Trash2, Search } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { EmptyState } from '../../components/shared/EmptyState';
import { useReviewStore } from '../../store/reviewStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/shared/Toast';
import { formatDate } from '../../utils/helpers';

type FilterType = 'all' | 'flagged' | 'recent' | 'low-rated';

export const ReviewModerationPage: React.FC = () => {
  const reviews = useReviewStore(state => state.reviews);
  const deleteReview = useReviewStore(state => state.deleteReview);
  const flagReview = useReviewStore(state => state.flagReview);
  const updateReview = useReviewStore(state => state.updateReview);
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const users = useAuthStore(state => state.users);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredReviews = [...reviews];
  
  if (filter === 'flagged') {
    filteredReviews = filteredReviews.filter(r => r.flagged);
  } else if (filter === 'recent') {
    filteredReviews = filteredReviews.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 20);
  } else if (filter === 'low-rated') {
    filteredReviews = filteredReviews.filter(r => r.rating <= 2);
  }

  if (searchQuery) {
    filteredReviews = filteredReviews.filter(r => {
      const property = getPropertyById(r.propertyId);
      const customer = users.find(u => u.id === r.customerId);
      return (
        property?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  const totalReviews = reviews.length;
  const flaggedCount = reviews.filter(r => r.flagged).length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleFlag = (reviewId: string) => {
    const reason = prompt('Enter reason for flagging this review:');
    if (reason) {
      flagReview(reviewId, reason);
      toast.success('Review flagged successfully');
    }
  };

  const handleUnflag = (reviewId: string) => {
    updateReview(reviewId, { flagged: false, flagReason: undefined });
    toast.success('Review unflagged successfully');
  };

  const handleEdit = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    const newComment = prompt('Edit review comment:', review.comment);
    if (newComment && newComment !== review.comment) {
      const adminNote = prompt('Add admin note (optional):');
      updateReview(reviewId, {
        comment: newComment,
        adminEdited: true,
        adminNote: adminNote || undefined,
      });
      toast.success('Review updated successfully');
    }
  };

  const handleDelete = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      deleteReview(reviewId);
      toast.success('Review deleted successfully');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          Review Moderation
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-2xl font-bold">{totalReviews}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Flagged Reviews</p>
              <p className="text-2xl font-bold text-yellow-600">{flaggedCount}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{avgRating}</p>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by property, customer, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'flagged', 'recent', 'low-rated'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
                filter === f
                  ? 'bg-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={<Star className="w-16 h-16" />}
            title="No reviews found"
            description={searchQuery ? 'Try adjusting your search query' : `No ${filter} reviews available`}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => {
              const property = getPropertyById(review.propertyId);
              const customer = users.find(u => u.id === review.customerId);
              if (!property || !customer) return null;

              return (
                <Card key={review.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{property.title}</h3>
                          {review.flagged && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Flagged
                            </span>
                          )}
                          {review.adminEdited && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Edited
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          By: <strong>{customer.name}</strong> ({customer.email})
                        </p>
                        <div className="flex items-center gap-4 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {review.flagged ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUnflag(review.id)}
                          >
                            Unflag
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleFlag(review.id)}
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(review.id)}
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
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.flagReason && (
                      <div className="p-3 bg-red-50 rounded-lg mb-2">
                        <p className="text-sm text-red-900">
                          <strong>Flag Reason:</strong> {review.flagReason}
                        </p>
                      </div>
                    )}
                    {review.adminNote && (
                      <div className="p-3 bg-blue-50 rounded-lg">
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
    </MainLayout>
  );
};
