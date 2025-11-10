import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Home as HomeIcon, ArrowLeft, Calendar, Star } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { Card } from '../../components/shared/Card';
import { Avatar } from '../../components/shared/Avatar';
import { Loading } from '../../components/shared/Loading';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { useReviewStore } from '../../store/reviewStore';
import { formatCurrency } from '../../utils/helpers';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const incrementViews = usePropertyStore(state => state.incrementViews);
  const users = useAuthStore(state => state.users);
  const getReviewsByProperty = useReviewStore(state => state.getReviewsByProperty);
  
  const [property] = useState(getPropertyById(id!));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id && property) {
      incrementViews(id);
    }
  }, [id]);

  if (!property) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  const agent = users.find(u => u.id === property.agentId);
  const reviews = getReviewsByProperty(property.id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Browse</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative mb-6">
                <img
                  src={property.photos[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {property.photos.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {property.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${property.title} ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                          index === currentImageIndex ? 'ring-2 ring-gold' : 'opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <Badge status={property.status} />
                </div>

                <p className="text-3xl font-bold text-gold mb-6">
                  {formatCurrency(property.price)}
                </p>

                <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Bath className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-semibold">{property.area} sqm</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              </div>

              {reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const customer = users.find(u => u.id === review.customerId);
                      return (
                        <Card key={review.id}>
                          <div className="p-4">
                            <div className="flex items-start gap-3 mb-2">
                              <Avatar name={customer?.name || 'User'} size="sm" />
                              <div className="flex-1">
                                <p className="font-semibold">{customer?.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4">Agent Information</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={agent?.name || 'Agent'} size="lg" />
                    <div>
                      <p className="font-semibold">{agent?.name}</p>
                      <p className="text-sm text-gray-600">{agent?.agency}</p>
                    </div>
                  </div>

                  {reviews.length > 0 && (
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(averageRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                    </div>
                  )}

                  <Button
                    fullWidth
                    onClick={() => navigate(`/customer/book-appointment?propertyId=${property.id}`)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
