import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency } from '../i18n/translations';
import type { Reservation } from '../types';
import { X, CheckCircle, Clock, MapPin } from 'lucide-react';

interface ReservationQRModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export const ReservationQRModal: React.FC<ReservationQRModalProps> = ({ reservation, onClose }) => {
  const { language, cancelReservation } = useApp();
  const t = translations[language];

  if (!reservation) return null;

  const isCompleted = reservation.status === 'completed' || reservation.status === 'collected';
  const isCancelled = reservation.status.includes('cancelled');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in zoom-in-95 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-br from-[#2E7D32] to-[#81C784] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <span className="bg-white/20 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 backdrop-blur-md">
            FoodLoop Hanoi
          </span>
          <h2 className="text-xl font-black">{t.reservationSuccess}</h2>
          <p className="text-xs text-emerald-100 mt-1">{t.scanQRInstruction}</p>
        </div>

        <div className="p-6 space-y-5 text-center">
          <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-emerald-300 inline-block mx-auto shadow-inner relative">
            <QRCodeSVG
              value={reservation.qr_code}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&q=80',
                x: undefined,
                y: undefined,
                height: 32,
                width: 32,
                excavate: true,
              }}
            />
            <div className="mt-3 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm inline-block">
              <span className="text-xs text-slate-400 font-bold mr-1">Code:</span>
              <span className="text-base font-black text-slate-900 tracking-wider font-mono">
                {reservation.reservation_code}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1 ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isCancelled
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {isCompleted
                  ? t.statusCompleted
                  : isCancelled
                  ? t.statusCancelled
                  : t.statusReserved}
              </span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-200 text-xs">
            <div className="flex justify-between font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
              <span className="truncate max-w-[200px]">{reservation.package_title}</span>
              <span className="text-[#2E7D32]">x{reservation.quantity}</span>
            </div>

            <div className="flex items-center text-slate-600 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32] mr-1.5 shrink-0" />
              <span className="truncate">{reservation.store_name} ({reservation.store_district})</span>
            </div>

            <div className="flex items-center text-slate-600">
              <Clock className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
              <span>{t.pickupTime}: {reservation.pickup_time}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-sm">
              <span className="text-slate-600">{t.discountPrice}:</span>
              <span className="text-slate-900 text-base">
                {formatCurrency(reservation.total_price, language)}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 text-emerald-900 text-xs p-3 rounded-2xl border border-emerald-200 text-left font-medium">
            💡 {t.payAtStoreNotice}
          </div>

          <div className="flex space-x-2">
            {!isCompleted && !isCancelled && (
              <button
                onClick={() => {
                  cancelReservation(reservation.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                {t.cancelReservation}
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#2E7D32] hover:bg-emerald-800 shadow-md transition-colors"
            >
              {t.backToDashboard}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
