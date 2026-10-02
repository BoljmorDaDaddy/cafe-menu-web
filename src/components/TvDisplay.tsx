import React, { useState, useEffect, useMemo } from 'react';
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
  const activeSlides = useMemo(
    () => slides.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [slides]
  );

  useEffect(() => {
    if (activeSlides.length === 0) return;
    const safeIndex = currentIndex % activeSlides.length;
    const currentSlide = activeSlides[safeIndex];
    const duration = (currentSlide?.duration_seconds || 8) * 1000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentIndex, activeSlides]);

  // Preload next slide image so aspect swaps don't flash
  useEffect(() => {
    if (activeSlides.length < 2) return;
    const next = activeSlides[(currentIndex + 1) % activeSlides.length];
    if (next?.image_url) {
      const img = new Image();
      img.src = next.image_url;
    }
  }, [currentIndex, activeSlides]);

  if (activeSlides.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#140C08] flex items-center justify-center text-stone-500 font-serif text-2xl z-[9999]">
        No active slides to display
      </div>
    );
  }

  const slide = activeSlides[currentIndex % activeSlides.length];
  const slideDuration = slide?.duration_seconds || 8;

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-black text-white z-[9999] select-none">
      {/* Glassmorphism Object - Top Right */}
      <div className="pointer-events-none fixed top-[2.5vh] right-[2.5vw] z-50 px-[1.5vw] py-[1.2vh] rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl animate-fadeIn">
        <div className="flex items-center gap-2">
          <Coffee className="w-[2.2vmin] h-[2.2vmin] min-w-4 min-h-4 text-amber-400" />
          <span className="font-serif font-bold text-[clamp(0.85rem,2vmin,1.15rem)] tracking-wide text-white whitespace-nowrap">
            {settings.cafe_name}
          </span>
        </div>
      </div>

      {/* Slide Content — locked to viewport, never scrolls */}
      <div key={slide.id} className="absolute inset-0 h-full w-full overflow-hidden">
        {slide.template === 'split_promo' && (
          <div className="h-full w-full grid grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-2 lg:grid-rows-none animate-fadeIn bg-[#F1E7D5] overflow-hidden">
            {/* Left Info Panel */}
            <div className="min-h-0 min-w-0 w-full h-full flex flex-col justify-center px-[4vw] py-[3vh] gap-[2vh] z-10 overflow-hidden">
              <div className="space-y-[1vh] min-h-0">
                <span className="block text-[clamp(0.8rem,1.8vmin,1.25rem)] font-bold uppercase tracking-[0.08em] text-[#38342E] truncate">
                  {slide.badge || 'SIGNATURE'}
                </span>
                <h1 className="font-black uppercase leading-[0.92] text-[#151515] text-[clamp(2rem,7vmin,7.5rem)] break-words line-clamp-3 text-balance">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-[clamp(0.9rem,2.2vmin,1.5rem)] font-normal text-[#625D54] line-clamp-2 leading-snug">
                    {slide.subtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-[1.6vh] w-full lg:w-[92%] min-h-0 overflow-hidden">
                {/* Map menu items to the 'split pro' style: Name Left / Price Right */}
                {menuItems.slice(0, 5).map((item, idx) => (
                  <div key={item.id || idx} className="min-w-0">
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="text-[clamp(1rem,2.6vmin,1.9rem)] font-extrabold uppercase text-[#171717] truncate min-w-0">
                        {item.name}
                      </span>
                      <span className="text-[clamp(0.9rem,2.2vmin,1.5rem)] font-semibold text-[#292620] whitespace-nowrap shrink-0">
                        {item.price.toLocaleString()}₮
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[clamp(0.75rem,1.7vmin,1.05rem)] font-normal text-[#625D54] line-clamp-1 leading-tight truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Food Panel — auto-fit any ratio, never crop, never overflow */}
            <div className="relative min-h-0 min-w-0 h-full w-full overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
              {slide.image_url ? (
                <>
                  <img
                    src={slide.image_url}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-center blur-2xl scale-110 opacity-40 pointer-events-none"
                  />
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    draggable={false}
                    className="relative z-10 h-full w-full object-contain object-center"
                  />
                </>
              ) : (
                <div className="text-stone-500 font-serif text-xl">No image</div>
              )}
            </div>
          </div>
        )}

        {slide.template === 'hero_showcase' && (
          <div className="h-full w-full relative overflow-hidden animate-fadeIn bg-black">
            {slide.image_url && (
              <>
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-center animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
              </>
            )}
            <div className="absolute inset-0 min-h-0 flex flex-col items-center justify-center text-center px-[5vw] py-[6vh] gap-[2vh] overflow-hidden">
              {slide.badge && (
                <span className="px-[1.2vw] py-[0.8vh] rounded-full bg-amber-500 text-stone-950 text-[clamp(0.7rem,1.8vmin,1rem)] font-bold uppercase tracking-widest whitespace-nowrap max-w-full truncate">
                  {slide.badge}
                </span>
              )}
              <h1 className="font-serif font-bold drop-shadow-2xl text-[clamp(2.2rem,9vmin,7.5rem)] leading-[0.95] break-words line-clamp-3 text-balance max-w-[90vw]">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-stone-200 font-light drop-shadow-lg text-[clamp(1rem,3vmin,2.2rem)] leading-snug line-clamp-2 max-w-[80vw] text-balance">
                  {slide.subtitle}
                </p>
              )}
              {slide.price_highlight && (
                <div className="font-serif font-bold text-amber-400 drop-shadow-lg text-[clamp(1.6rem,6vmin,4.5rem)] leading-none whitespace-nowrap">
                  {slide.price_highlight}
                </div>
              )}
            </div>
          </div>
        )}

        {slide.template === 'menu_board' && (
          <div className="h-full w-full relative animate-fadeIn overflow-hidden bg-black">
            {/* Blurred Background — always cover, never distorts */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {slide.image_url && (
                <img
                  src={slide.image_url}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="h-full w-full object-cover object-center blur-xl scale-110 brightness-50"
                />
              )}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Area — locked to viewport, columns shrink instead of overflowing */}
            <div className="relative z-10 h-full w-full px-[2.5vw] py-[3vh] flex flex-col min-h-0 overflow-hidden">
              <div className="text-center shrink-0 pb-[1.5vh]">
                <h1 className="font-serif font-bold text-white drop-shadow-lg text-[clamp(1.6rem,5vmin,3.8rem)] leading-tight truncate">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-stone-300 italic text-[clamp(0.9rem,2.2vmin,1.4rem)] truncate">
                    {slide.subtitle}
                  </p>
                )}
              </div>

              {/* Three Column Grid */}
              <div className="flex-1 min-h-0 grid grid-cols-3 gap-[1.5vw] overflow-hidden items-stretch">
                {/* Column 1: Drinks */}
                <div className="flex flex-col min-h-0 min-w-0">
                  <h2 className="shrink-0 text-center font-serif text-white mb-[1.2vh] text-[clamp(1.1rem,3vmin,1.9rem)] leading-tight truncate">Drinks</h2>
                  <div className="flex-1 min-h-0 overflow-hidden bg-[#F5F0E8] rounded-xl p-[1.4vmin] shadow-lg flex flex-col justify-start gap-[1vh] text-[#302A25]">
                    {menuItems.filter(i => i.type === 'drink').slice(0, 6).map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between items-center gap-2 border-b border-[#D8D0C5] pb-[0.8vh] last:border-0 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                          <span className="font-bold uppercase truncate text-[clamp(0.7rem,1.7vmin,0.95rem)] leading-tight">{item.name}</span>
                          <span className="text-[#766E65] truncate text-[clamp(0.6rem,1.4vmin,0.78rem)] leading-tight">{item.description}</span>
                        </div>
                        <span className="font-bold whitespace-nowrap shrink-0 text-[clamp(0.7rem,1.7vmin,0.95rem)]">{item.price.toLocaleString()}₮</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Food */}
                <div className="flex flex-col min-h-0 min-w-0">
                  <h2 className="shrink-0 text-center font-serif text-white mb-[1.2vh] text-[clamp(1.1rem,3vmin,1.9rem)] leading-tight truncate">Food</h2>
                  <div className="flex-1 min-h-0 overflow-hidden bg-[#F5F0E8] rounded-xl p-[1.4vmin] shadow-lg flex flex-col justify-start gap-[1vh] text-[#302A25]">
                    {menuItems.filter(i => i.type === 'food').slice(0, 6).map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between items-center gap-2 border-b border-[#D8D0C5] pb-[0.8vh] last:border-0 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                          <span className="font-bold uppercase truncate text-[clamp(0.7rem,1.7vmin,0.95rem)] leading-tight">{item.name}</span>
                          <span className="text-[#766E65] truncate text-[clamp(0.6rem,1.4vmin,0.78rem)] leading-tight">{item.description}</span>
                        </div>
                        <span className="font-bold whitespace-nowrap shrink-0 text-[clamp(0.7rem,1.7vmin,0.95rem)]">{item.price.toLocaleString()}₮</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Packages/Featured */}
                <div className="flex flex-col min-h-0 min-w-0">
                  <h2 className="shrink-0 text-center font-serif text-white mb-[1.2vh] text-[clamp(1.1rem,3vmin,1.9rem)] leading-tight truncate">Packages</h2>
                  <div className="flex-1 min-h-0 overflow-hidden bg-[#F5F0E8] rounded-xl p-[1.4vmin] shadow-lg flex flex-col justify-start gap-[1vh] text-[#302A25]">
                    {menuItems.filter(i => i.is_featured).slice(0, 6).map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between items-center gap-2 border-b border-[#D8D0C5] pb-[0.8vh] last:border-0 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                          <span className="font-bold uppercase truncate text-[clamp(0.7rem,1.7vmin,0.95rem)] leading-tight">{item.name}</span>
                          <span className="text-[#766E65] truncate text-[clamp(0.6rem,1.4vmin,0.78rem)] leading-tight">{item.description}</span>
                        </div>
                        <span className="font-bold whitespace-nowrap shrink-0 text-[clamp(0.7rem,1.7vmin,0.95rem)]">{item.price.toLocaleString()}₮</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-center pt-[1.5vh]">
                <span className="text-white/60 uppercase tracking-widest font-light text-[clamp(0.65rem,1.6vmin,0.9rem)] truncate block">
                  {settings.tagline}
                </span>
              </div>
            </div>
          </div>
        )}

        {slide.template === 'picture_no_bg' && (
          <div className="h-full w-full relative animate-fadeIn overflow-hidden bg-gradient-to-br from-[#1a120b] via-[#0d0d0d] to-black flex items-center justify-center">
            {/* Soft radial glow behind product — no photo background, no blur fill */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(196,154,69,0.22) 0%, rgba(196,154,69,0.06) 45%, transparent 70%)',
              }}
            />
            <div className="relative z-10 h-full w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-[2vw] px-[5vw] py-[5vh] min-h-0 overflow-hidden">
              {/* Text side */}
              <div className="min-w-0 flex flex-col items-start lg:items-start items-center text-center lg:text-left justify-center gap-[1.8vh] overflow-hidden order-2 lg:order-1">
                {slide.badge && (
                  <span className="px-[1.2vw] py-[0.8vh] rounded-full bg-amber-500 text-stone-950 text-[clamp(0.7rem,1.8vmin,1rem)] font-bold uppercase tracking-widest whitespace-nowrap max-w-full truncate">
                    {slide.badge}
                  </span>
                )}
                <h1 className="font-black uppercase text-white leading-[0.95] text-[clamp(2rem,7vmin,6.5rem)] break-words line-clamp-3 text-balance drop-shadow-2xl">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-stone-300 font-light text-[clamp(0.95rem,2.4vmin,1.6rem)] leading-snug line-clamp-2 text-balance max-w-[90%]">
                    {slide.subtitle}
                  </p>
                )}
                {slide.price_highlight && (
                  <div className="font-serif font-bold text-amber-400 text-[clamp(1.8rem,6vmin,4.5rem)] leading-none whitespace-nowrap drop-shadow-lg">
                    {slide.price_highlight}
                  </div>
                )}
              </div>
              {/* Picture side — transparent PNG floats, fully visible, never cropped */}
              <div className="relative min-h-0 min-w-0 h-full w-full flex items-center justify-center order-1 lg:order-2 overflow-hidden">
                {slide.image_url ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    draggable={false}
                    className="max-h-full max-w-full h-full w-full object-contain object-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
                    style={{ filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.65))' }}
                  />
                ) : (
                  <div className="text-stone-500 font-serif text-xl">No image</div>
                )}
              </div>
            </div>
          </div>
        )}

        {(!['split_promo', 'hero_showcase', 'menu_board', 'picture_no_bg'].includes(slide.template)) && (
          <div className="h-full w-full flex items-center justify-center bg-stone-900 animate-fadeIn relative overflow-hidden">
            {slide.image_url && (
              <img
                src={slide.image_url}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
              />
            )}
            <div className="relative text-center z-10 px-[5vw] py-[4vh] max-w-[90vw] overflow-hidden">
              <h1 className="font-serif font-bold text-[clamp(2rem,7vmin,4.5rem)] leading-tight line-clamp-2 text-balance break-words">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-[clamp(1rem,3vmin,1.8rem)] line-clamp-2 text-balance break-words">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator — animates per-slide duration */}
      <div
        key={`${slide.id}-${currentIndex}`}
        className="fixed bottom-0 left-0 h-1 bg-amber-500 z-50 tv-progress"
        style={{ animationDuration: `${slideDuration}s` }}
      />
    </div>
  );
};
