import React from 'react';
import { Coffee, Home, Tv, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateToMenu: () => void;
  onNavigateToTv: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateToMenu,
  onNavigateToTv,
}) => {
  return (
    <main className="min-h-screen bg-[#160E09] text-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/20 shadow-2xl space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Coffee className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-amber-400 font-mono text-sm tracking-widest uppercase block mb-1">
            404 · Хуудас олдсонгүй
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
            Энэ хуудас цэсэнд байхгүй байна
          </h1>
          <p className="text-sm text-stone-300 mt-3 leading-relaxed">
            Таны хайсан хуудас устгагдсан эсвэл хаяг буруу байна. Манай халуун кофе, амтат хоолны цэс рүү буцаж зочилно уу.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToMenu}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Цэс рүү очих</span>
          </button>

          <button
            onClick={onNavigateToTv}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-chip hover:bg-white/15 text-stone-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Tv className="w-4 h-4 text-amber-400" />
            <span>TV Слайд үзэх</span>
          </button>
        </div>

        {/* Breadcrumb back link */}
        <div className="pt-4 border-t border-amber-900/30">
          <button
            onClick={onNavigateToMenu}
            className="text-xs text-amber-300/80 hover:text-amber-200 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Нүүр хуудас руу буцах</span>
          </button>
        </div>
      </div>
    </main>
  );
};
