import React, { useState, useEffect } from 'react';
import { TVSlide, CafeSettings, MenuItem } from '../types';
import { Coffee } from 'lucide-react';

interface TvDisplayProps {
  slides: TVSlide[];
  menuItems: MenuItem[];
  settings: CafeSettings;
  onExit?: () => void;
}

export const TvDisplay: React.FC<TvDisplayProps> = ({ slides, menuItems, settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeSlides = slides.filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (activeSlides.length === 0) return;

    const currentSlide = activeSlides[currentIndex];
    const duration = (currentSlide?.duration_seconds || 8) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeSlides]);

  if (activeSlides.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#140C08] flex items-center justify-center text-stone-500 font-serif text-2xl z-[9999]">
        No active slides to display
      </div>
    );
  }

  const slide = activeSlides[currentIndex];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black text-white z-[9999] select-none">
      {/* Glassmorphism Object - Top Right */}
      <div className="fixed top-8 right-8 z-50 px-6 py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl animate-fadeIn">
        <div className="flex items-center gap-3">
          <Coffee className="w-5 h-5 text-amber-400" />
          <span className="font-serif font-bold text-lg tracking-wide text-white">
            {settings.cafe_name}
          </span>
        </div>
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        {slide.template === 'split_promo' && (
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-2 animate-fadeIn bg-[#F1E7D5]">
            {/* Left Info Panel */}
            <div className="h-full w-full flex flex-col justify-center px-[5%] py-[7%] text-[#151515] space-y-8 z-10">
              <div className="space-y-2">
                <span className="block text-xl font-bold uppercase tracking-[0.08em] text-[#38342E]">
                  {slide.badge || 'SIGNATURE'}
                </span>
                <h1 className="text-7xl lg:text-9xl font-black uppercase leading-[0.85] text-[#151515]">
                  {slide.title}
                </h1>
              </div>

              <div className="space-y-8 w-[92%]">
                {/* Map menu items to the 'split pro' style: Name Left / Price Right */}
                {menuItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl lg:text-3xl font-extrabold uppercase text-[#171717]">
                        {item.name}
                      </span>
                      <span className="text-xl lg:text-2xl font-semibold text-[#292620]">
                        {item.price.toLocaleString()}₮
                      </span>
                    </div>
                    <p className="text-sm lg:text-lg font-normal text-[#625D54] line-clamp-2 leading-tight">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Food Panel */}
            <div className="h-full w-full relative flex items-center justify-center">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {slide.template === 'hero_showcase' && (
          <div className="h-full w-full relative overflow-hidden animate-fadeIn">
            <img
              src={slide.image_url}
              alt={slide.title}
              className="h-full w-full object-cover scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-6">
              {slide.badge && (
                <span className="px-4 py-1 rounded-full bg-amber-500 text-stone-950 text-sm font-bold uppercase tracking-widest">
                  {slide.badge}
                </span>
              )}
              <h1 className="text-7xl lg:text-9xl font-serif font-bold drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-2xl lg:text-4xl text-stone-200 max-w-3xl font-light drop-shadow-lg">
                {slide.subtitle}
              </p>
              {slide.price_highlight && (
                <div className="text-5xl lg:text-7xl font-serif font-bold text-amber-400 drop-shadow-lg">
                  {slide.price_highlight}
                </div>
              )}
            </div>
          </div>
        )}

        {slide.template === 'menu_board' && (
          <div className="h-full w-full relative animate-fadeIn overflow-hidden">
            {/* Blurred Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image_url}
                className="h-full w-full object-cover blur-xl scale-110 brightness-50"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Area */}
            <div className="relative z-10 h-full w-full px-[2%] py-[4%] flex flex-col">
              <div className="text-center mb-[4%]">
                <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-2xl text-stone-300 italic">{slide.subtitle}</p>
              </div>

              {/* Three Column Grid */}
              <div className="flex-1 grid grid-cols-3 gap-[1%] overflow-hidden items-start">
                {/* Column 1: Drinks */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-center text-3xl font-serif text-white mb-4">Drinks</h2>
                  <div className="bg-[#F5F0E8] rounded-xl p-4 shadow-lg space-y-4 text-[#302A25]">
                    {menuItems.filter(i => i.type === 'drink').slice(0, 6).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#D8D0C5] pb-2 last:border-0">
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold uppercase text-sm truncate">{item.name}</span>
                          <span className="text-xs text-[#766E65] truncate">{item.description}</span>
                        </div>
                        <span className="font-bold text-sm ml-2 shrink-0">{item.price.toLocaleString()}₮</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Food */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-center text-3xl font-serif text-white mb-4">Food</h2>
                  <div className="bg-[#F5F0E8] rounded-xl p-4 shadow-lg space-y-4 text-[#302A25]">
                    {menuItems.filter(i => i.type === 'food').slice(0, 6).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#D8D0C5] pb-2 last:border-0">
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold uppercase text-sm truncate">{item.name}</span>
                          <span className="text-xs text-[#766E65] truncate">{item.description}</span>
                        </div>
                        <span className="font-bold text-sm ml-2 shrink-0">{item.price.toLocaleString()}₮</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Packages/Featured */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-center text-3xl font-serif text-white mb-4">Packages</h2>
                  <div className="bg-[#F5F0E8] rounded-xl p-4 shadow-lg space-y-4 text-[#302A25]">
                    {menuItems.filter(i => i.is_featured).slice(0, 6).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#D8D0C5] pb-2 last:border-0">
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold uppercase text-sm truncate">{item.name}</span>
                          <span className="text-xs text-[#766E65] truncate">{item.description}</span>
                        </div>
                        <div className="flex flex-col items-end overflow-hidden">
                          <span className="font-bold text-sm ml-2 shrink-0">{item.price.toLocaleString()}₮</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto text-center py-4">
                <span className="text-white/60 text-sm uppercase tracking-widest font-light">
                  {settings.tagline}
                </span>
              </div>
            </div>
          </div>
        )}

        {(!['split_promo', 'hero_showcase', 'menu_board'].includes(slide.template)) && (
          <div className="h-full w-full flex items-center justify-center bg-stone-900 animate-fadeIn relative">
             <img src={slide.image_url} className="absolute inset-0 h-full w-full object-cover opacity-50" />
             <div className="relative text-center z-10">
                <h1 className="text-6xl font-serif font-bold">{slide.title}</h1>
                <p className="text-2xl">{slide.subtitle}</p>
             </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-0 left-0 h-1 bg-amber-500 transition-all duration-[100s] ease-linear z-50"
           style={{ width: `${((currentIndex + 1) / activeSlides.length) * 100}%` }} />
    </div>
  );
};
