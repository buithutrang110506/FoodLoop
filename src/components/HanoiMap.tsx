import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import type { Store } from '../types';
import { Star, MapPin, ExternalLink } from 'lucide-react';

const createCustomIcon = (count: number) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 rounded-full bg-[#2E7D32] border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transform hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
        </div>
        ${
          count > 0
            ? `<span class="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">${count}</span>`
            : ''
        }
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const MapRecenter: React.FC<{ stores: Store[] }> = ({ stores }) => {
  const map = useMap();

  useEffect(() => {
    if (stores.length > 0) {
      const avgLat = stores.reduce((sum, s) => sum + s.lat, 0) / stores.length;
      const avgLng = stores.reduce((sum, s) => sum + s.lng, 0) / stores.length;
      map.setView([avgLat, avgLng], stores.length === 1 ? 14 : 12);
    } else {
      map.setView([21.0285, 105.8542], 12);
    }
  }, [stores, map]);

  return null;
};

export const HanoiMap: React.FC<{ filteredStores?: Store[] }> = ({ filteredStores }) => {
  const { language, stores, foodPackages, selectedDistrict, setSelectedStore } = useApp();
  const t = translations[language];

  const activeStores = filteredStores || (
    selectedDistrict === 'All'
      ? stores
      : stores.filter((s) => s.district === selectedDistrict)
  );

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-xl border border-emerald-100/60 z-10">
      
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-slate-200 flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-[#2E7D32]" />
        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            {t.hanoiMapTitle}
          </h4>
          <p className="text-[11px] text-slate-500">
            {activeStores.length} {t.popularStores}
          </p>
        </div>
      </div>

      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter stores={activeStores} />

        {activeStores.map((store) => {
          const storePackages = foodPackages.filter(
            (p) => p.store_id === store.id && p.status === 'available'
          );

          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createCustomIcon(storePackages.length)}
            >
              <Popup className="hanoi-store-popup">
                <div className="w-64 p-1">
                  <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                    <img
                      src={store.cover_image}
                      alt={store.store_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-400 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                      <Star className="w-3 h-3 fill-slate-900" />
                      <span>{store.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {store.store_name}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 text-[#2E7D32] mr-1 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                      {storePackages.length} {t.packagesLeft}
                    </div>

                    <button
                      onClick={() => setSelectedStore(store)}
                      className="bg-[#2E7D32] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center space-x-1 shadow-sm"
                    >
                      <span>{t.viewStore}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
