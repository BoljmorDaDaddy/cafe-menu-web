import React from 'react';
import { Tag } from 'lucide-react';

interface PromoBannerProps {
  onActionClick: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onActionClick }) => {
  return (
    <div className="w-full my-8">
      {/* Special Offer Header matching Image 1 */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg font-bold text-[#1C120C]">
          Тусгай санал (Special Offer)
        </h2>
        <span className="text-xs text-amber-700 font-semibold">
          Хязгаарлагдмал хугацаатай
        </span>
      </div>

      {/* Dark Espresso Banner matching Image 1 */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#1C120C] via-[#231710] to-[#140C08] text-white p-5 sm:p-6 shadow-lg border border-[#332218] overflow-hidden flex items-center justify-between gap-4">
        {/* Left Text */}
        <div className="space-y-2 max-w-xs z-10">
          <h3 className="font-serif text-lg sm:text-xl font-extrabold leading-snug tracking-tight text-white">
            Get <span className="text-amber-500">20% OFF</span> on your combo order
          </h3>
          <p className="text-xs text-stone-300">
            Өдөр бүр 14:00 - 17:00 цагийн хооронд халуун кофе ба нарийн боовны комбо сонголтуудад.
          </p>

          <div className="pt-1">
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-[#1C120C] text-xs font-bold shadow-md transition-transform active:scale-95"
            >
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Use Code: COFFEE20</span>
            </button>
          </div>
        </div>

        {/* Right Coffee Cup with Beans (exact match to Image 1) */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80"
            alt="Takeaway Coffee Cup on roasted coffee beans"
            className="w-full h-full object-cover rounded-xl shadow-md border border-[#3A281E]"
          />
        </div>
      </div>
    </div>
  );
};
