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
  INITIAL_USERS, 
  INITIAL_STORES, 
  INITIAL_PACKAGES, 
  INITIAL_RESERVATIONS,
  INITIAL_REVIEWS,
  INITIAL_ACTIVITY_LOGS
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
  ACTIVE_STORE_ID: 'foodloop_hanoi_active_store_v2',
  PACKAGES: 'foodloop_hanoi_packages_v2',
  RESERVATIONS: 'foodloop_hanoi_reservations_v2',
  FAVORITES: 'foodloop_hanoi_fav_stores_v2',
  FAV_PACKAGES: 'foodloop_hanoi_fav_packages_v2',
  RECENTLY_VIEWED: 'foodloop_hanoi_recently_viewed_v2',
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
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  // Stores & Active Store
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORES);
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [activeStoreId, setActiveStoreIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE_ID);
    return saved || 'str_1';
  });

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE_ID, id);
  };

  const activeStore = useMemo(() => {
    if (!user || user.role !== 'merchant') return stores[0] || null;
    const merchantStores = stores.filter(s => s.owner_id === user.id && !s.is_deleted);
    return merchantStores.find(s => s.id === activeStoreId) || merchantStores[0] || stores[0] || null;
  }, [stores, user, activeStoreId]);

  // Packages & Soft Delete filtering
  const [foodPackages, setFoodPackages] = useState<FoodPackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (!saved) return INITIAL_PACKAGES;
    try {
      const parsed: FoodPackage[] = JSON.parse(saved);
      return parsed.map(p => {
        const init = INITIAL_PACKAGES.find(ip => ip.id === p.id);
        if (init) {
          return { ...p, image: init.image };
        }
        return p;
      });
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  // Favorites & Social
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritePackages, setFavoritePackages] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAV_PACKAGES);
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<FoodPackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif_1',
        user_id: 'usr_cust_1',
        title_vi: 'Đơn hàng đã được xác nhận',
        title_en: 'Reservation Confirmed',
        message_vi: 'Đơn đặt FL-RES-8921 tại Tous Les Jours đã sẵn sàng cho bạn đến nhận!',
        message_en: 'Your reservation FL-RES-8921 at Tous Les Jours is confirmed and ready for pickup!',
        type: 'reservation',
        read: false,
        created_at: new Date().toISOString(),
      }
    ];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
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
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

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
  // ADVANCED AUTHENTICATION WORKFLOW
  // ----------------------------------------------------
  const validatePassword = (pwd: string): boolean => {
    // Min 8 chars, Uppercase, Lowercase, Number, Special char
    const minLen = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return minLen && hasUpper && hasLower && hasNum && hasSpecial;
  };

  const registerUser = (userData: Partial<User>, password: string): { success: boolean; message?: string } => {
    // 1. Password complexity check
    if (!validatePassword(password)) {
      return { success: false, message: translations[language].invalidPasswordErr };
    }

    // 2. Unique Email & Phone Check
    const emailExists = users.some(u => u.email.toLowerCase() === (userData.email || '').toLowerCase());
    if (emailExists) {
      return { success: false, message: translations[language].emailExistsErr };
    }

    const phoneExists = users.some(u => u.phone === userData.phone);
    if (phoneExists) {
      return { success: false, message: translations[language].phoneExistsErr };
    }

    // Create User with Pending Verification
    const verificationToken = `token_${Date.now()}`;
    const newUser: User = {
      id: `usr_${userData.role}_${Date.now()}`,
      full_name: userData.full_name || 'Hanoi User',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      district: userData.district || 'Hoàn Kiếm',
      verification_status: 'pending',
      verification_token: verificationToken,
      verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setVerificationPendingEmail(newUser.email);
    setAuthMode('pending_verification');

    return { success: true };
  };

  const loginUser = (email: string, _password: string, rememberMe = false): { success: boolean; message?: string } => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      return { success: false, message: language === 'vi' ? 'Email hoặc mật khẩu không chính xác.' : 'Invalid email or password.' };
    }

    if (existing.verification_status === 'pending') {
      setVerificationPendingEmail(existing.email);
      setAuthMode('pending_verification');
      return { success: false, message: translations[language].pendingVerificationMsg };
    }

    const updatedUser = { ...existing, remember_me: rememberMe };
    setUser(updatedUser);
    setAuthModalOpen(false);

    if (updatedUser.role === 'customer') {
      setActiveTab('customer-dashboard');
    } else {
      setActiveTab('merchant-dashboard');
    }

    return { success: true };
  };

  const simulateVerifyEmail = (email: string) => {
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, verification_status: 'active', verification_token: undefined };
      }
      return u;
    }));
    setAuthMode('login');
  };

  const resendVerificationEmail = (email: string) => {
    const token = `token_resend_${Date.now()}`;
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          verification_token: token,
          verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      }
      return u;
    }));
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string } => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      return { success: false, message: language === 'vi' ? 'Không tìm thấy tài khoản với email này.' : 'No user found with this email.' };
    }
    setAuthMode('reset');
    return { success: true, message: language === 'vi' ? 'Liên kết khôi phục đã được gửi vào email của bạn!' : 'Reset password link sent to your email!' };
  };

  const resetPasswordWithToken = (newPassword: string): { success: boolean; message: string } => {
    if (!validatePassword(newPassword)) {
      return { success: false, message: translations[language].invalidPasswordErr };
    }
    setAuthMode('login');
    return { success: true, message: language === 'vi' ? 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' : 'Password reset successful! Please log in.' };
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

    // Add activity log
    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: activeStore.id,
      user_id: user?.id || 'usr_merchant',
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
    // Validation
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
      status: pkgData.quantity === 0 ? 'sold_out' : 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFoodPackages(prev => [newPkg, ...prev]);

    // Activity Log
    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: pkgData.store_id,
      user_id: user?.id || 'usr_merchant',
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
    if (pkg.quantity < 0) {
      return { success: false, message: translations[language].invalidQuantityErr };
    }
    if (pkg.pickup_end <= pkg.pickup_start) {
      return { success: false, message: translations[language].invalidTimeErr };
    }

    const nextStatus = pkg.remaining_quantity === 0 ? 'sold_out' : pkg.status === 'paused' ? 'paused' : 'available';

    setFoodPackages(prev => prev.map(p => p.id === pkg.id ? { ...pkg, status: nextStatus, updated_at: new Date().toISOString() } : p));
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
    // Cannot delete package with active pending or confirmed reservations!
    const hasActiveReservations = reservations.some(
      r => r.package_id === packageId && (r.status === 'reserved' || r.status === 'confirmed')
    );

    if (hasActiveReservations) {
      return { success: false, message: translations[language].cannotDeleteActiveReservations };
    }

    // Soft Delete
    setFoodPackages(prev => prev.map(p => p.id === packageId ? { ...p, is_deleted: true, updated_at: new Date().toISOString() } : p));
    return { success: true, message: language === 'vi' ? 'Đã xóa gói thực phẩm thành công.' : 'Package deleted successfully.' };
  };

  // ----------------------------------------------------
  // RESERVATION & QR VALIDATION ENGINE
  // ----------------------------------------------------
  const reservePackage = (packageId: string, quantity: number): { success: boolean; reservation?: Reservation; message?: string } => {
    const pkg = foodPackages.find(p => p.id === packageId);
    if (!pkg) return { success: false, message: 'Package not found' };

    const targetStore = stores.find(s => s.id === pkg.store_id);
    if (!targetStore || targetStore.status !== 'open') {
      return { success: false, message: translations[language].storeClosedWarning };
    }

    if (pkg.status === 'sold_out' || pkg.remaining_quantity < quantity) {
      return { success: false, message: translations[language].soldOut };
    }

    if (pkg.status === 'expired' || pkg.status === 'paused') {
      return { success: false, message: translations[language].expired };
    }

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const resCode = `FL-RES-${codeNum}`;
    const totalPrice = pkg.discount_price * quantity;
    const platformFee = Math.round(totalPrice * 0.05);
    const merchantRevenue = totalPrice - platformFee;

    const newReservation: Reservation = {
      id: `res_${Date.now()}`,
      reservation_code: resCode,
      customer_id: user?.id || 'usr_cust_1',
      customer_name: user?.full_name || 'Khách hàng Hà Nội',
      customer_phone: user?.phone || '0988123456',
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

    // Stock auto reduction
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

    // Customer Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: user?.id || 'usr_cust_1',
      title_vi: 'Đặt gói thực phẩm thành công',
      title_en: 'Package Reserved Successfully',
      message_vi: `Đơn hàng ${resCode} tại ${targetStore.store_name} đã sẵn sàng. Mã QR: ${resCode}`,
      message_en: `Reservation ${resCode} at ${targetStore.store_name} is confirmed. QR Code: ${resCode}`,
      type: 'reservation',
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    // Confetti celebration
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
  };

  const cancelReservation = (reservationId: string, reason?: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    // Restore package quantity
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
      cancel_reason: reason || 'Cancelled by user',
      cancelled_at: new Date().toISOString()
    } : r));
  };

  const validateAndCompleteQR = (inputCode: string): { success: boolean; message: string; reservation?: Reservation } => {
    const cleanCode = inputCode.trim().toUpperCase();
    const targetRes = reservations.find(r => r.qr_code.toUpperCase() === cleanCode || r.reservation_code.toUpperCase() === cleanCode);

    if (!targetRes) {
      return { success: false, message: translations[language].qrInvalidErr };
    }

    // Verify Merchant / Store ownership
    if (activeStore && targetRes.store_id !== activeStore.id) {
      return { success: false, message: translations[language].qrUnauthorizedMerchantErr };
    }

    if (targetRes.status === 'completed' || targetRes.status === 'collected') {
      return { success: false, message: translations[language].qrAlreadyUsedErr };
    }

    if (targetRes.status === 'expired') {
      return { success: false, message: translations[language].qrExpiredErr };
    }

    // Complete Reservation
    const updatedRes: Reservation = {
      ...targetRes,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };

    setReservations(prev => prev.map(r => r.id === targetRes.id ? updatedRes : r));

    // Activity Log
    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      store_id: targetRes.store_id,
      user_id: user?.id || 'usr_merchant',
      action_vi: 'Xác nhận hoàn thành QR',
      action_en: 'Completed QR reservation pickup',
      details: `Mã ${targetRes.reservation_code} - Khách ${targetRes.customer_name}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [log, ...prev]);

    return { success: true, message: translations[language].codeValidSuccess, reservation: updatedRes };
  };

  // ----------------------------------------------------
  // REVIEWS & FAVORITES
  // ----------------------------------------------------
  const addReview = (storeId: string, rating: number, comment: string, packageId?: string): { success: boolean; message?: string } => {
    if (!user) return { success: false, message: 'Must be logged in' };

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      customer_id: user.id,
      customer_name: user.full_name,
      customer_avatar: user.avatar,
      store_id: storeId,
      package_id: packageId,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate Store rating & review_count
    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        const storeRevs = [...reviews.filter(r => r.store_id === storeId), newRev];
        const avgRating = Number((storeRevs.reduce((acc, curr) => acc + curr.rating, 0) / storeRevs.length).toFixed(1));
        return {
          ...s,
          rating: avgRating,
          review_count: storeRevs.length,
          updated_at: new Date().toISOString(),
        };
      }
      return s;
    }));

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
  const getMerchantAnalytics = (_dateFilter: DateFilterOption): AnalyticsSummary => {
    const merchantStores = user?.role === 'merchant' ? stores.filter(s => s.owner_id === user.id) : [];
    const merchantStoreIds = merchantStores.map(s => s.id);
    const storeId = (activeStore && activeStore.owner_id === user?.id) ? activeStore.id : (merchantStoreIds[0] || null);

    const storeReservations = storeId ? reservations.filter(r => r.store_id === storeId) : [];
    const completed = storeReservations.filter(r => r.status === 'completed');

    const totalRevenue = completed.reduce((sum, r) => sum + r.total_price, 0);
    const platformFeeTotal = completed.reduce((sum, r) => sum + r.platform_fee, 0);
    const actualMerchantRevenue = completed.reduce((sum, r) => sum + r.merchant_revenue, 0);
    const avgOrderValue = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

    return {
      today_orders: storeReservations.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length,
      weekly_orders: storeReservations.length,
      monthly_orders: storeReservations.length,
      completed_orders: completed.length,
      cancelled_orders: storeReservations.filter(r => r.status.includes('cancelled')).length,
      revenue_today: completed.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).reduce((sum, r) => sum + r.total_price, 0),
      revenue_this_month: totalRevenue,
      revenue_this_year: totalRevenue,
      platform_fee_total: platformFeeTotal,
      actual_merchant_revenue: actualMerchantRevenue,
      average_order_value: avgOrderValue,
      best_selling_package_title: completed[0]?.package_title || 'Túi Bánh Mì Pastry Pháp',
      most_reserved_package_title: storeReservations[0]?.package_title || 'Túi Bánh Mì Pastry Pháp',
      top_category: 'Tiệm bánh / Bakery',
    };
  };

  const getEcoImpactStats = () => {
    const completedCount = reservations.filter(r => r.status === 'completed').length;
    const totalMealsSaved = completedCount + 1240; // Base baseline + completed
    const wastePreventedKg = Math.round(totalMealsSaved * 0.8);
    const co2ReducedKg = Math.round(wastePreventedKg * 2.5);
    const treesSaved = Math.round(co2ReducedKg / 10);

    return {
      mealsSaved: totalMealsSaved,
      wastePreventedKg,
      co2ReducedKg,
      treesSaved,
    };
  };

  const resetDemoData = () => {
    localStorage.clear();
    setLanguageState('vi');
    setUserState(INITIAL_USERS[0]);
    setUsers(INITIAL_USERS);
    setStores(INITIAL_STORES);
    setActiveStoreIdState('str_1');
    setFoodPackages(INITIAL_PACKAGES);
    setReservations(INITIAL_RESERVATIONS);
    setFavorites(['str_1']);
    setFavoritePackages(['pkg_1']);
    setReviews(INITIAL_REVIEWS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
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
