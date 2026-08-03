import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import type { Store } from '../types';
import { Star, MapPin, Clock, Heart, ArrowRight } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  onSelect: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onSelect }) => {
  const { language, favorites, toggleFavoriteStore, foodPackages } = useApp();
  const t = translations[language];

  const isFav = favorites.includes(store.id);
  const activeCount = foodPackages.filter(
    (p) => p.store_id === store.id && p.status === 'available'
  ).length;

  return (
    <div
      onClick={() => onSelect(store)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative hover:-translate-y-1"
    >
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={store.cover_image}
          alt={store.store_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{store.rating}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({store.review_count})
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteStore(store.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 shadow transition-transform transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        <div className="absolute -bottom-4 left-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white p-0.5 shadow-lg border border-slate-100 overflow-hidden">
            <img
              src={store.logo}
              alt={store.store_name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
            {activeCount} {t.availablePackages}
          </span>
        </div>
      </div>

      <div className="p-4 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-[#2E7D32] transition-colors">
            {store.store_name}
          </h3>

          <p className="text-xs text-slate-500 flex items-center mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#2E7D32] mr-1 shrink-0" />
            <span className="font-medium text-slate-700 mr-1">{store.district}:</span>
            <span className="truncate">{store.address}</span>
          </p>

          <p className="text-xs text-slate-500 flex items-center mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
            <span>{store.opening_hours}</span>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {store.categories.map((c) => (
              <span
                key={c}
                className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase"
              >
                {c}
              </span>
            ))}
          </div>

          <button
            onClick={() => onSelect(store)}
            className="text-xs font-bold text-[#2E7D32] group-hover:translate-x-1 transition-transform flex items-center space-x-1"
          >
            <span>{t.viewStore}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
