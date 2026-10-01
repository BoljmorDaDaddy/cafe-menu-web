import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import type { MenuItem } from '../types';

interface HeroBannerProps {
  featuredItem?: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  onExploreCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItem,
  onSelectItem,
  onExploreCategory,
}) => {
  const [greeting, setGreeting] = useState('Өглөөний мэнд');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Өглөөний мэнд');
    else if (hour < 18) setGreeting('Өдрийн мэнд');
    else setGreeting('Оройн мэнд');
  }, []);

  return (
    <div className="w-full mb-8">
      {/*
        Glassmorphism Hero:
        Full-bleed ambient background photo → frosted glass panel on top
      */}
      <div className="relative w-full rounded-[24px] overflow-hidden min-h-[220px] sm:min-h-[240px]">

        {/* Background image layer */}
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
          alt="Cafe ambient"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          aria-hidden="true"
        />

        {/* Dark vignette over image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0E07]/70 via-[#1A0E07]/40 to-transparent" />

        {/* Glassmorphism content panel */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Left: Glass text card */}
          <div className="glass-hero rounded-2xl px-5 py-5 max-w-xs space-y-3">
            <h1 className="font-serif text-xl sm:text-2xl font-bold leading-snug text-white">
              Өдөр бүрийн<br />
              <span className="text-[#D4B896]">гарын аргаар</span> болгосон
            </h1>
            <p className="text-[12px] sm:text-sm text-white/75 leading-relaxed">
              Шинэхэн хуурсан арабика, эрүүл хоол, тайван орчин — таны өдрийн эхлэл.
            </p>
            <div>
              {featuredItem ? (
                <button
                  onClick={() => onSelectItem(featuredItem)}
                  className="flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-white text-[#2C1A0E] font-semibold text-xs hover:bg-[#F7F3EE] transition-colors shadow-sm"
                >
                  <span>Онцлох харах</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onExploreCategory('coffee')}
                  className="flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-white text-[#2C1A0E] font-semibold text-xs hover:bg-[#F7F3EE] transition-colors shadow-sm"
                >
                  <span>Цэс үзэх</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: featured item image circle (visible on sm+) */}
          {featuredItem && (
            <div className="hidden sm:block relative shrink-0 ml-auto">
              <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-white/30 shadow-xl">
                <img
                  src={featuredItem.image_url}
                  alt={featuredItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Price tag */}
              <div className="absolute -bottom-1 -left-3 bg-white text-[#2C1A0E] font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md">
                {featuredItem.price.toLocaleString()}₮
              </div>
            </div>
          )}
        </div>

        {/* Subtle carousel dots */}
        <div className="absolute bottom-4 left-6 flex items-center gap-1.5 z-10">
          <span className="w-4 h-1.5 rounded-full bg-white/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
};
