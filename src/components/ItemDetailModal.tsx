import React, { useEffect } from 'react';
import { X, Clock, Flame, Sparkles, ChefHat, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { MenuItem } from '../types';

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
      <div className="relative w-full max-w-lg bg-white rounded-[28px] overflow-hidden border border-[#EFE8DE] shadow-2xl shadow-stone-900/20 z-10 my-auto animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          aria-label="Цонх хаах"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Hero Image */}
        <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-stone-100">
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
        <div className="p-6 sm:p-7 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                {item.type === 'food' ? 'Хоол' : 'Ундаа'}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123F36]">
              {item.name}
            </h2>
            {item.name_en && (
              <p className="text-xs sm:text-sm text-stone-500 font-sans italic">
                {item.name_en}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-[#f5f2ea] p-4 rounded-2xl border border-[#d9cfba]">
            {item.description}
          </div>

          {/* Quick Metrics (Calories & Prep Time) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f5f2ea] p-3.5 rounded-2xl border border-[#d9cfba] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  Илчлэг (Калори)
                </span>
                <span className="font-serif text-sm sm:text-base font-bold text-[#123F36]">
                  {item.calories > 0 ? `${item.calories} ккал` : 'Цөөн калори'}
                </span>
              </div>
            </div>

            <div className="bg-[#f5f2ea] p-3.5 rounded-2xl border border-[#d9cfba] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  Бэлтгэх хугацаа
                </span>
                <span className="font-serif text-sm sm:text-base font-bold text-[#123F36]">
                  {item.prep_time || '10-15 мин'}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients Breakdown */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-stone-600">
                <ChefHat className="w-4 h-4 text-stone-500" />
                <span>Орц найрлага</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#f5f2ea] text-stone-700 border border-[#d9cfba]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

        
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#FAF7F2] flex items-center justify-between">
          <p className="text-xs text-stone-500">
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
