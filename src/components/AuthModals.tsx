import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { HANOI_DISTRICTS } from '../data/hanoiData';
import type { DistrictName, FoodCategory } from '../types';
import { X, User as UserIcon, Store as StoreIcon, Lock, Mail, Phone, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';

export const AuthModals: React.FC = () => {
  const { 
    language, 
    authModalOpen, 
    setAuthModalOpen, 
    authRole, 
    setAuthRole, 
    authMode, 
    setAuthMode, 
    registerUser,
    loginUser,
    simulateVerifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPasswordWithToken,
    verificationPendingEmail
  } = useApp();

  const t = translations[language];

  // Common Form States
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Customer Form State
  const [custName, setCustName] = useState('Nguyễn Minh Anh');
  const [custEmail, setCustEmail] = useState('minhanh.hanoi@gmail.com');
  const [custPhone, setCustPhone] = useState('0988123456');
  const [custPassword, setCustPassword] = useState('FoodLoop@2026');

  // Merchant Form State
  const [bizName, setBizName] = useState('Công ty TNHH Tous Les Jours Việt Nam');
  const [ownerName, setOwnerName] = useState('Trần Văn Đức');
  const [storeName, setStoreName] = useState('Tous Les Jours - Lý Thường Kiệt');
  const [category, setCategory] = useState<FoodCategory>('bakery');
  const [merchPhone, setMerchPhone] = useState('0912345678');
  const [merchEmail, setMerchEmail] = useState('contact@touslesjours.vn');
  const [merchPassword, setMerchPassword] = useState('FoodLoop@2026');
  const [district, setDistrict] = useState<DistrictName>('Hoàn Kiếm');
  const [address, setAddress] = useState('25 Lý Thường Kiệt, P. Phan Chu Trinh, Q. Hoàn Kiếm, Hà Nội');

  // Reset Password State
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('NewPass@2026');

  if (!authModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const isCust = authRole === 'customer';
    const email = isCust ? custEmail : merchEmail;
    const phone = isCust ? custPhone : merchPhone;
    const name = isCust ? custName : ownerName;
    const password = isCust ? custPassword : merchPassword;

    const res = registerUser({
      full_name: name,
      email,
      phone,
      role: authRole,
      district,
    }, password);

    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const email = authRole === 'customer' ? custEmail : merchEmail;
    const password = authRole === 'customer' ? custPassword : merchPassword;

    const res = loginUser(email, password, rememberMe);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = requestPasswordReset(resetEmail || custEmail);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = resetPasswordWithToken(newPassword);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Role Toggle Header (Customer vs Merchant) */}
        {authMode !== 'pending_verification' && (
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-center space-x-2">
            <button
              onClick={() => { setAuthRole('customer'); setErrorMsg(null); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                authRole === 'customer'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{t.customerLogin}</span>
            </button>

            <button
              onClick={() => { setAuthRole('merchant'); setErrorMsg(null); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                authRole === 'merchant'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>{t.merchantLogin}</span>
            </button>
          </div>
        )}

        {/* Header Title */}
        <div className="px-6 pt-5 pb-2 text-center">
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'pending_verification'
              ? t.pendingVerificationTitle
              : authMode === 'forgot'
              ? t.forgotPassword
              : authMode === 'reset'
              ? t.resetPassword
              : authRole === 'customer'
              ? authMode === 'login'
                ? t.customerLogin
                : t.registerTitle
              : authMode === 'login'
              ? t.merchantLogin
              : t.registerTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'pending_verification'
              ? `${t.pendingVerificationMsg} (${verificationPendingEmail})`
              : authRole === 'customer'
              ? 'Tham gia FoodLoop để mua thực phẩm dư thừa giá tốt nhất tại Hà Nội'
              : 'Đăng ký cửa hàng để bán thực phẩm dư thừa và thu hồi chi phí'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="mx-6 mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE: PENDING VERIFICATION */}
        {/* ---------------------------------------------------- */}
        {authMode === 'pending_verification' ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 animate-bounce" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hệ thống đã gửi liên kết kích hoạt đến email: <strong className="text-slate-900">{verificationPendingEmail}</strong>. Bạn cần kích hoạt email trước khi đăng nhập.
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => simulateVerifyEmail(verificationPendingEmail || custEmail)}
                className="w-full py-3 bg-[#2E7D32] hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.simulateVerifyBtn}</span>
              </button>

              <button
                onClick={() => resendVerificationEmail(verificationPendingEmail || custEmail)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.resendVerification}</span>
              </button>
            </div>
          </div>
        ) : authMode === 'forgot' ? (
          /* ---------------------------------------------------- */
          /* MODE: FORGOT PASSWORD */
          /* ---------------------------------------------------- */
          <form onSubmit={handleForgot} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.email}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2E7D32] text-white font-bold rounded-2xl transition-all shadow-lg hover:bg-emerald-800"
            >
              {t.sendResetLink}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-slate-500 hover:text-slate-900 font-semibold underline"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          </form>
        ) : authMode === 'reset' ? (
          /* ---------------------------------------------------- */
          /* MODE: RESET PASSWORD */
          /* ---------------------------------------------------- */
          <form onSubmit={handleResetSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.newPassword}</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{t.passwordRequirements}</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2E7D32] text-white font-bold rounded-2xl transition-all shadow-lg hover:bg-emerald-800"
            >
              {t.resetPassword}
            </button>
          </form>
        ) : (
          /* ---------------------------------------------------- */
          /* MODE: LOGIN OR REGISTER FORM */
          /* ---------------------------------------------------- */
          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="p-6 pt-2 space-y-3.5 overflow-y-auto flex-1 text-xs">
            {authRole === 'customer' ? (
              <>
                {authMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t.fullName} *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                        placeholder="Nguyễn Minh Anh"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.email} *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                      placeholder="minhanh.hanoi@gmail.com"
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                        placeholder="0988123456"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.password} *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={custPassword}
                      onChange={(e) => setCustPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2E7D32] bg-slate-50"
                      placeholder="••••••••"
                    />
                  </div>
                  {authMode === 'register' && (
                    <p className="text-[10px] text-slate-500 mt-1">{t.passwordRequirements}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{t.businessName} *</label>
                        <input
                          type="text"
                          required
                          value={bizName}
                          onChange={(e) => setBizName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{t.ownerName} *</label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t.storeName} *</label>
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{t.businessCategory} *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as FoodCategory)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50 font-semibold"
                        >
                          <option value="bakery">Bánh ngọt / Bakery</option>
                          <option value="restaurant">Nhà hàng / Restaurant</option>
                          <option value="coffee">Cà phê / Coffee</option>
                          <option value="dessert">Tráng miệng / Dessert</option>
                          <option value="convenience">Cửa hàng tiện lợi</option>
                          <option value="supermarket">Siêu thị</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{t.district} *</label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value as DistrictName)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50 font-semibold"
                        >
                          {HANOI_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{t.addressDetail} *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={merchEmail}
                    onChange={(e) => setMerchEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={merchPhone}
                      onChange={(e) => setMerchPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.password} *</label>
                  <input
                    type="password"
                    required
                    value={merchPassword}
                    onChange={(e) => setMerchPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50"
                  />
                  {authMode === 'register' && (
                    <p className="text-[10px] text-slate-500 mt-1">{t.passwordRequirements}</p>
                  )}
                </div>
              </>
            )}

            {/* Remember Me & Forgot Password */}
            {authMode === 'login' && (
              <div className="flex items-center justify-between text-slate-600 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <span>{t.rememberMe}</span>
                </label>

                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot'); setErrorMsg(null); }}
                  className="text-slate-600 hover:text-slate-900 font-semibold underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl text-xs font-black text-white transition-all shadow-lg mt-2 ${
                authRole === 'customer'
                  ? 'bg-[#2E7D32] hover:bg-emerald-800 shadow-emerald-700/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              }`}
            >
              {authMode === 'login' ? t.submitLogin : t.submitRegister}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
              >
                {authMode === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
