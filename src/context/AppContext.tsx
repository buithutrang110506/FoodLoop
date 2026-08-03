import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  Language, 
  User, 
  Store, 
  FoodPackage, 
  Reservation, 
  Review, 
  NotificationItem, 
  DistrictName, 
  FoodCategory, 
  Role,
  ActivityLog,
  DateFilterOption,
  AnalyticsSummary,
  StoreStatus
} from '../types';
import { 
  INITIAL_STORES, 
  INITIAL_PACKAGES
} from '../data/hanoiData';
import confetti from 'canvas-confetti';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  
  // Stores & Packages State
  stores: Store[];
  activeStore: Store | null;
  setActiveStoreId: (storeId: string) => void;
  foodPackages: FoodPackage[];
  reservations: Reservation[];
  favorites: string[];
  favoritePackages: string[];
  recentlyViewed: FoodPackage[];
  reviews: Review[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];

  // Filtering & Navigation State
  selectedDistrict: DistrictName | 'All';
  setSelectedDistrict: (d: DistrictName | 'All') => void;
  selectedCategory: FoodCategory | 'All';
  setSelectedCategory: (c: FoodCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'nearest' | 'rating' | 'price_low' | 'discount_high' | 'newest';
  setSortBy: (sort: 'nearest' | 'rating' | 'price_low' | 'discount_high' | 'newest') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  selectedPackage: FoodPackage | null;
  setSelectedPackage: (pkg: FoodPackage | null) => void;
  activeReservation: Reservation | null;
  setActiveReservation: (res: Reservation | null) => void;
  
  // Auth Modal State & Advanced Auth
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authRole: Role;
  setAuthRole: (role: Role) => void;
  authMode: 'login' | 'register' | 'forgot' | 'pending_verification' | 'reset';
  setAuthMode: (mode: 'login' | 'register' | 'forgot' | 'pending_verification' | 'reset') => void;
  verificationPendingEmail: string | null;
  setVerificationPendingEmail: (email: string | null) => void;

  // Actions - Authentication
  registerUser: (userData: Partial<User>, password: string) => { success: boolean; message?: string };
  loginUser: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message?: string };
  simulateVerifyEmail: (email: string) => void;
  resendVerificationEmail: (email: string) => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  resetPasswordWithToken: (password: string) => { success: boolean; message: string };

  // Actions - Store & Package Management
  updateStoreSettings: (storeData: Partial<Store>) => void;
  toggleStoreStatus: (status: StoreStatus) => void;
  createFoodPackage: (pkgData: Omit<FoodPackage, 'id' | 'remaining_quantity' | 'status' | 'created_at' | 'updated_at'>) => { success: boolean; message?: string };
  updateFoodPackage: (pkg: FoodPackage) => { success: boolean; message?: string };
  togglePausePackage: (packageId: string) => void;
  deleteFoodPackage: (packageId: string) => { success: boolean; message: string };

  // Actions - Reservations & QR Validation Engine
  reservePackage: (packageId: string, quantity: number) => { success: boolean; reservation?: Reservation; message?: string };
  confirmReservationByMerchant: (reservationId: string) => void;
  cancelReservation: (reservationId: string, reason?: string) => void;
  validateAndCompleteQR: (code: string) => { success: boolean; message: string; reservation?: Reservation };

  // Actions - Reviews & Social
  addReview: (storeId: string, rating: number, comment: string, packageId?: string) => { success: boolean; message?: string };
  replyToReview: (reviewId: string, replyText: string) => void;
  toggleFavoriteStore: (storeId: string) => void;
  toggleFavoritePackage: (packageId: string) => void;
  addRecentlyViewed: (pkg: FoodPackage) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;

  // Analytics Computation
  getMerchantAnalytics: (dateFilter: DateFilterOption) => AnalyticsSummary;
  getEcoImpactStats: () => { mealsSaved: number; wastePreventedKg: number; co2ReducedKg: number; treesSaved: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'foodloop_hanoi_lang_v2',
  USER: 'foodloop_hanoi_user_v2',
  USERS_DB: 'foodloop_hanoi_users_db_v2',
  STORES: 'foodloop_hanoi_stores_v2',
  PACKAGES: 'foodloop_hanoi_packages_v2',
  RESERVATIONS: 'foodloop_hanoi_reservations_v2',
  FAVORITES: 'foodloop_hanoi_fav_stores_v2',
  FAV_PACKAGES: 'foodloop_hanoi_fav_packages_v2',
  REVIEWS: 'foodloop_hanoi_reviews_v2',
  NOTIFICATIONS: 'foodloop_hanoi_notifications_v2',
  ACTIVITY_LOGS: 'foodloop_hanoi_logs_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // Users DB & Authenticated User
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUserState] = useState<User | null>(() => {
    const savedLocal = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedLocal) return JSON.parse(savedLocal);
    const savedSession = sessionStorage.getItem(STORAGE_KEYS.USER);
    if (savedSession) return JSON.parse(savedSession);
    return null;
  });

  const setUser = (u: User | null, rememberMe?: boolean) => {
    setUserState(u);
    if (u) {
      if (rememberMe || u.remember_me) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        sessionStorage.removeItem(STORAGE_KEYS.USER);
      } else {
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  // Stores
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORES);
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [activeStoreId, setActiveStoreIdState] = useState<string>('');

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
  };

  const activeStore = useMemo(() => {
    if (!user || user.role !== 'merchant') return null;
    const merchantStores = stores.filter(s => s.owner_id === user.id && !s.is_deleted);
    if (merchantStores.length === 0) return null;
    return merchantStores.find(s => s.id === activeStoreId) || merchantStores[0] || null;
  }, [stores, user, activeStoreId]);

  // Packages
  const [foodPackages, setFoodPackages] = useState<FoodPackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritePackages, setFavoritePackages] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAV_PACKAGES);
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed (not persisted)
  const [recentlyViewed, setRecentlyViewed] = useState<FoodPackage[]>([]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Filtering
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'price_low' | 'discount_high' | 'newest'>('discount_high');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<FoodPackage | null>(null);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  // Auth Modals & Verification State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<Role>('customer');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'pending_verification' | 'reset'>('login');
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(foodPackages));
  }, [foodPackages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_PACKAGES, JSON.stringify(favoritePackages));
  }, [favoritePackages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // ----------------------------------------------------
  // AUTHENTICATION WORKFLOW
  // ----------------------------------------------------
  const validatePassword = (pwd: string): boolean => {
    const minLen = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return minLen && hasUpper && hasLower && hasNum && hasSpecial;
  };

  const registerUser = (userData: Partial<User>, password: string): { success: boolean; message?: string } => {
    if (!validatePassword(password)) {
      return { success: false, message: translations[language].invalidPasswordErr };
    }

    const emailExists = users.some(u => u.email.toLowerCase() === (userData.email || '').toLowerCase());
    if (emailExists) {
      return { success: false, message: translations[language].emailExistsErr };
    }

    const phoneExists = users.some(u => u.phone === userData.phone);
    if (phoneExists) {
      return { success: false, message: translations[language].phoneExistsErr };
    }

    const newUserId = `usr_${userData.role}_${Date.now()}`;
    const newUser: User & { password?: string } = {
      id: newUserId,
      full_name: userData.full_name || 'Hanoi User',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      district: userData.district || 'Hoàn Kiếm',
      verification_status: 'active',
      created_at: new Date().toISOString(),
      password: password,
    };

    if (newUser.role === 'merchant') {
      const newStore: Store = {
        id: `str_${Date.now()}`,
        owner_id: newUserId,
        business_name: `${newUser.full_name} Business`,
        owner_name: newUser.full_name,
        store_name: `${newUser.full_name} Store`,
        business_category: 'bakery',
        description: 'Cửa hàng mới trên FoodLoop',
        district: newUser.district || 'Hoàn Kiếm',
        address: newUser.district ? `Quận ${newUser.district}, Hà Nội` : 'Hà Nội',
        email: newUser.email,
        phone: newUser.phone,
        opening_hours: '08:00 - 22:00',
        logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
        cover_image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80',
        status: 'open',
        rating: 5.0,
        review_count: 0,
        categories: ['bakery'],
        lat: 21.0285,
        lng: 105.8542,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setStores(prev => [...prev, newStore]);
    }

    setUsers(prev => [...prev, newUser]);
    setAuthMode('login');
    setVerificationPendingEmail(null);

    const successMsg = language === 'vi' 
      ? 'Đăng ký thành công! Vui lòng đăng nhập.' 
      : 'Registration successful! Please log in.';
    
    alert(successMsg);

    return { success: true, message: successMsg };
  };

  const loginUser = (email: string, password: string, rememberMe = false): { success: boolean; message?: string } => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase()) as (User & { password?: string }) | undefined;
    
    if (!existing) {
      return { 
        success: false, 
        message: language === 'vi' ? 'Email không chính xác hoặc chưa đăng ký.' : 'Invalid email or password.' 
      };
    }

    if (existing.password !== password) {
      return { 
        success: false, 
        message: language === 'vi' ? 'Mật khẩu không chính xác.' : 'Invalid email or password.' 
      };
    }

    const updatedUser = { ...existing, remember_me: rememberMe };
    setUser(updatedUser, rememberMe);
    setAuthModalOpen(false);

    if (updatedUser.role === 'customer') {
      setActiveTab('customer-dashboard');
    } else {
      setActiveTab('merchant-dashboard');
    }

    return { success: true };
  };

  const simulateVerifyEmail = (_email: string) => {};
  const resendVerificationEmail = (_email: string) => {};

  const requestPasswordReset = (_email: string): { success: boolean; message: string } => {
    return { success: false, message: 'This feature will be available when backend services are integrated.' };
  };

  const resetPasswordWithToken = (_newPassword: string): { success: boolean; message: string } => {
    return { success: false, message: 'This feature will be available when backend services are integrated.' };
  };

  // ----------------------------------------------------
  // STORE MANAGEMENT & STORE SETTINGS
  // ----------------------------------------------------
  const updateStoreSettings = (storeData: Partial<Store>) => {
    if (!activeStore) return;
    setStores(prev => prev.map(s => {
      if (s.id === activeStore.id) {
        return {
          ...s,
          ...storeData,
          updated_at: new Date().toISOString(),
        };
      }
      return s;
    }));

    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: activeStore.id,
      user_id: user?.id || '',
      action_vi: 'Cập nhật thông tin cửa hàng',
      action_en: 'Updated store profile settings',
      details: `${storeData.store_name || activeStore.store_name}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const toggleStoreStatus = (status: StoreStatus) => {
    if (!activeStore) return;
    updateStoreSettings({ status });
  };

  // ----------------------------------------------------
  // FOOD PACKAGE BUSINESS LOGIC
  // ----------------------------------------------------
  const createFoodPackage = (pkgData: Omit<FoodPackage, 'id' | 'remaining_quantity' | 'status' | 'created_at' | 'updated_at'>): { success: boolean; message?: string } => {
    if (pkgData.discount_price >= pkgData.original_price) {
      return { success: false, message: translations[language].invalidPriceErr };
    }
    if (pkgData.quantity <= 0) {
      return { success: false, message: translations[language].invalidQuantityErr };
    }
    if (pkgData.pickup_end <= pkgData.pickup_start) {
      return { success: false, message: translations[language].invalidTimeErr };
    }

    const newPkg: FoodPackage = {
      ...pkgData,
      id: `pkg_${Date.now()}`,
      remaining_quantity: pkgData.quantity,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFoodPackages(prev => [newPkg, ...prev]);

    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: pkgData.store_id,
      user_id: user?.id || '',
      action_vi: 'Tạo gói thực phẩm mới',
      action_en: 'Created new food package',
      details: `${newPkg.title} (${newPkg.discount_price} ₫)`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [log, ...prev]);

    return { success: true };
  };

  const updateFoodPackage = (pkg: FoodPackage): { success: boolean; message?: string } => {
    if (pkg.discount_price >= pkg.original_price) {
      return { success: false, message: translations[language].invalidPriceErr };
    }
    if (pkg.quantity <= 0) {
      return { success: false, message: translations[language].invalidQuantityErr };
    }
    if (pkg.pickup_end <= pkg.pickup_start) {
      return { success: false, message: translations[language].invalidTimeErr };
    }

    const reservedQty = reservations
      .filter(r => r.package_id === pkg.id && r.status !== 'cancelled_by_customer' && r.status !== 'cancelled_by_merchant' && r.status !== 'rejected')
      .reduce((sum, r) => sum + r.quantity, 0);
    const remaining_quantity = Math.max(0, pkg.quantity - reservedQty);
    const nextStatus = remaining_quantity === 0 ? 'sold_out' : pkg.status === 'paused' ? 'paused' : 'available';

    setFoodPackages(prev => prev.map(p => p.id === pkg.id ? { 
      ...pkg, 
      remaining_quantity,
      status: nextStatus, 
      updated_at: new Date().toISOString() 
    } : p));

    return { success: true };
  };

  const togglePausePackage = (packageId: string) => {
    setFoodPackages(prev => prev.map(p => {
      if (p.id === packageId) {
        const nextStatus = p.status === 'paused' ? (p.remaining_quantity === 0 ? 'sold_out' : 'available') : 'paused';
        return { ...p, status: nextStatus, updated_at: new Date().toISOString() };
      }
      return p;
    }));
  };

  const deleteFoodPackage = (packageId: string): { success: boolean; message: string } => {
    const hasActiveReservations = reservations.some(
      r => r.package_id === packageId && (r.status === 'reserved' || r.status === 'confirmed')
    );

    if (hasActiveReservations) {
      return { success: false, message: translations[language].cannotDeleteActiveReservations };
    }

    setFoodPackages(prev => prev.map(p => p.id === packageId ? { ...p, is_deleted: true, updated_at: new Date().toISOString() } : p));
    return { success: true, message: language === 'vi' ? 'Đã xóa gói thực phẩm thành công.' : 'Package deleted successfully.' };
  };

  // ----------------------------------------------------
  // RESERVATION & QR VALIDATION ENGINE
  // ----------------------------------------------------
  const reservePackage = (packageId: string, quantity: number): { success: boolean; reservation?: Reservation; message?: string } => {
    if (!user) {
      return { success: false, message: language === 'vi' ? 'Bạn phải đăng nhập để đặt gói.' : 'You must be logged in to reserve.' };
    }

    if (user.role === 'merchant') {
      return { success: false, message: language === 'vi' ? 'Cửa hàng không thể đặt gói thực phẩm.' : 'Merchants cannot reserve food packages.' };
    }

    const pkg = foodPackages.find(p => p.id === packageId);
    if (!pkg) {
      return { success: false, message: 'Package not found' };
    }

    const targetStore = stores.find(s => s.id === pkg.store_id);
    if (!targetStore) {
      return { success: false, message: 'Store not found' };
    }

    if (targetStore.owner_id === user.id) {
      return { success: false, message: language === 'vi' ? 'Bạn không thể đặt gói thực phẩm từ cửa hàng của chính mình.' : 'You cannot reserve packages from your own store.' };
    }

    const hasDuplicate = reservations.some(r => 
      r.package_id === packageId && 
      r.customer_id === user.id && 
      (r.status === 'reserved' || r.status === 'confirmed')
    );
    if (hasDuplicate) {
      return { success: false, message: language === 'vi' ? 'Bạn đã có một đơn đặt chỗ đang hoạt động cho gói này.' : 'You already have an active reservation for this package.' };
    }

    if (pkg.status === 'paused') {
      return { success: false, message: language === 'vi' ? 'Gói thực phẩm này đang tạm dừng.' : 'This food package is paused.' };
    }

    if (pkg.status === 'expired') {
      return { success: false, message: language === 'vi' ? 'Gói thực phẩm này đã hết hạn.' : 'This food package is expired.' };
    }

    if (pkg.status === 'sold_out' || pkg.remaining_quantity <= 0) {
      return { success: false, message: translations[language].soldOut };
    }

    if (quantity > pkg.remaining_quantity) {
      return { success: false, message: language === 'vi' ? `Số lượng đặt vượt quá tồn kho (${pkg.remaining_quantity}).` : `Quantity exceeds available stock (${pkg.remaining_quantity}).` };
    }

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const resCode = `FL-RES-${codeNum}`;
    const totalPrice = pkg.discount_price * quantity;
    const platformFee = Math.round(totalPrice * 0.05);
    const merchantRevenue = totalPrice - platformFee;

    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      reservation_code: resCode,
      customer_id: user.id,
      customer_name: user.full_name,
      customer_phone: user.phone,
      merchant_id: targetStore.owner_id,
      store_id: targetStore.id,
      package_id: pkg.id,
      package_title: pkg.title,
      package_image: pkg.image,
      store_name: targetStore.store_name,
      store_address: targetStore.address,
      store_district: targetStore.district,
      pickup_time: `${pkg.pickup_start} - ${pkg.pickup_end}`,
      original_price: pkg.original_price,
      discount_price: pkg.discount_price,
      quantity: quantity,
      total_price: totalPrice,
      platform_fee: platformFee,
      merchant_revenue: merchantRevenue,
      status: 'confirmed',
      qr_code: resCode,
      created_at: new Date().toISOString(),
    };

    setFoodPackages(prev => prev.map(p => {
      if (p.id === pkg.id) {
        const nextRem = Math.max(0, p.remaining_quantity - quantity);
        return {
          ...p,
          remaining_quantity: nextRem,
          status: nextRem === 0 ? 'sold_out' : p.status,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    }));

    setReservations(prev => [newReservation, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: user.id,
      title_vi: 'Đặt gói thực phẩm thành công',
      title_en: 'Package Reserved Successfully',
      message_vi: `Đơn hàng ${resCode} tại ${targetStore.store_name} đã sẵn sàng. Mã QR: ${resCode}`,
      message_en: `Reservation ${resCode} at ${targetStore.store_name} is confirmed. QR Code: ${resCode}`,
      type: 'reservation',
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    return { success: true, reservation: newReservation };
  };

  const confirmReservationByMerchant = (reservationId: string) => {
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'confirmed' } : r));
    const res = reservations.find(r => r.id === reservationId);
    if (res) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        user_id: res.customer_id,
        title_vi: 'Đơn hàng được xác nhận',
        title_en: 'Reservation Confirmed',
        message_vi: `Đơn hàng ${res.reservation_code} đã được cửa hàng xác nhận.`,
        message_en: `Your reservation ${res.reservation_code} has been confirmed by the store.`,
        type: 'reservation',
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const cancelReservation = (reservationId: string, reason?: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setFoodPackages(prev => prev.map(p => {
      if (p.id === res.package_id) {
        const nextRem = p.remaining_quantity + res.quantity;
        return {
          ...p,
          remaining_quantity: nextRem,
          status: p.status === 'sold_out' ? 'available' : p.status,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    }));

    const isCust = user?.role === 'customer';
    const nextStatus = isCust ? 'cancelled_by_customer' : 'cancelled_by_merchant';

    setReservations(prev => prev.map(r => r.id === reservationId ? {
      ...r,
      status: nextStatus,
      cancel_reason: reason || 'Cancelled',
      cancelled_at: new Date().toISOString()
    } : r));

    const targetUserId = isCust ? res.merchant_id : res.customer_id;
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: targetUserId,
      title_vi: 'Đơn đặt chỗ đã bị hủy',
      title_en: 'Reservation Cancelled',
      message_vi: `Đơn hàng ${res.reservation_code} tại ${res.store_name} đã bị hủy. Lý do: ${reason || 'Hủy bởi người dùng'}`,
      message_en: `Reservation ${res.reservation_code} at ${res.store_name} has been cancelled. Reason: ${reason || 'Cancelled by user'}`,
      type: 'reservation',
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const validateAndCompleteQR = (inputCode: string): { success: boolean; message: string; reservation?: Reservation } => {
    if (!user || user.role !== 'merchant') {
      return { success: false, message: language === 'vi' ? 'Chỉ chủ cửa hàng mới có thể xác thực QR.' : 'Only the store merchant can validate QR codes.' };
    }

    const cleanCode = inputCode.trim().toUpperCase();
    const targetRes = reservations.find(r => r.qr_code.toUpperCase() === cleanCode || r.reservation_code.toUpperCase() === cleanCode);

    if (!targetRes) {
      return { success: false, message: translations[language].qrInvalidErr };
    }

    const merchantStores = stores.filter(s => s.owner_id === user.id && !s.is_deleted);
    const ownsStore = merchantStores.some(s => s.id === targetRes.store_id);
    if (!ownsStore) {
      return { success: false, message: translations[language].qrUnauthorizedMerchantErr };
    }

    if (targetRes.status === 'completed' || targetRes.status === 'collected') {
      return { success: false, message: translations[language].qrAlreadyUsedErr };
    }

    if (targetRes.status === 'expired') {
      return { success: false, message: translations[language].qrExpiredErr };
    }

    const updatedRes: Reservation = {
      ...targetRes,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };

    setReservations(prev => prev.map(r => r.id === targetRes.id ? updatedRes : r));

    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: targetRes.store_id,
      user_id: user.id,
      action_vi: 'Xác nhận hoàn thành QR',
      action_en: 'Completed QR reservation pickup',
      details: `Mã ${targetRes.reservation_code} - Khách ${targetRes.customer_name}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [log, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: targetRes.customer_id,
      title_vi: 'Đơn hàng đã hoàn thành',
      title_en: 'Reservation Completed',
      message_vi: `Đơn hàng ${targetRes.reservation_code} tại ${targetRes.store_name} đã được xác nhận nhận hàng thành công.`,
      message_en: `Your reservation ${targetRes.reservation_code} at ${targetRes.store_name} has been successfully collected.`,
      type: 'reservation',
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: translations[language].codeValidSuccess, reservation: updatedRes };
  };

  // ----------------------------------------------------
  // REVIEWS & FAVORITES
  // ----------------------------------------------------
  const addReview = (storeId: string, rating: number, comment: string, packageId?: string): { success: boolean; message?: string } => {
    if (!user) {
      return { success: false, message: 'Must be logged in' };
    }

    const completedReservations = reservations.filter(r => 
      r.customer_id === user.id && 
      r.store_id === storeId && 
      (!packageId || r.package_id === packageId) && 
      r.status === 'completed'
    );

    if (completedReservations.length === 0) {
      return { 
        success: false, 
        message: language === 'vi' 
          ? 'Chỉ khách hàng đã mua và hoàn thành đơn hàng mới được đánh giá.' 
          : 'Only customers with completed reservations can submit reviews.' 
      };
    }

    const storeReviews = reviews.filter(r => 
      r.customer_id === user.id && 
      r.store_id === storeId && 
      (!packageId || r.package_id === packageId)
    );

    if (storeReviews.length >= completedReservations.length) {
      return { 
        success: false, 
        message: language === 'vi' 
          ? 'Bạn đã đánh giá cho các đơn hàng đã hoàn thành của gói sản phẩm này.' 
          : 'You have already submitted reviews for all completed reservations of this package.' 
      };
    }

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      customer_id: user.id,
      customer_name: user.full_name,
      customer_avatar: user.avatar,
      store_id: storeId,
      package_id: packageId,
      package_title: foodPackages.find(p => p.id === packageId)?.title,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews(prev => [newRev, ...prev]);

    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        const updatedStoreReviews = [newRev, ...reviews.filter(r => r.store_id === storeId)];
        const avgRating = Number((updatedStoreReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedStoreReviews.length).toFixed(1));
        return {
          ...s,
          rating: avgRating,
          review_count: updatedStoreReviews.length,
          updated_at: new Date().toISOString(),
        };
      }
      return s;
    }));

    const storeObj = stores.find(s => s.id === storeId);
    if (storeObj) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        user_id: storeObj.owner_id,
        title_vi: 'Đánh giá mới',
        title_en: 'New Review Received',
        message_vi: `Khách hàng ${user.full_name} đã gửi đánh giá ${rating}⭐ cho cửa hàng của bạn.`,
        message_en: `Customer ${user.full_name} has submitted a ${rating}⭐ review for your store.`,
        type: 'review',
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return { success: true };
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          merchant_reply: replyText,
          merchant_reply_at: new Date().toISOString(),
        };
      }
      return r;
    }));
  };

  const toggleFavoriteStore = (storeId: string) => {
    if (!user) {
      setAuthRole('customer');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setFavorites(prev => prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]);
  };

  const toggleFavoritePackage = (pkgId: string) => {
    if (!user) {
      setAuthRole('customer');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setFavoritePackages(prev => prev.includes(pkgId) ? prev.filter(id => id !== pkgId) : [...prev, pkgId]);
  };

  const addRecentlyViewed = (pkg: FoodPackage) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== pkg.id);
      return [pkg, ...filtered].slice(0, 10);
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ----------------------------------------------------
  // DYNAMIC ANALYTICS COMPUTATION
  // ----------------------------------------------------
  const getMerchantAnalytics = (dateFilter: DateFilterOption): AnalyticsSummary => {
    const defaultSummary: AnalyticsSummary = {
      today_orders: 0,
      weekly_orders: 0,
      monthly_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      revenue_today: 0,
      revenue_this_month: 0,
      revenue_this_year: 0,
      platform_fee_total: 0,
      actual_merchant_revenue: 0,
      average_order_value: 0,
      best_selling_package_title: '-',
      most_reserved_package_title: '-',
      top_category: '-',
    };

    if (!user || user.role !== 'merchant' || !activeStore) {
      return defaultSummary;
    }

    const storeReservations = reservations.filter(r => r.store_id === activeStore.id);
    const completed = storeReservations.filter(r => r.status === 'completed');

    const totalRevenue = completed.reduce((sum, r) => sum + r.total_price, 0);
    const platformFeeTotal = completed.reduce((sum, r) => sum + r.platform_fee, 0);
    const actualMerchantRevenue = completed.reduce((sum, r) => sum + r.merchant_revenue, 0);
    const avgOrderValue = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

    const now = new Date();
    
    const isToday = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.getDate() === now.getDate() &&
             d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    };

    const isThisWeek = (dateStr: string) => {
      const d = new Date(dateStr);
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0,0,0,0);
      return d >= startOfWeek && d <= now;
    };

    const isThisMonth = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };

    const isThisYear = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.getFullYear() === now.getFullYear();
    };

    const completedToday = completed.filter(r => isToday(r.created_at));
    const completedMonth = completed.filter(r => isThisMonth(r.created_at));
    const completedYear = completed.filter(r => isThisYear(r.created_at));

    // Best selling package
    const pkgSales: Record<string, number> = {};
    completed.forEach(r => {
      pkgSales[r.package_title] = (pkgSales[r.package_title] || 0) + r.quantity;
    });
    let bestSelling = '-';
    let maxSales = 0;
    for (const title in pkgSales) {
      if (pkgSales[title] > maxSales) {
        maxSales = pkgSales[title];
        bestSelling = title;
      }
    }

    // Most reserved package
    const pkgReservations: Record<string, number> = {};
    storeReservations.forEach(r => {
      pkgReservations[r.package_title] = (pkgReservations[r.package_title] || 0) + r.quantity;
    });
    let mostReserved = '-';
    let maxRes = 0;
    for (const title in pkgReservations) {
      if (pkgReservations[title] > maxRes) {
        maxRes = pkgReservations[title];
        mostReserved = title;
      }
    }

    // Top Category
    const categoryLabels: Record<string, string> = {
      bakery: language === 'vi' ? 'Tiệm bánh / Bakery' : 'Bakery',
      restaurant: language === 'vi' ? 'Nhà hàng / Restaurant' : 'Restaurant',
      coffee: language === 'vi' ? 'Cà phê / Coffee' : 'Coffee',
      dessert: language === 'vi' ? 'Tráng miệng / Dessert' : 'Dessert',
      convenience: language === 'vi' ? 'Cửa hàng tiện lợi' : 'Convenience Store',
      supermarket: language === 'vi' ? 'Siêu thị' : 'Supermarket',
    };

    const catCounts: Record<string, number> = {};
    completed.forEach(r => {
      const pkg = foodPackages.find(p => p.id === r.package_id);
      const cat = pkg?.category || 'bakery';
      catCounts[cat] = (catCounts[cat] || 0) + r.quantity;
    });
    let topCat = '-';
    let maxCat = 0;
    for (const cat in catCounts) {
      if (catCounts[cat] > maxCat) {
        maxCat = catCounts[cat];
        topCat = categoryLabels[cat] || cat;
      }
    }

    return {
      today_orders: storeReservations.filter(r => isToday(r.created_at)).length,
      weekly_orders: storeReservations.filter(r => isThisWeek(r.created_at)).length,
      monthly_orders: storeReservations.filter(r => isThisMonth(r.created_at)).length,
      completed_orders: completed.length,
      cancelled_orders: storeReservations.filter(r => r.status.startsWith('cancelled') || r.status === 'rejected').length,
      revenue_today: completedToday.reduce((sum, r) => sum + r.total_price, 0),
      revenue_this_month: completedMonth.reduce((sum, r) => sum + r.total_price, 0),
      revenue_this_year: completedYear.reduce((sum, r) => sum + r.total_price, 0),
      platform_fee_total: platformFeeTotal,
      actual_merchant_revenue: actualMerchantRevenue,
      average_order_value: avgOrderValue,
      best_selling_package_title: bestSelling,
      most_reserved_package_title: mostReserved,
      top_category: topCat,
    };
  };

  const getEcoImpactStats = () => {
    const completedRes = reservations.filter(r => r.status === 'completed');
    const mealsSaved = completedRes.reduce((sum, r) => sum + r.quantity, 0);
    const wastePreventedKg = Math.round(mealsSaved * 0.8);
    const co2ReducedKg = Math.round(wastePreventedKg * 2.5);
    const treesSaved = Math.round(co2ReducedKg / 10);

    return {
      mealsSaved,
      wastePreventedKg,
      co2ReducedKg,
      treesSaved,
    };
  };

  const resetDemoData = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUsers([]);
    setUser(null);
    setStores(INITIAL_STORES);
    setFoodPackages(INITIAL_PACKAGES);
    setReservations([]);
    setFavorites([]);
    setFavoritePackages([]);
    setReviews([]);
    setNotifications([]);
    setActivityLogs([]);
    setActiveTab('home');
    setSelectedStore(null);
    setSelectedPackage(null);
    setActiveReservation(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        setUser,
        users,
        stores,
        activeStore,
        setActiveStoreId,
        foodPackages,
        reservations,
        favorites,
        favoritePackages,
        recentlyViewed,
        reviews,
        notifications,
        activityLogs,
        selectedDistrict,
        setSelectedDistrict,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        activeTab,
        setActiveTab,
        selectedStore,
        setSelectedStore,
        selectedPackage,
        setSelectedPackage,
        activeReservation,
        setActiveReservation,
        authModalOpen,
        setAuthModalOpen,
        authRole,
        setAuthRole,
        authMode,
        setAuthMode,
        verificationPendingEmail,
        setVerificationPendingEmail,
        registerUser,
        loginUser,
        simulateVerifyEmail,
        resendVerificationEmail,
        requestPasswordReset,
        resetPasswordWithToken,
        updateStoreSettings,
        toggleStoreStatus,
        createFoodPackage,
        updateFoodPackage,
        togglePausePackage,
        deleteFoodPackage,
        reservePackage,
        confirmReservationByMerchant,
        cancelReservation,
        validateAndCompleteQR,
        addReview,
        replyToReview,
        toggleFavoriteStore,
        toggleFavoritePackage,
        addRecentlyViewed,
        markNotificationsAsRead,
        resetDemoData,
        getMerchantAnalytics,
        getEcoImpactStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
