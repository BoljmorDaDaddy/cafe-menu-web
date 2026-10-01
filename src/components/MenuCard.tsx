import React from 'react';
import { Flame } from 'lucide-react';
import type { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
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
      className={`group relative bg-white rounded-2xl border border-[#d9cfba] shadow-sm hover:shadow-md transition-all duration-250 cursor-pointer flex flex-row items-stretch overflow-hidden h-[110px] sm:h-[120px] ${
        !item.is_available ? 'opacity-60' : ''
      }`}
    >
      {/* Left: Image - Bigger and on left side */}
      <div className="relative w-[120px] sm:w-[140px] shrink-0 overflow-hidden bg-[#f5f2ea]">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-bold text-red-700 bg-white/90 px-2 py-1 rounded-md shadow">
              Дууссан
            </span>
          </div>
        )}
      </div>

      {/* Right: Text content */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        <div className="min-w-0">
          <h3 className="font-semibold text-base text-[#123F36] group-hover:text-[#2A6B5C] line-clamp-2 leading-snug">
            {item.name}
          </h3>
          {item.name_en && (
            <p className="text-xs text-[#5c6b64] mt-0.5 line-clamp-1 italic">
              {item.name_en}
            </p>
          )}
        </div>

        {/* Bottom row: calories left, price right */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {item.calories > 0 ? (
            <span className="flex items-center gap-1 text-xs text-[#5c6b64]">
              <Flame className="w-3.5 h-3.5 text-[#C49A45]" />
              {item.calories} ккал
            </span>
          ) : (
            <span className="text-xs text-[#5c6b64]">—</span>
          )}

          <span className="font-serif font-bold text-base text-[#123F36]">
            {item.price.toLocaleString()}₮
          </span>
        </div>
      </div>
    </div>
  );
};
