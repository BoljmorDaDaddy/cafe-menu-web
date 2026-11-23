import React from 'react';
import {
  Coffee,
  CupSoda,
  UtensilsCrossed,
  Soup,
  EggFried,
  Salad,
  Wine,
  Sparkles,
  Cookie,
} from 'lucide-react';
import type { MenuCategory } from '../types';

interface CategoryNavProps {
  activeType: 'all' | 'food' | 'drink';
  onSelectType: (type: 'all' | 'food' | 'drink') => void;
  activeCategory: 'all' | MenuCategory;
  onSelectCategory: (cat: 'all' | MenuCategory) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeType,
  onSelectType,
  activeCategory,
  onSelectCategory,
}) => {
  const categoryCards: { id: 'all' | MenuCategory; label: string; icon: React.ReactNode; group: 'food' | 'drink' | 'all' }[] = [
    { id: 'all', label: 'Бүгд', icon: <Sparkles className="w-5 h-5" />, group: 'all' },
    { id: 'soup', label: '1-р хоол', icon: <Soup className="w-5 h-5" />, group: 'food' },
    { id: 'main', label: '2-р хоол', icon: <UtensilsCrossed className="w-5 h-5" />, group: 'food' },
    { id: 'breakfast', label: 'Өглөөний цай', icon: <EggFried className="w-5 h-5" />, group: 'food' },
    { id: 'salad', label: 'Салад', icon: <Salad className="w-5 h-5" />, group: 'food' },
    { id: 'coffee', label: 'Кофе', icon: <Coffee className="w-5 h-5" />, group: 'drink' },
    { id: 'tea', label: 'Цай', icon: <Wine className="w-5 h-5" />, group: 'drink' },
    { id: 'cold_drinks', label: 'Хүйтэн ундаа', icon: <CupSoda className="w-5 h-5" />, group: 'drink' },
  ];

  const visibleCards = categoryCards.filter(
    (card) => activeType === 'all' || card.group === 'all' || card.group === activeType
  );

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <button
          onClick={() => { onSelectType('all'); onSelectCategory('all'); }}
          className="text-xs font-semibold text-white hover:text-white transition-colors"
        >
          Бүгдийг харах
        </button>
      </div>

      {/* Type Filter Segments: All, Foods, Drinks */}
      <div className="flex items-center gap-2 mb-3.5 px-1">
        <button
          onClick={() => {
            onSelectType('all');
            onSelectCategory('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeType === 'all'
              ? 'bg-[#123F36] text-white shadow-sm'
              : 'bg-[#142B3B] text-white hover:bg-[#1A3547] border border-[#D9B65A]/30'
          }`}
        >
          Бүгд
        </button>
        <button
          onClick={() => {
            onSelectType('drink');
            if (!['coffee', 'cold_drinks', 'tea'].includes(activeCategory)) {
              onSelectCategory('all');
            }
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeType === 'drink'
              ? 'bg-[#C49A45] text-white shadow-sm'
              : 'bg-[#142B3B] text-white hover:bg-[#1A3547] border border-[#D9B65A]/30'
          }`}
        >
          Уух зүйлс
        </button>
        <button
          onClick={() => {
            onSelectType('food');
            if (!['breakfast', 'soup', 'main', 'salad'].includes(activeCategory)) {
              onSelectCategory('all');
            }
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeType === 'food'
              ? 'bg-[#C49A45] text-white shadow-sm'
              : 'bg-[#142B3B] text-white hover:bg-[#1A3547] border border-[#D9B65A]/30'
          }`}
        >
          Хоолны цэс
        </button>
      </div>

      {/* Horizontal Scroll of Square Cards */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
        {visibleCards.map((card) => {
          const isSelected = activeCategory === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onSelectCategory(card.id)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-200 transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-[#123F36] text-white shadow-md'
                    : 'bg-[#142B3B] text-white border border-[#D9B65A]/30 shadow-sm hover:bg-[#1A3547] hover:shadow-md'
                }`}
              >
                {card.icon}
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-tight transition-colors ${
                  isSelected ? 'text-white font-bold' : 'text-white group-hover:text-white'
                }`}
              >
                {card.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
