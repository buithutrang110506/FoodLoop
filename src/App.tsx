import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { MerchantDashboard } from './components/MerchantDashboard';
import { StorePageModal } from './components/StorePageModal';
import { PackageDetailModal } from './components/PackageDetailModal';
import { ReservationQRModal } from './components/ReservationQRModal';
import { AuthModals } from './components/AuthModals';
import { Footer } from './components/Footer';
import { HanoiMap } from './components/HanoiMap';
import { StoreCard } from './components/StoreCard';
import { translations } from './i18n/translations';

const MainContent: React.FC = () => {
  const { 
    user,
    activeTab, 
    setActiveTab,
    selectedStore, 
    setSelectedStore, 
    selectedPackage, 
    setSelectedPackage, 
    activeReservation, 
    setActiveReservation,
    stores,
    language,
    setAuthRole,
    setAuthMode,
    setAuthModalOpen
  } = useApp();

  const t = translations[language];

  // Route Protection & Unauthorized Access Enforcement
  useEffect(() => {
    if (activeTab === 'customer-dashboard') {
      if (!user) {
        setAuthRole('customer');
        setAuthMode('login');
        setAuthModalOpen(true);
        setActiveTab('home');
      } else if (user.role !== 'customer') {
        setActiveTab('merchant-dashboard');
      }
    } else if (activeTab === 'merchant-dashboard') {
      if (!user) {
        setAuthRole('merchant');
        setAuthMode('login');
        setAuthModalOpen(true);
        setActiveTab('home');
      } else if (user.role !== 'merchant') {
        setActiveTab('customer-dashboard');
      }
    }
  }, [activeTab, user, setActiveTab, setAuthRole, setAuthMode, setAuthModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans antialiased">
      {/* Main Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && <LandingPage />}

        {activeTab === 'customer-dashboard' && <CustomerDashboard />}

        {activeTab === 'merchant-dashboard' && <MerchantDashboard />}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{t.hanoiMapTitle}</h1>
              <p className="text-xs text-slate-500">{t.hanoiMapSub}</p>
            </div>
            <HanoiMap />
          </div>
        )}

        {activeTab === 'browse' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{t.navBrowse}</h1>
              <p className="text-xs text-slate-500">Khám phá các thương hiệu đối tác cứu hộ thực phẩm uy tín tại Hà Nội</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onSelect={(s) => setSelectedStore(s)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {selectedStore && (
        <StorePageModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
        />
      )}

      {selectedPackage && (
        <PackageDetailModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}

      {activeReservation && (
        <ReservationQRModal
          reservation={activeReservation}
          onClose={() => setActiveReservation(null)}
        />
      )}

      <AuthModals />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
