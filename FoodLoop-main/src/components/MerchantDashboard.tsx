import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency } from '../i18n/translations';
import type { FoodPackage, FoodCategory, DateFilterOption, StoreStatus } from '../types';
import { 
  Store as StoreIcon, 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  QrCode, 
  X, 
  BarChart3,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  History
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const { 
    language, 
    user, 
    stores, 
    activeStore,
    setActiveStoreId,
    foodPackages, 
    reservations, 
    createFoodPackage, 
    updateFoodPackage, 
    togglePausePackage,
    deleteFoodPackage, 
    validateAndCompleteQR,
    updateStoreSettings,
    getMerchantAnalytics,
    activityLogs
  } = useApp();

  if (!user || user.role !== 'merchant') return null;

  const [activeSideTab, setActiveSideTab] = useState<'overview' | 'packages' | 'fulfillment' | 'analytics' | 'store' | 'logs'>('overview');
  
  // Package Modal & Form State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<FoodPackage | null>(null);
  const [pkgErrMsg, setPkgErrMsg] = useState<string | null>(null);

  // Package Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('bakery');
  const [origPrice, setOrigPrice] = useState(120000);
  const [discPrice, setDiscPrice] = useState(45000);
  const [qty, setQty] = useState(10);
  const [pickupStart, setPickupStart] = useState('19:30');
  const [pickupEnd, setPickupEnd] = useState('21:30');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80');

  // QR Fulfillment State
  const [inputCode, setInputCode] = useState('');
  const [scanMessage, setScanMessage] = useState<{ success?: boolean; text?: string }>({});

  // Analytics Date Filter State
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('this_month');

  // Store Settings Form State
  const [storeForm, setStoreForm] = useState({
    business_name: activeStore?.business_name || 'Công ty TNHH Tous Les Jours Việt Nam',
    owner_name: activeStore?.owner_name || 'Trần Văn Đức',
    store_name: activeStore?.store_name || 'Tous Les Jours - Lý Thường Kiệt',
    business_category: activeStore?.business_category || 'bakery',
    district: activeStore?.district || 'Hoàn Kiếm',
    address: activeStore?.address || '25 Lý Thường Kiệt, P. Phan Chu Trinh, Q. Hoàn Kiếm, Hà Nội',
    phone: activeStore?.phone || '024 3933 5588',
    email: activeStore?.email || 'contact@touslesjours.vn',
    opening_hours: activeStore?.opening_hours || '07:00 - 21:30',
    description: activeStore?.description || 'Tiệm bánh Pháp cao cấp nướng mới mỗi ngày.',
    pickup_instructions: activeStore?.pickup_instructions || 'Nhận hàng trực tiếp tại quầy Thu ngân tầng 1.',
    website: activeStore?.website || 'https://touslesjours.com.vn',
    facebook: activeStore?.facebook || 'https://facebook.com/touslesjoursvietnam',
    google_maps_url: activeStore?.google_maps_url || 'https://maps.google.com/?q=Tous+Les+Jours',
    logo: activeStore?.logo || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    cover_image: activeStore?.cover_image || 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80',
    status: activeStore?.status || 'open' as StoreStatus,
  });

  const [storeSettingsSuccess, setStoreSettingsSuccess] = useState(false);

  const t = translations[language];

  // Merchant Stores (Multi-store support)
  const merchantStores = stores.filter(s => s.owner_id === user?.id && !s.is_deleted);
  const currentStore = (activeStore && activeStore.owner_id === user?.id) ? activeStore : (merchantStores[0] || null);

  const myPackages = currentStore ? foodPackages.filter(p => p.store_id === currentStore.id && !p.is_deleted) : [];
  const myReservations = currentStore ? reservations.filter(r => r.store_id === currentStore.id) : [];

  // Dynamic calculated analytics
  const analyticsSummary = getMerchantAnalytics(dateFilter);

  // Quick Stats
  const availableCount = myPackages.filter(p => p.status === 'available').length;
  const completedCount = myReservations.filter(r => r.status === 'completed').length;

  const openCreateModal = () => {
    setEditingPkg(null);
    setPkgErrMsg(null);
    setTitle('');
    setDescription('');
    setCategory('bakery');
    setOrigPrice(120000);
    setDiscPrice(45000);
    setQty(10);
    setPickupStart('19:00');
    setPickupEnd('21:30');
    setImage('https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80');
    setShowPackageModal(true);
  };

  const openEditModal = (pkg: FoodPackage) => {
    setEditingPkg(pkg);
    setPkgErrMsg(null);
    setTitle(pkg.title);
    setDescription(pkg.description);
    setCategory(pkg.category);
    setOrigPrice(pkg.original_price);
    setDiscPrice(pkg.discount_price);
    setQty(pkg.quantity);
    setPickupStart(pkg.pickup_start);
    setPickupEnd(pkg.pickup_end);
    setImage(pkg.image);
    setShowPackageModal(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    setPkgErrMsg(null);

    if (editingPkg) {
      const res = updateFoodPackage({
        ...editingPkg,
        title,
        description,
        category,
        original_price: Number(origPrice),
        discount_price: Number(discPrice),
        quantity: Number(qty),
        remaining_quantity: Number(qty),
        pickup_start: pickupStart,
        pickup_end: pickupEnd,
        image,
      });
      if (!res.success) {
        setPkgErrMsg(res.message || 'Error updating package');
        return;
      }
    } else {
      const res = createFoodPackage({
        store_id: currentStore.id,
        title,
        description,
        category,
        original_price: Number(origPrice),
        discount_price: Number(discPrice),
        quantity: Number(qty),
        pickup_start: pickupStart,
        pickup_end: pickupEnd,
        image,
      });
      if (!res.success) {
        setPkgErrMsg(res.message || 'Error creating package');
        return;
      }
    }

    setShowPackageModal(false);
  };

  const handleDeletePackage = (pkgId: string) => {
    const res = deleteFoodPackage(pkgId);
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleVerifyQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = validateAndCompleteQR(inputCode);
    if (res.success) {
      setScanMessage({ success: true, text: res.message });
      setInputCode('');
    } else {
      setScanMessage({ success: false, text: res.message });
    }
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(storeForm);
    setStoreSettingsSuccess(true);
    setTimeout(() => setStoreSettingsSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Store Switcher */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentStore.logo}
            alt={currentStore.store_name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{currentStore.store_name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                currentStore.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {currentStore.status === 'open' ? t.statusOpen : t.statusClosed}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
              <span>📍 {currentStore.address}</span>
              <span>• {currentStore.district}</span>
            </p>
          </div>
        </div>

        {/* Multi-Store Selection */}
        {merchantStores.length > 1 && (
          <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200 text-xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cửa hàng đang quản lý:</span>
            <select
              value={currentStore.id}
              onChange={(e) => setActiveStoreId(e.target.value)}
              className="bg-white font-bold text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              {merchantStores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.store_name} ({s.district})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-1 text-xs">
            <button
              onClick={() => setActiveSideTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'overview'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t.dashboard}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('packages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'packages'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4" />
                <span>{t.foodPackages}</span>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono">
                {myPackages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSideTab('fulfillment')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'fulfillment'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <QrCode className="w-4 h-4" />
                <span>{t.scanFulfillment}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
                QR
              </span>
            </button>

            <button
              onClick={() => setActiveSideTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'analytics'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t.analytics}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('store')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'store'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>{t.storeSettings}</span>
            </button>

            <button
              onClick={() => setActiveSideTab('logs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeSideTab === 'logs'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t.activityLogTitle}</span>
            </button>
          </div>

          {/* Environmental Impact badge */}
          <div className="bg-emerald-900 text-emerald-100 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">Tác động sinh thái cửa hàng</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-emerald-800 pb-1.5">
                <span className="text-emerald-300">Bữa ăn đã giải cứu</span>
                <span className="font-mono font-bold text-white">{completedCount + 48}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800 pb-1.5">
                <span className="text-emerald-300">Lãng phí đã giảm</span>
                <span className="font-mono font-bold text-white">{Math.round((completedCount + 48) * 0.8)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">Giảm phát thải CO₂</span>
                <span className="font-mono font-bold text-emerald-400">{Math.round((completedCount + 48) * 2.0)} kg</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeSideTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{t.todayReservations}</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">{analyticsSummary.today_orders}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{t.completedOrders}</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">{completedCount}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{t.packagesAvailable}</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">{availableCount}</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">{t.revenueRecovered}</p>
                  <p className="text-xl font-black text-slate-900 font-mono">
                    {formatCurrency(analyticsSummary.revenue_this_month, language)}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">{t.foodPackages}</h2>
                <button
                  onClick={openCreateModal}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createPackage}</span>
                </button>
              </div>

              {/* Package Table / Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3 relative">
                    <div className="flex items-center space-x-3">
                      <img src={pkg.image} alt={pkg.title} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            pkg.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                            pkg.status === 'paused' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {pkg.status === 'available' ? t.available : pkg.status === 'paused' ? t.paused : t.soldOut}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {pkg.pickup_start} - {pkg.pickup_end}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm truncate mt-1">{pkg.title}</h4>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="font-black text-[#2E7D32] text-sm">
                            {formatCurrency(pkg.discount_price, language)}
                          </span>
                          <span className="line-through text-slate-400 text-xs">
                            {formatCurrency(pkg.original_price, language)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-semibold">
                        {t.remaining}: <strong className="text-slate-900 font-mono">{pkg.remaining_quantity}/{pkg.quantity}</strong>
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => togglePausePackage(pkg.id)}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                          title={pkg.status === 'paused' ? t.resumePackage : t.pausePackage}
                        >
                          {pkg.status === 'paused' ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
                        </button>
                        <button
                          onClick={() => openEditModal(pkg)}
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES FULL LIST */}
          {activeSideTab === 'packages' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{t.foodPackages}</h2>
                  <p className="text-xs text-slate-500">Quản lý và cập nhật số lượng thực phẩm dư thừa của cửa hàng</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-4 py-2 rounded-2xl transition-all shadow-md flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createPackage}</span>
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-2">Gói thực phẩm</th>
                      <th className="py-3 px-2">Danh mục</th>
                      <th className="py-3 px-2">Giá ưu đãi</th>
                      <th className="py-3 px-2">Số lượng</th>
                      <th className="py-3 px-2">Khung giờ</th>
                      <th className="py-3 px-2">Trạng thái</th>
                      <th className="py-3 px-2 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-2 font-bold text-slate-900 flex items-center space-x-2">
                          <img src={pkg.image} alt={pkg.title} className="w-10 h-10 rounded-xl object-cover" />
                          <span className="truncate max-w-[180px]">{pkg.title}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 font-semibold">{pkg.category}</td>
                        <td className="py-3 px-2 font-black text-[#2E7D32]">
                          {formatCurrency(pkg.discount_price, language)}
                        </td>
                        <td className="py-3 px-2 font-mono font-bold">
                          {pkg.remaining_quantity} / {pkg.quantity}
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-500">
                          {pkg.pickup_start} - {pkg.pickup_end}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            pkg.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                            pkg.status === 'paused' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {pkg.status === 'available' ? t.available : pkg.status === 'paused' ? t.paused : t.soldOut}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => togglePausePackage(pkg.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                              title={pkg.status === 'paused' ? t.resumePackage : t.pausePackage}
                            >
                              {pkg.status === 'paused' ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
                            </button>
                            <button onClick={() => openEditModal(pkg)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeletePackage(pkg.id)} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QR FULFILLMENT */}
          {activeSideTab === 'fulfillment' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-lg font-black text-slate-900">{t.scanFulfillment}</h2>
                <p className="text-xs text-slate-500">Xác nhận mã đơn đặt chỗ khi khách hàng đến nhận đồ tại cửa hàng</p>
              </div>

              {/* Code Verification Input */}
              <form onSubmit={handleVerifyQR} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700">{t.enterCodeOrScan}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <QrCode className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="FL-RES-8921"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-white font-mono uppercase tracking-wider text-sm font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-6 py-2.5 rounded-2xl transition-all shadow-md"
                  >
                    {t.verifyCodeBtn}
                  </button>
                </div>
              </form>

              {/* Result Notification Banner */}
              {scanMessage.text && (
                <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 font-bold ${
                  scanMessage.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {scanMessage.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
                  <span>{scanMessage.text}</span>
                </div>
              )}

              {/* Reservation History & Financial Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Đơn hàng cần xử lý</h3>
                <div className="space-y-3">
                  {myReservations.map((res) => (
                    <div key={res.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-slate-900">{res.reservation_code}</span>
                          <span className="text-slate-500">• {res.customer_name} ({res.customer_phone})</span>
                        </div>
                        <p className="font-semibold text-slate-800 mt-0.5">{res.package_title} (x{res.quantity})</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Khung giờ nhận: {res.pickup_time}
                        </p>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-black text-[#2E7D32]">{formatCurrency(res.total_price, language)}</p>
                          <p className="text-[10px] text-slate-400">
                            Phí 5%: {formatCurrency(res.platform_fee, language)} | Thực nhận: {formatCurrency(res.merchant_revenue, language)}
                          </p>
                        </div>

                        {res.status !== 'completed' ? (
                          <button
                            onClick={() => validateAndCompleteQR(res.reservation_code)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm"
                          >
                            Hoàn thành
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-[10px]">
                            Đã hoàn thành
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS & CHARTS */}
          {activeSideTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{t.analytics}</h2>
                  <p className="text-xs text-slate-500">Thống kê doanh thu thu hồi thực tế dựa trên dữ liệu đơn hàng</p>
                </div>

                {/* Date Filter Bar */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                  {(['today', 'this_week', 'this_month', 'last_month'] as DateFilterOption[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setDateFilter(f)}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        dateFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {f === 'today' ? t.filterToday : f === 'this_week' ? t.filterThisWeek : f === 'this_month' ? t.filterThisMonth : t.filterLastMonth}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Tổng Doanh Thu Thu Hồi</p>
                  <p className="text-2xl font-black text-slate-900 font-mono">
                    {formatCurrency(analyticsSummary.revenue_this_month, language)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">{t.platformFee}</p>
                  <p className="text-2xl font-black text-rose-600 font-mono">
                    {formatCurrency(analyticsSummary.platform_fee_total, language)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">{t.actualMerchantRevenue}</p>
                  <p className="text-2xl font-black text-[#2E7D32] font-mono">
                    {formatCurrency(analyticsSummary.actual_merchant_revenue, language)}
                  </p>
                </div>
              </div>

              {/* Interactive Visual SVG Chart (Revenue Trend) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{t.monthlyRevenueChart}</h3>
                  <span className="text-xs text-slate-400 font-mono">Năm 2026</span>
                </div>

                <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {[35, 42, 60, 75, 90, 85, 110, 140, 130, 160, 180, 210].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded font-mono z-10 pointer-events-none">
                        {val * 1000}₫
                      </div>
                      <div
                        style={{ height: `${(val / 220) * 100}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all group-hover:from-emerald-600 group-hover:to-emerald-400"
                      />
                      <span className="text-[10px] font-bold text-slate-400">T{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STORE CONFIGURATION SETTINGS */}
          {activeSideTab === 'store' && (
            <form onSubmit={handleSaveStoreSettings} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 animate-in fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{t.storeSettings}</h2>
                  <p className="text-xs text-slate-500">Cấu hình thông tin thương hiệu, hình ảnh và giờ mở cửa tại Hà Nội</p>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-2.5 rounded-2xl transition-all shadow-md"
                >
                  {t.saveStoreSettings}
                </button>
              </div>

              {storeSettingsSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã cập nhật thông tin cửa hàng thành công!</span>
                </div>
              )}

              {/* Status Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">{t.storeStatus}</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStoreForm(prev => ({ ...prev, status: 'open' }))}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      storeForm.status === 'open' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border'
                    }`}
                  >
                    {t.statusOpen}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoreForm(prev => ({ ...prev, status: 'closed' }))}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      storeForm.status === 'closed' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-600 border'
                    }`}
                  >
                    {t.statusClosed}
                  </button>
                </div>
              </div>

              {/* Images Preview & Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.storeLogo}</label>
                  <div className="flex items-center space-x-3">
                    <img src={storeForm.logo} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border" />
                    <input
                      type="text"
                      value={storeForm.logo}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, logo: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.storeCover}</label>
                  <div className="flex items-center space-x-3">
                    <img src={storeForm.cover_image} alt="Cover" className="w-20 h-12 rounded-xl object-cover border" />
                    <input
                      type="text"
                      value={storeForm.cover_image}
                      onChange={(e) => setStoreForm(prev => ({ ...prev, cover_image: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.businessName}</label>
                  <input
                    type="text"
                    value={storeForm.business_name}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, business_name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.storeName}</label>
                  <input
                    type="text"
                    value={storeForm.store_name}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, store_name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.phone}</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.openingHoursText}</label>
                  <input
                    type="text"
                    value={storeForm.opening_hours}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, opening_hours: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.addressDetail}</label>
                <input
                  type="text"
                  value={storeForm.address}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.pickupInstructionsText}</label>
                <textarea
                  rows={2}
                  value={storeForm.pickup_instructions}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, pickup_instructions: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </form>
          )}

          {/* TAB 6: ACTIVITY LOGS */}
          {activeSideTab === 'logs' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 animate-in fade-in text-xs">
              <h2 className="text-lg font-black text-slate-900">{t.activityLogTitle}</h2>
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{language === 'vi' ? log.action_vi : log.action_en}</p>
                      <p className="text-slate-500 mt-0.5">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE / EDIT PACKAGE MODAL */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative text-xs">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900">
              {editingPkg ? t.editPackage : t.createPackage}
            </h3>

            {pkgErrMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                {pkgErrMsg}
              </div>
            )}

            <form onSubmit={handleSavePackage} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.packageTitle} *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  placeholder="Túi Bánh Mì Pastry Pháp Ngẫu Nhiên"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.description}</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.origPriceVND} *</label>
                  <input
                    type="number"
                    required
                    value={origPrice}
                    onChange={(e) => setOrigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.discPriceVND} *</label>
                  <input
                    type="number"
                    required
                    value={discPrice}
                    onChange={(e) => setDiscPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.quantity} *</label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.pickupStart} *</label>
                  <input
                    type="text"
                    required
                    value={pickupStart}
                    onChange={(e) => setPickupStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.pickupEnd} *</label>
                  <input
                    type="text"
                    required
                    value={pickupEnd}
                    onChange={(e) => setPickupEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-lg transition-all mt-2"
              >
                {t.savePackage}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
