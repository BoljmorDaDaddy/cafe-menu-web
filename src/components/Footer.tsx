import React from 'react';
import { Coffee, MapPin, Clock, Phone, Wifi } from 'lucide-react';
import { CafeSettings } from '../types';

interface FooterProps {
  settings: CafeSettings;
  onNavigate: (view: 'menu' | 'tv' | 'admin' | '404') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="winter-cloud-footer w-full text-[#123F36] pt-12 pb-12 sm:pb-12 mt-16">
      <div className="winter-footer-cloud-art" aria-hidden="true">
        <svg viewBox="0 0 1440 1440" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="footer-cloud-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F7FBFD" stopOpacity="0.96" />
              <stop offset="0.38" stopColor="#DCEAF0" stopOpacity="0.94" />
              <stop offset="1" stopColor="#A9BEC8" stopOpacity="0.92" />
            </linearGradient>
            <filter id="footer-cloud-merge" x="-8%" y="-65%" width="116%" height="230%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="soft-cloud" />
              <feComponentTransfer in="soft-cloud" result="joined-cloud">
                <feFuncA type="linear" slope="12" intercept="-4.1" />
              </feComponentTransfer>
              <feFlood floodColor="#FFFFFF" result="white-cloud" />
              <feComposite in="white-cloud" in2="joined-cloud" operator="in" />
            </filter>
            <filter id="footer-cloud-depth" x="-8%" y="-55%" width="116%" height="210%">
              <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#607986" floodOpacity="0.34" />
            </filter>
            <mask id="footer-cloud-mask" maskUnits="userSpaceOnUse" x="-80" y="0" width="1600" height="1440">
              <g filter="url(#footer-cloud-merge)" fill="#FFFFFF">
                <ellipse cx="40" cy="944" rx="176" ry="176" />
                <ellipse cx="330" cy="944" rx="176" ry="176" />
                <ellipse cx="620" cy="944" rx="176" ry="176" />
                <ellipse cx="910" cy="944" rx="176" ry="176" />
                <ellipse cx="1200" cy="944" rx="176" ry="176" />
                <ellipse cx="1490" cy="944" rx="176" ry="176" />
                <ellipse cx="-100" cy="1120" rx="170" ry="170" />
                <ellipse cx="190" cy="1120" rx="170" ry="170" />
                <ellipse cx="480" cy="1120" rx="170" ry="170" />
                <ellipse cx="770" cy="1120" rx="170" ry="170" />
                <ellipse cx="1060" cy="1120" rx="170" ry="170" />
                <ellipse cx="1350" cy="1120" rx="170" ry="170" />
                <ellipse cx="1640" cy="1120" rx="170" ry="170" />
                <ellipse cx="720" cy="1345" rx="1120" ry="205" />
              </g>
            </mask>
          </defs>
          <rect
            width="1440"
            height="1440"
            fill="#718A96"
            opacity="0.66"
            mask="url(#footer-cloud-mask)"
            transform="translate(0 18)"
          />
          <rect
            width="1440"
            height="1440"
            fill="url(#footer-cloud-body)"
            mask="url(#footer-cloud-mask)"
            filter="url(#footer-cloud-depth)"
          />
          <path d="M90 1240c62-38 126-39 182-13m178-113c55-34 111-30 155 0m156-65c64-33 125-24 165 13m135 45c58-32 112-21 148 12" fill="none" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" opacity="0.32" mask="url(#footer-cloud-mask)" />
          <path d="M245 1300c58-24 108-17 149 7m450-202c46-19 91-12 127 9m297 18c41-18 78-10 110 11" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.34" mask="url(#footer-cloud-mask)" />
        </svg>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-[#2A6B5C]/30">
          {/* Cafe Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C49A45]">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold text-[#123F36] uppercase tracking-wider">
                {settings.cafe_name}
              </span>
            </div>
            <p className="text-xs font-medium text-[#123F36] leading-relaxed">
              {settings.tagline || 'Тансаг амт, тав тухтай орчин. Шинэхэн бэлтгэсэн хоол ба гар аргаар исгэсэн кофе.'}
            </p>
            
          </div>

          {/* Opening Hours & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#123F36] uppercase tracking-wider">
              Цагийн хуваарь & Хаяг
            </h4>
            <div className="space-y-2 text-xs font-medium text-[#123F36]">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span>{settings.opening_hours}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A45] shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-[#123F36] gap-2">
          <p>© {new Date().getFullYear()} Mo's Cafe. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="text-[#123F36]">Artisan Food & Specialty Coffee Experience</p>
        </div>
      </div>
    </footer>
  );
};
