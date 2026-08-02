import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { HANOI_DISTRICTS } from '../data/hanoiData';
import type { DistrictName, Role } from '../types';
import { 
  Recycle, 
  MapPin, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Heart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    user, 
    setUser, 
    notifications, 
    selectedDistrict, 
    setSelectedDistrict, 
    activeTab, 
    setActiveTab,
    setAuthModalOpen,
    setAuthRole,
    setAuthMode,
    markNotificationsAsRead,
    favorites
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const t = translations[language];
  const myNotifications = user ? notifications.filter(n => n.user_id === user.id) : [];
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleOpenAuth = (role: Role, mode: 'login' | 'register') => {
    setAuthRole(role);
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setUserDropdownOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#2E7D32] to-[#81C784] flex items-center justify-center shadow-lg shadow-emerald-700/20 transform hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                  Food<span className="text-[#2E7D32]">Loop</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200 uppercase">
                  Hà Nội
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-700 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* District Quick Filter (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-50 hover:bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200 transition-colors">
            <MapPin className="w-4 h-4 text-[#2E7D32] mr-1.5" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as DistrictName | 'All')}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All">📍 {t.allDistricts}</option>
              {HANOI_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-[#2E7D32]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-emerald-50 text-[#2E7D32]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navBrowse}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1 ${
                activeTab === 'map'
                  ? 'bg-emerald-50 text-[#2E7D32]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.navMap}</span>
            </button>

            {user?.role === 'customer' && (
              <button
                onClick={() => setActiveTab('customer-dashboard')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'customer-dashboard'
                    ? 'bg-emerald-50 text-[#2E7D32]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.dashboard}
              </button>
            )}

            {user?.role === 'merchant' && (
              <button
                onClick={() => setActiveTab('merchant-dashboard')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'merchant-dashboard'
                    ? 'bg-emerald-50 text-[#2E7D32]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t.myStore}
              </button>
            )}
          </div>

          {/* Right Section: Language Switcher & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Instant Language Switcher directly in Navbar top-right */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-inner">
              <button
                onClick={() => setLanguage('vi')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'vi'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇻🇳</span>
                <span>VI</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) markNotificationsAsRead();
                }}
                className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{t.notifications}</span>
                    <button
                      onClick={markNotificationsAsRead}
                      className="text-[11px] text-[#2E7D32] hover:underline font-semibold"
                    >
                      {t.markAllRead}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {myNotifications.length === 0 ? (
                      <p className="px-4 py-6 text-xs text-center text-slate-400">
                        {t.noNotifications}
                      </p>
                    ) : (
                      myNotifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                          <p className="text-xs font-bold text-slate-800">
                            {language === 'vi' ? n.title_vi : n.title_en}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {language === 'vi' ? n.message_vi : n.message_en}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth or User Dropdown */}
            {!user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenAuth('customer', 'login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#2E7D32] bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
                >
                  {t.buyFood}
                </button>
                <button
                  onClick={() => handleOpenAuth('merchant', 'login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-emerald-800 shadow-md shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5"
                >
                  {t.sellFood}
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden lg:inline max-w-[100px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.role === 'merchant' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.role === 'merchant' ? 'Merchant (Hà Nội)' : 'Customer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab(user.role === 'merchant' ? 'merchant-dashboard' : 'customer-dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <span>{t.dashboard}</span>
                    </button>

                    {user.role === 'customer' && (
                      <button
                        onClick={() => {
                          setActiveTab('customer-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>{t.favorites} ({favorites.length})</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {language === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-xl hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#2E7D32]" />
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value as DistrictName | 'All');
                setMobileMenuOpen(false);
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 w-full focus:outline-none"
            >
              <option value="All">📍 {t.allDistricts}</option>
              {HANOI_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => { setActiveTab('browse'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t.navBrowse}
            </button>
            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t.navMap}
            </button>

            {user && (
              <button
                onClick={() => { 
                  setActiveTab(user.role === 'merchant' ? 'merchant-dashboard' : 'customer-dashboard'); 
                  setMobileMenuOpen(false); 
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-[#2E7D32] bg-emerald-50"
              >
                {t.dashboard} ({user.full_name})
              </button>
            )}
          </div>

          {!user ? (
            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <button
                onClick={() => handleOpenAuth('customer', 'login')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#2E7D32] bg-emerald-50 text-center"
              >
                {t.buyFood}
              </button>
              <button
                onClick={() => handleOpenAuth('merchant', 'login')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#2E7D32] text-center"
              >
                {t.sellFood}
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl text-center"
            >
              {t.logout}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
