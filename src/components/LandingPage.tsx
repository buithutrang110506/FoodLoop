import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { HANOI_DISTRICTS } from '../data/hanoiData';
import type { FoodCategory, DistrictName } from '../types';
import { ProductCard } from './ProductCard';
import { StoreCard } from './StoreCard';
import { HanoiMap } from './HanoiMap';
import { 
  Sparkles, 
  ShoppingBag, 
  Store as StoreIcon, 
  MapPin, 
  Search, 
  Utensils, 
  Coffee, 
  Cake, 
  Building2, 
  ShoppingBasket, 
  Leaf, 
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    language, 
    foodPackages, 
    stores, 
    selectedDistrict, 
    setSelectedDistrict, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedPackage,
    setSelectedStore,
    setActiveTab,
    setAuthModalOpen,
    setAuthRole,
    setAuthMode
  } = useApp();

  const t = translations[language];

  const categoriesList: { id: FoodCategory | 'All'; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'All', label: language === 'vi' ? 'Tất cả' : 'All Deals', icon: <Sparkles className="w-5 h-5" />, color: 'bg-emerald-600' },
    { id: 'bakery', label: t.catBakery, icon: <Utensils className="w-5 h-5" />, color: 'bg-amber-500' },
    { id: 'restaurant', label: t.catRestaurant, icon: <Building2 className="w-5 h-5" />, color: 'bg-rose-500' },
    { id: 'coffee', label: t.catCoffee, icon: <Coffee className="w-5 h-5" />, color: 'bg-[#2E7D32]' },
    { id: 'dessert', label: t.catDessert, icon: <Cake className="w-5 h-5" />, color: 'bg-purple-500' },
    { id: 'convenience', label: t.catConvenience, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-blue-500' },
    { id: 'supermarket', label: t.catSupermarket, icon: <ShoppingBasket className="w-5 h-5" />, color: 'bg-[#81C784]' },
  ];

  const filteredPackages = foodPackages.filter((pkg) => {
    const store = stores.find((s) => s.id === pkg.store_id);
    const matchesDistrict = selectedDistrict === 'All' || store?.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store?.store_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesCategory && matchesQuery;
  });

  const filteredStores = stores.filter((s) => {
    const matchesDistrict = selectedDistrict === 'All' || s.district === selectedDistrict;
    const matchesQuery = !searchQuery || s.store_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesQuery;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm">
                <Leaf className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-xs font-black text-emerald-900 tracking-wide">
                  Hà Nội Food Rescue Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {t.heroTitleLine1} <br />
                <span className="text-[#2E7D32]">{t.heroTitleLine2}</span> <br />
                <span className="bg-gradient-to-r from-[#2E7D32] to-[#81C784] bg-clip-text text-transparent">
                  {t.heroTitleLine3}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                {t.heroSubtitle}
              </p>

              <div className="bg-white p-3 rounded-3xl shadow-xl border border-emerald-100 max-w-xl mx-auto lg:mx-0 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
                <div className="flex-1 flex items-center bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-[#2E7D32] mr-1.5 shrink-0" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value as DistrictName | 'All')}
                    className="bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="All">📍 {t.allDistricts}</option>
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-[#2E7D32] hover:bg-emerald-800 shadow-xl shadow-emerald-700/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t.exploreDeals}</span>
                </button>

                <button
                  onClick={() => {
                    setAuthRole('merchant');
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl text-sm font-extrabold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-md transition-all flex items-center space-x-2"
                >
                  <StoreIcon className="w-5 h-5 text-amber-600" />
                  <span>{t.becomeMerchant}</span>
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80"
                  alt="Surplus Food Hanoi"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute top-4 right-4 bg-[#FFB300] text-slate-950 font-black text-sm px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-1.5 animate-bounce">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>-70% OFF HÀ NỘI</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#2E7D32] font-black shrink-0">
                    50%
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Tous Les Jours - Hoàn Kiếm</h4>
                    <p className="text-[11px] text-slate-500">Túi Bánh Mì & Croissant Bơ Pháp (39.000 ₫)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2E7D32] to-[#81C784] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-mono">15,480+</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wider">{t.statsMealsRescued}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-mono">120+</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wider">{t.statsPartnerStores}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-mono">24,500+</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wider">{t.statsCustomers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black font-mono">38,700</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase tracking-wider">{t.statsWasteReduced}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.categoriesTitle}</h2>
            <p className="text-xs text-slate-500">Khám phá các loại thực phẩm dư thừa chất lượng cao</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#2E7D32] text-white shadow-emerald-700/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* HANOI INTERACTIVE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.hanoiMapTitle}</h2>
            <p className="text-xs text-slate-500">{t.hanoiMapSub}</p>
          </div>
        </div>

        <HanoiMap filteredStores={filteredStores} />
      </section>

      {/* FEATURED FOOD PACKAGES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.featuredPackages}</h2>
            <p className="text-xs text-slate-500">Đặt trực tiếp và nhận tại cửa hàng trong khung giờ vàng</p>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center space-x-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.slice(0, 6).map((pkg) => (
              <ProductCard
                key={pkg.id}
                pkg={pkg}
                onSelect={(p) => setSelectedPackage(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* POPULAR HANOI STORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.popularStores}</h2>
            <p className="text-xs text-slate-500">Các đối tác uy tín hàng đầu tại Hà Nội</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStores.slice(0, 4).map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onSelect={(s) => setSelectedStore(s)}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div>
            <h2 className="text-3xl font-black">Cách FoodLoop Hoạt Động</h2>
            <p className="text-xs text-slate-400 mt-1">3 Bước đơn giản để giải cứu thực phẩm tươi ngon mỗi ngày</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                1
              </div>
              <h3 className="font-extrabold text-lg">Tìm Ưu Đãi Gần Bạn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mở ứng dụng FoodLoop, chọn các gói đồ ăn dư thừa tươi ngon từ các cửa hàng quanh quận Hà Nội của bạn.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                2
              </div>
              <h3 className="font-extrabold text-lg">Đặt Túi & Nhận Mã QR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nhấn đặt hàng chỉ trong 10 giây. Không cần chuyển khoản trực tuyến, mã QR đặt hàng được tạo ngay tức thì.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg">
                3
              </div>
              <h3 className="font-extrabold text-lg">Đến Lấy & Thanh Toán</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ghé cửa hàng đúng khung giờ, đưa mã QR cho nhân viên quét, thanh toán tiền mặt/chuyển khoản và thưởng thức!
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
