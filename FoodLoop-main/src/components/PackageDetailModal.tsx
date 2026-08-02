import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency } from '../i18n/translations';
import type { FoodPackage } from '../types';
import { 
  X, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';

interface PackageDetailModalProps {
  pkg: FoodPackage | null;
  onClose: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ pkg, onClose }) => {
  const { language, stores, reservePackage } = useApp();
  const [qty, setQty] = useState(1);
  const t = translations[language];

  if (!pkg) return null;

  const store = stores.find((s) => s.id === pkg.store_id);
  const discountPercent = Math.round(
    ((pkg.original_price - pkg.discount_price) / pkg.original_price) * 100
  );

  const handleReserve = () => {
    reservePackage(pkg.id, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 w-full bg-slate-100">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="bg-[#FFB300] text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md inline-flex items-center space-x-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>-{discountPercent}% {t.off}</span>
              </span>
              <h2 className="text-xl font-black text-white line-clamp-1">{pkg.title}</h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {store && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center space-x-3">
              <img
                src={store.logo}
                alt={store.store_name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {store.store_name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center truncate mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32] mr-1 shrink-0" />
                  <span className="font-semibold text-slate-700 mr-1">{store.district}:</span>
                  <span className="truncate">{store.address}</span>
                </p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              {t.description}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {pkg.description}
            </p>
          </div>

          {pkg.ingredients && (
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                {t.ingredients}
              </h4>
              <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                {pkg.ingredients}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100">
              <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold mb-0.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{t.pickupTime}</span>
              </div>
              <p className="text-sm font-black text-emerald-950">
                {pkg.pickup_start} - {pkg.pickup_end}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-slate-500 text-xs font-bold mb-0.5">
                {t.remaining}
              </div>
              <p className="text-sm font-black text-slate-900">
                {pkg.remaining_quantity} {t.packagesLeft}
              </p>
            </div>
          </div>

          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-100 flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-0.5">
              <p className="font-bold">{t.pickupInstructions}</p>
              <p className="text-blue-700 leading-normal">{t.pickupInstructionText}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
                className="w-7 h-7 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center shadow-sm"
              >
                -
              </button>
              <span className="text-xs font-black text-slate-900 px-2">
                {qty}
              </span>
              <button
                disabled={qty >= pkg.remaining_quantity}
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center shadow-sm"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 line-through block">
                {formatCurrency(pkg.original_price * qty, language)}
              </span>
              <span className="text-xl font-black text-[#2E7D32]">
                {formatCurrency(pkg.discount_price * qty, language)}
              </span>
            </div>
          </div>

          <button
            onClick={handleReserve}
            className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white bg-[#2E7D32] hover:bg-emerald-800 shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 transform active:scale-98"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.confirmReservation}</span>
          </button>

          <p className="text-[11px] text-center text-slate-400 font-medium">
            {t.payAtStoreNotice}
          </p>

        </div>
      </div>
    </div>
  );
};
