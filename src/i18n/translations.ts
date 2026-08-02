import type { Language } from '../types';

export const USD_EXCHANGE_RATE = 25400; // 1 USD = 25,400 VND

export const formatCurrency = (amountVND: number, lang: Language): string => {
  if (lang === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(amountVND) + ' ₫';
  } else {
    const usd = amountVND / USD_EXCHANGE_RATE;
    return '$' + usd.toFixed(2);
  }
};

export const formatDate = (dateStr: string, lang: Language): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (lang === 'vi') {
    return `${day}/${month}/${year}`;
  } else {
    return `${month}/${day}/${year}`;
  }
};

export const formatTime = (timeStr: string, _lang: Language): string => {
  return timeStr;
};

export const translations = {
  vi: {
    // Brand & Header
    appName: 'FoodLoop',
    tagline: 'Kết nối thực phẩm - Giảm lãng phí',
    navHome: 'Trang chủ',
    navBrowse: 'Khám phá cửa hàng',
    navMap: 'Bản đồ Hà Nội',
    navAbout: 'Về chúng tôi',
    navContact: 'Liên hệ',
    buyFood: 'Mua thực phẩm',
    sellFood: 'Bán thực phẩm',
    customerLogin: 'Đăng nhập Khách hàng',
    merchantLogin: 'Đăng nhập Cửa hàng',
    logout: 'Đăng xuất',

    // Hero Section
    heroTitleLine1: 'Cứu thực phẩm.',
    heroTitleLine2: 'Tiết kiệm tiền.',
    heroTitleLine3: 'Bảo vệ Trái đất.',
    heroSubtitle: 'FoodLoop kết nối dư thừa thực phẩm tươi ngon từ nhà hàng, tiệm bánh, siêu thị và quán cà phê khắp các quận Hà Nội đến người dùng với giá giảm đến 70%.',
    exploreDeals: 'Khám phá ưu đãi ngay',
    becomeMerchant: 'Trở thành Đối tác',
    selectDistrict: 'Chọn Quận tại Hà Nội',
    allDistricts: 'Tất cả các quận Hà Nội',

    // Stats & Eco Impact
    statsMealsRescued: 'Bữa ăn đã cứu',
    statsPartnerStores: 'Cửa hàng đối tác',
    statsCustomers: 'Người dùng đồng hành',
    statsWasteReduced: 'Kg thực phẩm đã giảm (CO₂)',
    ecoImpactTitle: 'Tác động môi trường của bạn',
    ecoImpactSub: 'Mỗi gói thực phẩm được cứu giúp giảm bớt 2.5kg khí thải CO₂ ra môi trường Hà Nội.',
    mealsSaved: 'Bữa ăn đã cứu',
    wastePreventedKg: 'Kg thực phẩm lãng phí đã chặn',
    co2ReducedKg: 'Kg CO₂ giảm thải',
    treesSaved: 'Cây xanh tương đương',

    // Categories
    categoriesTitle: 'Danh mục thực phẩm nổi bật',
    catBakery: 'Tiệm bánh',
    catRestaurant: 'Nhà hàng',
    catCoffee: 'Quán cà phê',
    catDessert: 'Tráng miệng',
    catConvenience: 'Cửa hàng tiện lợi',
    catSupermarket: 'Siêu thị',

    // Section Titles
    featuredPackages: 'Gói thực phẩm ưu đãi hôm nay',
    popularStores: 'Cửa hàng phổ biến tại Hà Nội',
    hanoiMapTitle: 'Bản đồ thực phẩm cứu hộ tại Hà Nội',
    hanoiMapSub: 'Tìm các cửa hàng có ưu đãi gần bạn tại các quận Ba Đình, Hoàn Kiếm, Cầu Giấy, Tây Hồ...',

    // Product Card
    originalPrice: 'Giá gốc',
    discountPrice: 'Giá ưu đãi',
    remaining: 'Còn lại',
    packagesLeft: 'túi',
    pickupTime: 'Khung giờ nhận',
    reserveBtn: 'Đặt ngay',
    soldOut: 'Đã hết hàng',
    expired: 'Hết hạn',
    available: 'Còn hàng',
    paused: 'Tạm dừng',
    off: 'GIẢM',

    // Store Card & Details
    rating: 'Đánh giá',
    reviews: 'đánh giá',
    openingHours: 'Giờ mở cửa',
    address: 'Địa chỉ',
    availablePackages: 'Gói thực phẩm mở bán',
    customerReviews: 'Đánh giá từ khách hàng',
    viewStore: 'Xem cửa hàng',
    yourRating: 'Đánh giá sao của bạn',
    yourComment: 'Nhận xét của bạn',

    // Package Modal & Reserve
    packageDetails: 'Chi tiết gói thực phẩm',
    ingredients: 'Thành phần & Lưu ý',
    pickupInstructions: 'Hướng dẫn nhận hàng',
    pickupInstructionText: 'Đến cửa hàng trong khung giờ đã chọn, xuất trình mã QR cho nhân viên và thanh toán tiền mặt trực tiếp.',
    confirmReservation: 'Xác nhận đặt hàng',
    reservationSuccess: 'Đặt gói thực phẩm thành công!',
    payAtStoreNotice: 'Lưu ý: Không thanh toán online. Bạn thanh toán tiền mặt trực tiếp tại cửa hàng khi nhận đồ.',

    // QR & Reservation Flow
    reservationCode: 'Mã đặt chỗ',
    scanQRInstruction: 'Đưa mã QR này cho nhân viên cửa hàng khi đến nhận đồ',
    statusReserved: 'Chờ xác nhận',
    statusConfirmed: 'Đã xác nhận',
    statusCollected: 'Đã nhận đồ',
    statusCompleted: 'Hoàn thành',
    statusExpired: 'Đã hết hạn',
    statusCancelled: 'Đã hủy',
    statusRejected: 'Từ chối',
    cancelReservation: 'Hủy đơn đặt',
    backToDashboard: 'Quay về Tổng quan',
    viewQRCode: 'Xem mã QR',

    // Dashboards Common
    dashboard: 'Tổng quan',
    favorites: 'Danh sách yêu thích',
    myReservations: 'Đơn đặt của tôi',
    reservationHistory: 'Lịch sử đặt đồ',
    myStore: 'Cấu hình Cửa hàng',
    foodPackages: 'Gói thực phẩm',
    analytics: 'Báo cáo & Doanh thu',
    profile: 'Hồ sơ cá nhân',
    recentlyViewed: 'Đã xem gần đây',

    // Customer Dashboard
    custDashTitle: 'Bảng điều khiển Khách hàng',
    welcomeBack: 'Chào mừng trở lại',
    recommendedFood: 'Gợi ý thực phẩm dành cho bạn',
    nearbyStores: 'Cửa hàng gần bạn',
    recentReservations: 'Đơn hàng gần đây',
    popularToday: 'Phổ biến hôm nay',
    noFavorites: 'Bạn chưa lưu cửa hàng hoặc gói thực phẩm yêu thích nào.',
    noReservations: 'Chưa có đơn đặt hàng nào.',

    // Merchant Dashboard
    merchDashTitle: 'Bảng điều khiển Cửa hàng',
    todayReservations: 'Đơn hàng hôm nay',
    packagesAvailable: 'Gói đang mở bán',
    completedOrders: 'Đơn hoàn thành',
    revenueRecovered: 'Doanh thu thu hồi (Ước tính)',
    createPackage: 'Tạo gói thực phẩm mới',
    editPackage: 'Chỉnh sửa gói',
    deletePackage: 'Xóa gói',
    pausePackage: 'Tạm dừng mở bán',
    resumePackage: 'Mở bán lại',
    packageTitle: 'Tên gói thực phẩm',
    description: 'Mô tả chi tiết',
    category: 'Danh mục',
    origPriceVND: 'Giá gốc (VND)',
    discPriceVND: 'Giá giảm (VND)',
    quantity: 'Số lượng khả dụng',
    pickupStart: 'Giờ bắt đầu nhận',
    pickupEnd: 'Giờ kết thúc nhận',
    savePackage: 'Lưu gói thực phẩm',
    cancel: 'Hủy bỏ',
    scanFulfillment: 'Xác nhận mã QR đặt đồ',
    enterCodeOrScan: 'Nhập mã (ví dụ: FL-RES-8921) hoặc Quét QR',
    verifyCodeBtn: 'Xác nhận hoàn thành',
    codeValidSuccess: 'Mã hợp lệ! Đã xác nhận khách nhận hàng thành công.',

    // QR Errors
    qrAlreadyUsedErr: 'Mã QR này đã được sử dụng trước đó!',
    qrExpiredErr: 'Đơn đặt hàng này đã hết hạn!',
    qrInvalidErr: 'Mã QR không hợp lệ hoặc không tồn tại!',
    qrUnauthorizedMerchantErr: 'Mã QR này thuộc về cửa hàng khác!',

    // Store Settings
    storeSettings: 'Cấu hình Cửa hàng',
    storeStatus: 'Trạng thái hoạt động cửa hàng',
    statusOpen: 'Mở cửa (Đang nhận đơn)',
    statusClosed: 'Đóng cửa (Tạm dừng nhận đơn)',
    statusTempClosed: 'Tạm ngưng phục vụ',
    storeClosedWarning: 'Cửa hàng hiện đang đóng cửa. Khách hàng tạm thời không thể đặt gói.',
    businessName: 'Tên Doanh nghiệp / Công ty',
    ownerName: 'Tên chủ sở hữu',
    storeName: 'Tên cửa hàng (Hiển thị)',
    storeLogo: 'Logo Cửa hàng',
    storeCover: 'Ảnh bìa Cửa hàng',
    businessCategory: 'Ngành hàng chính',
    district: 'Quận / Huyện (Hà Nội)',
    addressDetail: 'Địa chỉ chi tiết',
    phone: 'Số điện thoại liên hệ',
    email: 'Email cửa hàng',
    openingHoursText: 'Giờ mở cửa tổng quan',
    pickupInstructionsText: 'Hướng dẫn nhận hàng cho khách',
    websiteUrl: 'Địa chỉ Website',
    facebookUrl: 'Trang Facebook',
    googleMapsUrl: 'Link Google Maps',
    saveStoreSettings: 'Lưu thay đổi Cửa hàng',
    previewStore: 'Xem trang cửa hàng',

    // Financial & Analytics
    platformFee: 'Phí nền tảng FoodLoop (5%)',
    actualMerchantRevenue: 'Doanh thu thực nhận cửa hàng (95%)',
    averageOrderValue: 'Giá trị đơn trung bình',
    bestSellingPackage: 'Gói bán chạy nhất',
    mostReservedPackage: 'Gói được đặt nhiều nhất',
    topCategory: 'Danh mục ưa chuộng nhất',
    dateFilter: 'Khoảng thời gian',
    filterToday: 'Hôm nay',
    filterThisWeek: 'Tuần này',
    filterThisMonth: 'Tháng này',
    filterLastMonth: 'Tháng trước',
    filterCustom: 'Tùy chỉnh',
    monthlyRevenueChart: 'Biểu đồ Doanh thu (VND)',
    ordersVolumeChart: 'Số lượng đơn hàng hoàn thành',
    categoryDistChart: 'Phân bố doanh thu theo Danh mục',
    recentTransactions: 'Giao dịch hoàn thành gần nhất',
    activityLogTitle: 'Nhật ký hoạt động gần đây',
    noActivityLogs: 'Chưa có nhật ký hoạt động nào.',

    // Auth Forms & Verification
    loginTitle: 'Đăng nhập',
    registerTitle: 'Tạo tài khoản mới',
    fullName: 'Họ và tên',
    password: 'Mật khẩu',
    submitLogin: 'Đăng nhập ngay',
    submitRegister: 'Đăng ký tài khoản',
    alreadyHaveAccount: 'Đã có tài khoản?',
    dontHaveAccount: 'Chưa có tài khoản?',
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    resetPassword: 'Đặt lại mật khẩu',
    sendResetLink: 'Gửi liên kết khôi phục',
    newPassword: 'Mật khẩu mới',
    changePassword: 'Đổi mật khẩu',
    passwordRequirements: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*).',
    pendingVerificationTitle: 'Xác minh Email tài khoản',
    pendingVerificationMsg: 'Vui lòng xác minh địa chỉ email của bạn để đăng nhập.',
    simulateVerifyBtn: 'Mô phỏng kích hoạt Email',
    resendVerification: 'Gửi lại email xác minh',
    emailExistsErr: 'Địa chỉ email này đã được sử dụng!',
    phoneExistsErr: 'Số điện thoại này đã được đăng ký!',
    invalidPasswordErr: 'Mật khẩu không đạt yêu cầu bảo mật!',

    // Validation & Delete Protection
    invalidPriceErr: 'Giá giảm phải nhỏ hơn giá gốc!',
    invalidQuantityErr: 'Số lượng phải lớn hơn 0!',
    invalidTimeErr: 'Giờ kết thúc nhận phải sau giờ bắt đầu!',
    cannotDeleteActiveReservations: 'Không thể xóa gói thực phẩm đang có đơn đặt chờ nhận!',

    // Search & Filter
    searchPlaceholder: 'Tìm kiếm gói thực phẩm, tên cửa hàng, địa chỉ...',
    filterByDistrict: 'Lọc theo Quận',
    filterByCategory: 'Lọc theo Danh mục',
    filterByPrice: 'Lọc theo Giá',
    allPrices: 'Tất cả mức giá',
    resetFilters: 'Xóa bộ lọc',
    noResults: 'Không tìm thấy kết quả nào phù hợp tại Hà Nội.',

    // Notifications & Reviews
    notifications: 'Thông báo',
    noNotifications: 'Không có thông báo mới.',
    markAllRead: 'Đánh dấu tất cả đã đọc',
    writeReview: 'Đánh giá gói thực phẩm',
    reviewRating: 'Đánh giá sao',
    reviewComment: 'Nhận xét của bạn',
    submitReview: 'Gửi đánh giá',
    merchantReply: 'Cửa hàng phản hồi',
    replyPlaceholder: 'Nhập phản hồi đến khách hàng...',
    replyBtn: 'Gửi phản hồi',
    reviewsTitle: 'Đánh giá từ khách hàng',
    noReviewsYet: 'Chưa có đánh giá nào cho cửa hàng.',

    // Footer & Links
    footerDesc: 'Nền tảng cứu hộ thực phẩm dư thừa hàng đầu tại Hà Nội. Kết nối đối tác kinh doanh và người tiêu dùng để giảm thiểu lãng phí thực phẩm.',
    quickLinks: 'Liên kết nhanh',
    hanoiDistricts: 'Khu vực phủ sóng Hà Nội',
    privacyPolicy: 'Chính sách bảo mật',
    termsOfService: 'Điều khoản sử dụng',
    rightsReserved: 'Tất cả quyền được bảo lưu.',
    
    // Demo switcher bar
    demoBarLabel: 'Chế độ Demo:',
    demoRoleGuest: 'Khách (Landing Page)',
    demoRoleCustomer: 'Khách mua (Minh Anh)',
    demoRoleMerchant: 'Cửa hàng (Tous Les Jours)',
    resetDemoData: 'Khôi phục dữ liệu Demo'
  },
  en: {
    // Brand & Header
    appName: 'FoodLoop',
    tagline: 'Closing the Loop on Food Waste',
    navHome: 'Home',
    navBrowse: 'Browse Stores',
    navMap: 'Hanoi Map',
    navAbout: 'About Us',
    navContact: 'Contact',
    buyFood: 'Buy Surplus Food',
    sellFood: 'Sell Surplus Food',
    customerLogin: 'Customer Login',
    merchantLogin: 'Merchant Login',
    logout: 'Logout',

    // Hero Section
    heroTitleLine1: 'Save Food.',
    heroTitleLine2: 'Save Money.',
    heroTitleLine3: 'Save the Planet.',
    heroSubtitle: 'FoodLoop connects surplus fresh food from restaurants, bakeries, supermarkets, and cafes across Hanoi with eco-conscious consumers at up to 70% off.',
    exploreDeals: 'Explore Deals Now',
    becomeMerchant: 'Become a Partner',
    selectDistrict: 'Select Hanoi District',
    allDistricts: 'All Hanoi Districts',

    // Stats & Eco Impact
    statsMealsRescued: 'Meals Rescued',
    statsPartnerStores: 'Partner Stores',
    statsCustomers: 'Active Customers',
    statsWasteReduced: 'Kg Food Waste Reduced',
    ecoImpactTitle: 'Your Environmental Impact',
    ecoImpactSub: 'Every rescued surplus meal prevents ~2.5kg of CO₂ emissions in Hanoi.',
    mealsSaved: 'Meals Rescued',
    wastePreventedKg: 'Kg Waste Prevented',
    co2ReducedKg: 'Kg CO₂ Avoided',
    treesSaved: 'Equivalent Trees Saved',

    // Categories
    categoriesTitle: 'Featured Food Categories',
    catBakery: 'Bakery',
    catRestaurant: 'Restaurant',
    catCoffee: 'Coffee & Drinks',
    catDessert: 'Desserts',
    catConvenience: 'Convenience Store',
    catSupermarket: 'Supermarket',

    // Section Titles
    featuredPackages: 'Today\'s Featured Surplus Deals',
    popularStores: 'Popular Stores in Hanoi',
    hanoiMapTitle: 'Surplus Food Rescue Map in Hanoi',
    hanoiMapSub: 'Locate nearby food surplus partners in Ba Dinh, Hoan Kiem, Cau Giay, Tay Ho...',

    // Product Card
    originalPrice: 'Original Price',
    discountPrice: 'Discount Price',
    remaining: 'Remaining',
    packagesLeft: 'left',
    pickupTime: 'Pickup Hours',
    reserveBtn: 'Reserve Now',
    soldOut: 'Sold Out',
    expired: 'Expired',
    available: 'Available',
    paused: 'Paused',
    off: 'OFF',

    // Store Card & Details
    rating: 'Rating',
    reviews: 'reviews',
    openingHours: 'Opening Hours',
    address: 'Address',
    availablePackages: 'Available Packages',
    customerReviews: 'Customer Reviews',
    viewStore: 'View Store',
    yourRating: 'Your Star Rating',
    yourComment: 'Your Review Comment',

    // Package Modal & Reserve
    packageDetails: 'Package Details',
    ingredients: 'Ingredients & Notes',
    pickupInstructions: 'Pickup Instructions',
    pickupInstructionText: 'Arrive at the store during designated pickup hours, present your QR code, and pay cash directly at the counter.',
    confirmReservation: 'Confirm Reservation',
    reservationSuccess: 'Package Reserved Successfully!',
    payAtStoreNotice: 'Note: Cash on pickup only. Pay directly at the store counter.',

    // QR & Reservation Flow
    reservationCode: 'Reservation Code',
    scanQRInstruction: 'Present this QR code to merchant staff when collecting your package',
    statusReserved: 'Pending Confirmation',
    statusConfirmed: 'Confirmed',
    statusCollected: 'Collected',
    statusCompleted: 'Completed',
    statusExpired: 'Expired',
    statusCancelled: 'Cancelled',
    statusRejected: 'Rejected',
    cancelReservation: 'Cancel Reservation',
    backToDashboard: 'Back to Dashboard',
    viewQRCode: 'View QR Code',

    // Dashboards Common
    dashboard: 'Dashboard',
    favorites: 'Favorite Stores',
    myReservations: 'My Reservations',
    reservationHistory: 'Reservation History',
    myStore: 'Store Configuration',
    foodPackages: 'Food Packages',
    analytics: 'Analytics & Revenue',
    profile: 'User Profile',
    recentlyViewed: 'Recently Viewed',

    // Customer Dashboard
    custDashTitle: 'Customer Dashboard',
    welcomeBack: 'Welcome back',
    recommendedFood: 'Recommended Surplus Packages',
    nearbyStores: 'Stores Near You',
    recentReservations: 'Recent Reservations',
    popularToday: 'Popular Today',
    noFavorites: 'You have not favorited any stores or packages yet.',
    noReservations: 'No active reservations found.',

    // Merchant Dashboard
    merchDashTitle: 'Merchant Dashboard',
    todayReservations: 'Today Reservations',
    packagesAvailable: 'Packages Live',
    completedOrders: 'Completed Orders',
    revenueRecovered: 'Est. Revenue Recovered',
    createPackage: 'Create Food Package',
    editPackage: 'Edit Package',
    deletePackage: 'Delete Package',
    pausePackage: 'Pause Sales',
    resumePackage: 'Resume Sales',
    packageTitle: 'Package Title',
    description: 'Description',
    category: 'Category',
    origPriceVND: 'Original Price (VND)',
    discPriceVND: 'Discount Price (VND)',
    quantity: 'Quantity Available',
    pickupStart: 'Pickup Start Time',
    pickupEnd: 'Pickup End Time',
    savePackage: 'Save Package',
    cancel: 'Cancel',
    scanFulfillment: 'Scan / Validate QR Code',
    enterCodeOrScan: 'Enter Code (e.g. FL-RES-8921) or scan QR',
    verifyCodeBtn: 'Complete Pickup',
    codeValidSuccess: 'Valid Code! Package marked as collected.',

    // QR Errors
    qrAlreadyUsedErr: 'This QR code has already been scanned & completed!',
    qrExpiredErr: 'This reservation has expired!',
    qrInvalidErr: 'Invalid or non-existent QR Code!',
    qrUnauthorizedMerchantErr: 'This QR code belongs to a different store!',

    // Store Settings
    storeSettings: 'Store Configuration',
    storeStatus: 'Store Operational Status',
    statusOpen: 'Open (Accepting Reservations)',
    statusClosed: 'Closed (Reservations Disabled)',
    statusTempClosed: 'Temporarily Closed',
    storeClosedWarning: 'This store is currently closed. Customers cannot reserve packages.',
    businessName: 'Business / Company Name',
    ownerName: 'Owner Name',
    storeName: 'Store Name (Display)',
    storeLogo: 'Store Logo',
    storeCover: 'Store Cover Image',
    businessCategory: 'Primary Business Category',
    district: 'Hanoi District',
    addressDetail: 'Street Address',
    phone: 'Contact Phone',
    email: 'Store Email',
    openingHoursText: 'General Opening Hours',
    pickupInstructionsText: 'Pickup Instructions for Customers',
    websiteUrl: 'Website URL',
    facebookUrl: 'Facebook Page URL',
    googleMapsUrl: 'Google Maps Link',
    saveStoreSettings: 'Save Store Settings',
    previewStore: 'Preview Public Store Page',

    // Financial & Analytics
    platformFee: 'FoodLoop Platform Fee (5%)',
    actualMerchantRevenue: 'Net Merchant Revenue (95%)',
    averageOrderValue: 'Avg Order Value',
    bestSellingPackage: 'Best Selling Package',
    mostReservedPackage: 'Most Reserved Package',
    topCategory: 'Top Food Category',
    dateFilter: 'Time Range',
    filterToday: 'Today',
    filterThisWeek: 'This Week',
    filterThisMonth: 'This Month',
    filterLastMonth: 'Last Month',
    filterCustom: 'Custom Range',
    monthlyRevenueChart: 'Revenue Over Time (VND)',
    ordersVolumeChart: 'Completed Orders Count',
    categoryDistChart: 'Sales Breakdown by Category',
    recentTransactions: 'Recent Completed Transactions',
    activityLogTitle: 'Recent Activity Logs',
    noActivityLogs: 'No activity logs found.',

    // Auth Forms & Verification
    loginTitle: 'Sign In',
    registerTitle: 'Create New Account',
    fullName: 'Full Name',
    password: 'Password',
    submitLogin: 'Login',
    submitRegister: 'Register Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    newPassword: 'New Password',
    changePassword: 'Change Password',
    passwordRequirements: 'Password must be at least 8 characters long, with uppercase, lowercase, numbers, and special characters (!@#$%^&*).',
    pendingVerificationTitle: 'Email Verification Required',
    pendingVerificationMsg: 'Please verify your email address before logging in.',
    simulateVerifyBtn: 'Simulate Email Verification',
    resendVerification: 'Resend Verification Email',
    emailExistsErr: 'This email address is already registered!',
    phoneExistsErr: 'This phone number is already registered!',
    invalidPasswordErr: 'Password does not meet security requirements!',

    // Validation & Delete Protection
    invalidPriceErr: 'Discount price must be less than original price!',
    invalidQuantityErr: 'Quantity must be greater than 0!',
    invalidTimeErr: 'Pickup end time must be after start time!',
    cannotDeleteActiveReservations: 'Cannot delete a package with active pending reservations!',

    // Search & Filter
    searchPlaceholder: 'Search food packages, store names, addresses...',
    filterByDistrict: 'Filter by District',
    filterByCategory: 'Filter by Category',
    filterByPrice: 'Filter by Price',
    allPrices: 'All Price Ranges',
    resetFilters: 'Reset Filters',
    noResults: 'No Hanoi stores or packages found matching criteria.',

    // Notifications & Reviews
    notifications: 'Notifications',
    noNotifications: 'No new notifications.',
    markAllRead: 'Mark all as read',
    writeReview: 'Write a Review',
    reviewRating: 'Star Rating',
    reviewComment: 'Your Review Comment',
    submitReview: 'Submit Review',
    merchantReply: 'Store Owner Reply',
    replyPlaceholder: 'Type reply to customer...',
    replyBtn: 'Post Reply',
    reviewsTitle: 'Customer Reviews',
    noReviewsYet: 'No customer reviews yet.',

    // Footer & Links
    footerDesc: 'Leading surplus food marketplace in Hanoi. Connecting stores and consumers to eliminate food waste.',
    quickLinks: 'Quick Links',
    hanoiDistricts: 'Hanoi Coverage',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    rightsReserved: 'All rights reserved.',
    
    // Demo switcher bar
    demoBarLabel: 'Demo View Mode:',
    demoRoleGuest: 'Guest (Landing)',
    demoRoleCustomer: 'Customer (Minh Anh)',
    demoRoleMerchant: 'Merchant (Tous Les Jours)',
    resetDemoData: 'Reset Demo Data'
  }
};
