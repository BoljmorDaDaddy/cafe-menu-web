import React, { useEffect } from 'react';
import { X, Flame, Sparkles, ChefHat, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { MenuItem } from '../types';
import { WinterModalBackdrop } from './WinterModalBackdrop';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click area */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#071321] rounded-[28px] overflow-hidden border border-[#D9B65A]/35 shadow-2xl shadow-black/50 z-10 my-auto animate-scaleUp">
        <WinterModalBackdrop />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#091824]/80 hover:bg-[#091824] text-[#F5EBDD] hover:text-white border border-[#D9B65A]/30 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          aria-label="Цонх хаах"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Hero Image */}
        <div className="relative z-10 aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-stone-100">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating Price Tag */}
          <div className="absolute bottom-4 left-5 z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow">
              Үнэ
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
              {item.price.toLocaleString()}₮
            </div>
          </div>

          {/* Availability Status */}
          <div className="absolute bottom-4 right-5 z-10">
            {item.is_available ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Бэлэн байна</span>
              </span>
            ) : (
              <span className="bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Түр дууссан</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 sm:p-7 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar text-[#F5EBDD]">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#091824]/75 text-[#E6C876] border border-[#D9B65A]/25">
                {item.type === 'food' ? 'Хоол' : 'Ундаа'}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF5DF]">
              {item.name}
            </h2>
            {item.name_en && (
              <p className="text-xs sm:text-sm text-[#CBD5DB] font-sans italic">
                {item.name_en}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#E6EBEB] leading-relaxed bg-[#081521]/70 p-4 rounded-2xl border border-[#D9B65A]/30 backdrop-blur-sm">
            {item.description}
          </div>

          {/* Calories */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-[#081521]/70 p-3.5 rounded-2xl border border-[#D9B65A]/25 flex items-center gap-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-[#263C49] text-[#E6C876] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#BAC7CE] uppercase tracking-wider block">
                  Илчлэг (Калори)
                </span>
                <span className="font-serif text-sm sm:text-base font-bold text-[#FFF5DF]">
                  {item.calories > 0 ? `${item.calories} ккал` : 'Цөөн калори'}
                </span>
              </div>
            </div>

          </div>

          {/* Ingredients Breakdown */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-[#F5EBDD]">
                <ChefHat className="w-4 h-4 text-[#E6C876]" />
                <span>Орц найрлага</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#081521]/70 text-[#E6EBEB] border border-[#D9B65A]/25 backdrop-blur-sm"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

        
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-[#D9B65A]/25 bg-[#071521]/80 flex items-center justify-between">
          <p className="text-xs text-[#BAC7CE]">
            * Кафены зөөгчөөс шууд захиална уу.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
