import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { HANOI_DISTRICTS } from '../data/hanoiData';
import { Recycle, MapPin, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab, setSelectedDistrict } = useApp();
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2E7D32] to-[#81C784] flex items-center justify-center shadow-lg">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                Food<span className="text-[#81C784]">Loop</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {t.footerDesc}
            </p>

            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 text-[#81C784] mr-1" />
                Hà Nội, Việt Nam
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 text-[#81C784] mr-1" />
                support@foodloop.vn
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('browse')} className="hover:text-emerald-400 transition-colors">
                  {t.navBrowse}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 transition-colors">
                  {t.navMap}
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {t.hanoiDistricts}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {HANOI_DISTRICTS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDistrict(d);
                    setActiveTab('browse');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-emerald-500 transition-colors text-[11px]"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Thông Tin & Điều Khoản
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li className="hover:text-white cursor-pointer">{t.privacyPolicy}</li>
              <li className="hover:text-white cursor-pointer">{t.termsOfService}</li>
              <li className="hover:text-white cursor-pointer">Quy chế hoạt động sàn</li>
              <li className="hover:text-white cursor-pointer">Giải quyết tranh chấp</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FoodLoop Hanoi. {t.rightsReserved}</p>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>for Hanoi Surplus Food Rescue</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
