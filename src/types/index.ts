export type Role = 'customer' | 'merchant';

export type Language = 'vi' | 'en';

export type UserVerificationStatus = 'pending' | 'active';

export type DistrictName = 
  | 'Ba Đình'
  | 'Hoàn Kiếm'
  | 'Đống Đa'
  | 'Hai Bà Trưng'
  | 'Cầu Giấy'
  | 'Thanh Xuân'
  | 'Tây Hồ'
  | 'Long Biên'
  | 'Nam Từ Liêm'
  | 'Hà Đông';

export type FoodCategory = 
  | 'bakery'
  | 'restaurant'
  | 'coffee'
  | 'dessert'
  | 'convenience'
  | 'supermarket';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  district?: DistrictName;
  verification_status: UserVerificationStatus;
  verification_token?: string;
  verification_expires_at?: string;
  created_at: string;
  remember_me?: boolean;
}

export type StoreStatus = 'open' | 'closed' | 'temp_closed';

export interface StoreDayHours {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  open: string;
  close: string;
  closed: boolean;
}

export interface Store {
  id: string;
  owner_id: string;
  business_name: string;
  owner_name: string;
  store_name: string;
  business_category: FoodCategory;
  description: string;
  district: DistrictName;
  address: string;
  email: string;
  phone: string;
  opening_hours: string; // Summary string or detailed
  day_hours?: StoreDayHours[];
  pickup_instructions?: string;
  website?: string;
  facebook?: string;
  google_maps_url?: string;
  logo: string;
  cover_image: string;
  status: StoreStatus;
  rating: number;
  review_count: number;
  categories: FoodCategory[];
  lat: number;
  lng: number;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
}

export type PackageStatus = 'available' | 'reserved' | 'sold_out' | 'expired' | 'paused';

export interface FoodPackage {
  id: string;
  store_id: string;
  title: string;
  description: string;
  category: FoodCategory;
  original_price: number; // in VND
  discount_price: number; // in VND
  quantity: number;
  remaining_quantity: number;
  image: string;
  pickup_start: string; // HH:mm
  pickup_end: string;   // HH:mm
  status: PackageStatus;
  ingredients?: string;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
}

export type ReservationStatus = 
  | 'reserved'
  | 'confirmed'
  | 'collected'
  | 'completed'
  | 'expired'
  | 'cancelled_by_customer'
  | 'cancelled_by_merchant'
  | 'rejected';

export interface Reservation {
  id: string;
  reservation_code: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  merchant_id: string;
  store_id: string;
  package_id: string;
  package_title: string;
  package_image: string;
  store_name: string;
  store_address: string;
  store_district: DistrictName;
  pickup_time: string;
  original_price: number;
  discount_price: number;
  quantity: number;
  total_price: number;
  platform_fee: number;      // 5% of total_price
  merchant_revenue: number;  // 95% of total_price
  status: ReservationStatus;
  qr_code: string;
  cancel_reason?: string;
  created_at: string;
  completed_at?: string;
  cancelled_at?: string;
  is_deleted?: boolean;
}

export interface Favorite {
  id: string;
  customer_id: string;
  store_id?: string;
  package_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  store_id: string;
  package_id?: string;
  package_title?: string;
  rating: number;
  comment: string;
  images?: string[];
  merchant_reply?: string;
  merchant_reply_at?: string;
  created_at: string;
  is_deleted?: boolean;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title_vi: string;
  title_en: string;
  message_vi: string;
  message_en: string;
  type: 'reservation' | 'package' | 'review' | 'system';
  read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  store_id: string;
  user_id: string;
  action_vi: string;
  action_en: string;
  details: string;
  timestamp: string;
}

export type DateFilterOption = 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';

export interface AnalyticsSummary {
  today_orders: number;
  weekly_orders: number;
  monthly_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  revenue_today: number;
  revenue_this_month: number;
  revenue_this_year: number;
  platform_fee_total: number;
  actual_merchant_revenue: number;
  average_order_value: number;
  best_selling_package_title: string;
  most_reserved_package_title: string;
  top_category: string;
}
