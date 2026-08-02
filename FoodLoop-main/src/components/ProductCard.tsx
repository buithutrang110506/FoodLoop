import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency } from '../i18n/translations';
import type { FoodPackage } from '../types';
import { Clock, MapPin, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  pkg: FoodPackage;
  onSelect?: (pkg: FoodPackage) => void;
  onReserve?: (pkg: FoodPackage) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ pkg, onSelect, onReserve }) => {
  const handleClick = () => {
    if (onReserve) onReserve(pkg);
    else if (onSelect) onSelect(pkg);
  };
  const { language, stores } = useApp();
  const t = translations[language];

  const store = stores.find((s) => s.id === pkg.store_id);
  const discountPercent = Math.round(
    ((pkg.original_price - pkg.discount_price) / pkg.original_price) * 100
  );

  const isSoldOut = pkg.remaining_quantity <= 0 || pkg.status === 'sold_out';

  return (
    <div
      onClick={() => !isSoldOut && handleClick()}
      className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative ${
        isSoldOut ? 'opacity-75 grayscale-[30%]' : 'hover:-translate-y-1'
      }`}
    >
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-[#FFB300] text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>-{discountPercent}% {t.off}</span>
          </span>
        </div>

        {store && (
          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#81C784]" />
            <span>{store.district}</span>
          </span>
        )}

        {store && (
          <div className="absolute -bottom-4 left-4 z-10">
            <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md border border-slate-100 overflow-hidden">
              <img
                src={store.logo}
                alt={store.store_name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 truncate max-w-[170px]">
              {store?.store_name || 'Cửa hàng Hà Nội'}
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              {pkg.category.toUpperCase()}
            </span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-[#2E7D32] transition-colors">
            {pkg.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
            <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{pkg.pickup_start} - {pkg.pickup_end}</span>
            </div>

            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                isSoldOut
                  ? 'bg-rose-100 text-rose-700'
                  : pkg.remaining_quantity <= 2
                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isSoldOut ? t.soldOut : `${pkg.remaining_quantity} ${t.packagesLeft}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 line-through mr-1.5 font-medium">
                {formatCurrency(pkg.original_price, language)}
              </span>
              <span className="text-lg font-black text-[#2E7D32]">
                {formatCurrency(pkg.discount_price, language)}
              </span>
            </div>

            <button
              disabled={isSoldOut}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) handleClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                isSoldOut
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#2E7D32] hover:bg-emerald-800 text-white shadow-emerald-700/20 transform active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isSoldOut ? t.soldOut : t.reserveBtn}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
