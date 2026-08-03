import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import type { Store } from '../types';
import { ProductCard } from './ProductCard';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Heart, 
  Plus, 
  ShoppingBag
} from 'lucide-react';

interface StorePageModalProps {
  store: Store | null;
  onClose: () => void;
}

export const StorePageModal: React.FC<StorePageModalProps> = ({ store, onClose }) => {
  const { 
    language, 
    foodPackages, 
    reviews, 
    favorites, 
    toggleFavoriteStore, 
    setSelectedPackage, 
    addReview
  } = useApp();

  const [activeTab, setActiveTab] = useState<'packages' | 'reviews'>('packages');
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const t = translations[language];

  if (!store) return null;

  const isFav = favorites.includes(store.id);
  const storePackages = foodPackages.filter((p) => p.store_id === store.id);
  const storeReviews = reviews.filter((r) => r.store_id === store.id);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(store.id, newRating, newComment);
    setNewComment('');
    setShowAddReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-56 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={store.cover_image}
            alt={store.store_name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <button
            onClick={() => toggleFavoriteStore(store.id)}
            className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 shadow transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
            <div className="flex items-end space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-1 shadow-2xl border border-slate-100 overflow-hidden shrink-0">
                <img
                  src={store.logo}
                  alt={store.store_name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="text-white pb-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black">{store.store_name}</h1>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{store.rating}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#81C784] mr-1 shrink-0" />
                  <span className="font-bold mr-1">{store.district}:</span>
                  <span className="truncate max-w-xs">{store.address}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-4 text-slate-600">
            <span className="flex items-center font-medium">
              <Clock className="w-4 h-4 text-emerald-600 mr-1.5" />
              {store.opening_hours}
            </span>
            <span className="flex items-center font-medium">
              <Phone className="w-4 h-4 text-emerald-600 mr-1.5" />
              {store.phone}
            </span>
          </div>

          <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'packages'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.availablePackages} ({storePackages.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.customerReviews} ({storeReviews.length})
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'packages' && (
            <div>
              {storePackages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40 text-emerald-600" />
                  <p className="text-sm font-semibold">{t.noResults}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {storePackages.map((pkg) => (
                    <ProductCard
                      key={pkg.id}
                      pkg={pkg}
                      onSelect={(p) => setSelectedPackage(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {t.customerReviews}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đánh giá chân thực từ khách hàng mua hàng tại Hà Nội
                  </p>
                </div>

                <button
                  onClick={() => setShowAddReview(!showAddReview)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-emerald-800 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.writeReview}</span>
                </button>
              </div>

              {showAddReview && (
                <form onSubmit={handleAddReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.yourRating}</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.yourComment}</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm lấy hàng tại cửa hàng..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-emerald-800"
                  >
                    {t.submitReview}
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {storeReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                    <img
                      src={rev.customer_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={rev.customer_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900">{rev.customer_name}</h4>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
