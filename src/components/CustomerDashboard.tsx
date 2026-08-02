import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency } from '../i18n/translations';
import { ProductCard } from './ProductCard';
import { StoreCard } from './StoreCard';
import type { Reservation } from '../types';
import { 
  LayoutDashboard, 
  Store as StoreIcon, 
  Heart, 
  ShoppingBag, 
  History, 
  QrCode, 
  Star,
  X,
  Leaf
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    language, 
    user, 
    reservations, 
    stores, 
    foodPackages, 
    favorites, 
    recentlyViewed,
    setSelectedPackage, 
    setSelectedStore, 
    setActiveReservation,
    cancelReservation,
    addReview,
    getEcoImpactStats
  } = useApp();

  const [activeSideTab, setActiveSideTab] = useState<'overview' | 'browse' | 'favorites' | 'reservations' | 'history' | 'profile'>('overview');
  
  // Review Modal State
  const [reviewModalRes, setReviewModalRes] = useState<Reservation | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const t = translations[language];
  const eco = getEcoImpactStats();

  if (!user) return null;

  const myReservations = reservations.filter(r => r.customer_id === user.id);
  const activeReservations = myReservations.filter(r => r.status === 'reserved' || r.status === 'confirmed');
  const pastReservations = myReservations.filter(r => r.status === 'completed' || r.status === 'collected' || r.status.includes('cancelled'));

  const favoriteStores = stores.filter(s => favorites.includes(s.id));
  const recommendedPackages = foodPackages.filter(p => p.status === 'available' && !p.is_deleted);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalRes) return;
    addReview(reviewModalRes.store_id, rating, comment, reviewModalRes.package_id);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalRes(null);
      setComment('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Profile Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md text-center">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user.full_name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#2E7D32] shadow"
            />
            <h3 className="font-extrabold text-base text-slate-900 mt-3">{user.full_name}</h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase">
              Hà Nội Eco Customer
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-md space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveSideTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                activeSideTab === 'overview'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboard}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('browse')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                activeSideTab === 'browse'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>{t.navBrowse}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('favorites')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                activeSideTab === 'favorites'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{t.favorites} ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveSideTab('reservations')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                activeSideTab === 'reservations'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-4 h-4" />
                <span>{t.myReservations}</span>
              </div>
              {activeReservations.length > 0 && (
                <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {activeReservations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSideTab('history')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                activeSideTab === 'history'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t.reservationHistory}</span>
            </button>
          </div>

          {/* Eco Impact Widget */}
          <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-black uppercase text-[10px] tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>{t.ecoImpactTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-emerald-900/60 p-2 rounded-2xl border border-emerald-800">
                <p className="font-black text-white font-mono text-base">{eco.mealsSaved}</p>
                <p className="text-[10px] text-emerald-300">{t.mealsSaved}</p>
              </div>
              <div className="bg-emerald-900/60 p-2 rounded-2xl border border-emerald-800">
                <p className="font-black text-white font-mono text-base">{eco.wastePreventedKg}kg</p>
                <p className="text-[10px] text-emerald-300">{t.wastePreventedKg}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Reservations Alert Banner */}
          {activeReservations.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Đang diễn ra ({activeReservations.length})
                </span>
                <h3 className="text-lg font-black">{activeReservations[0].package_title}</h3>
                <p className="text-xs text-amber-100">
                  📍 {activeReservations[0].store_name} • Giờ nhận: {activeReservations[0].pickup_time}
                </p>
              </div>

              <button
                onClick={() => setActiveReservation(activeReservations[0])}
                className="bg-white text-amber-900 hover:bg-amber-50 font-black text-xs px-5 py-3 rounded-2xl transition-all shadow flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.viewQRCode}</span>
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeSideTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              
              {/* Recommended Surplus Food */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-900">{t.recommendedFood}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedPackages.slice(0, 6).map((pkg) => (
                    <ProductCard
                      key={pkg.id}
                      pkg={pkg}
                      onReserve={() => setSelectedPackage(pkg)}
                    />
                  ))}
                </div>
              </div>

              {/* Stores Near You */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-900">{t.nearbyStores}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.slice(0, 3).map((store) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onSelect={(s) => setSelectedStore(s)}
                    />
                  ))}
                </div>
              </div>

              {/* Recently Viewed Packages */}
              {recentlyViewed.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900">{t.recentlyViewed}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recentlyViewed.map((pkg) => (
                      <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-all flex items-center space-x-3">
                        <img src={pkg.image} alt={pkg.title} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{pkg.title}</h4>
                          <p className="text-[10px] text-emerald-700 font-black">{formatCurrency(pkg.discount_price, language)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY RESERVATIONS */}
          {activeSideTab === 'reservations' && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-black text-slate-900">{t.myReservations}</h2>
              {activeReservations.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-500 border border-slate-100">
                  {t.noReservations}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeReservations.map((res) => (
                    <div key={res.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center space-x-4">
                        <img src={res.package_image} alt={res.package_title} className="w-20 h-20 rounded-2xl object-cover" />
                        <div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {res.status}
                          </span>
                          <h3 className="font-black text-slate-900 text-sm mt-1">{res.package_title}</h3>
                          <p className="text-slate-500 font-semibold">{res.store_name}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Mã đơn: <strong className="font-mono text-slate-800">{res.reservation_code}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                        <div>
                          <p className="font-black text-[#2E7D32] text-sm">{formatCurrency(res.total_price, language)}</p>
                          <p className="text-[10px] text-slate-400">Thanh toán tiền mặt</p>
                        </div>
                        <button
                          onClick={() => setActiveReservation(res)}
                          className="bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center space-x-2"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>{t.viewQRCode}</span>
                        </button>
                        <button
                          onClick={() => cancelReservation(res.id)}
                          className="text-rose-600 hover:bg-rose-50 font-bold text-xs px-3 py-2 rounded-xl"
                        >
                          {t.cancelReservation}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESERVATION HISTORY & REVIEW TRIGGER */}
          {activeSideTab === 'history' && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-black text-slate-900">{t.reservationHistory}</h2>
              <div className="space-y-3">
                {pastReservations.map((res) => (
                  <div key={res.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-4">
                      <img src={res.package_image} alt={res.package_title} className="w-16 h-16 rounded-2xl object-cover" />
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          res.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {res.status}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{res.package_title}</h4>
                        <p className="text-slate-500">{res.store_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <p className="font-black text-slate-900">{formatCurrency(res.total_price, language)}</p>
                      {res.status === 'completed' && (
                        <button
                          onClick={() => setReviewModalRes(res)}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{t.writeReview}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAVORITES */}
          {activeSideTab === 'favorites' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-black text-slate-900">{t.favorites}</h2>
              {favoriteStores.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-500 border border-slate-100">
                  {t.noFavorites}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteStores.map((store) => (
                    <StoreCard key={store.id} store={store} onSelect={(s) => setSelectedStore(s)} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* VERIFIED REVIEW MODAL */}
      {reviewModalRes && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative text-xs animate-in zoom-in-95">
            <button onClick={() => setReviewModalRes(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900">{t.writeReview}</h3>
            <p className="text-slate-500">Đánh giá cho gói: <strong>{reviewModalRes.package_title}</strong> tại {reviewModalRes.store_name}</p>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-center">
                Đã gửi đánh giá thành công! Cảm ơn ý kiến của bạn.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.reviewRating}</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.reviewComment}</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bánh mì thơm ngon, chất lượng tuyệt vời..."
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  {t.submitReview}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
