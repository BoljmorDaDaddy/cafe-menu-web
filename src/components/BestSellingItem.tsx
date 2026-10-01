import React from 'react';
import { Plus, Flame } from 'lucide-react';
import type { MenuItem } from '../types';

interface BestSellingItemProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const BestSellingItem: React.FC<BestSellingItemProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="group bg-white rounded-2xl p-3 border border-[#d9cfba] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer"
    >
      {/* Square Rounded Photo on Left */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-stone-100 shrink-0 group-hover:scale-105 transition-transform"
        />

        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-[#123F36] group-hover:text-[#2A6B5C] transition-colors truncate">
            {item.name}
          </h4>
          <p className="text-[11px] text-stone-500 line-clamp-1 italic">
            {item.name_en || item.description}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
            <Flame className="w-3 h-3 text-[#C49A45]" />
            <span>{item.calories > 0 ? `${item.calories} ккал` : 'Цөөн калори'} · {item.prep_time || '10 мин'}</span>
          </div>
        </div>
      </div>

      {/* Price & Action Button on Right */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-serif font-extrabold text-xs sm:text-sm text-[#123F36]">
          {item.price.toLocaleString()}₮
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#123F36] hover:bg-[#2A6B5C] active:scale-90 text-white font-bold flex items-center justify-center shadow-md transition-all"
          title="Дэлгэрэнгүй харах"
          aria-label="View details"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
