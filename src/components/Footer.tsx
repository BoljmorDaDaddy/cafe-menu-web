import React from 'react';
import { Coffee, MapPin, Clock, Phone, Wifi } from 'lucide-react';
import { CafeSettings } from '../types';

interface FooterProps {
  settings: CafeSettings;
  onNavigate: (view: 'menu' | 'tv' | 'admin' | '404') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="w-full bg-[#123F36] border-t border-[#2A6B5C] text-[#E8DCC4] pt-12 pb-12 sm:pb-12 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-[#2A6B5C]/30">
          {/* Cafe Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C49A45]">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold text-[#E8DCC4] uppercase tracking-wider">
                {settings.cafe_name}
              </span>
            </div>
            <p className="text-xs text-[#E8DCC4]/70 leading-relaxed">
              {settings.tagline || 'Тансаг амт, тав тухтай орчин. Шинэхэн бэлтгэсэн хоол ба гар аргаар исгэсэн кофе.'}
            </p>
            
          </div>

          {/* Opening Hours & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8DCC4] uppercase tracking-wider">
              Цагийн хуваарь & Хаяг
            </h4>
            <div className="space-y-2 text-xs text-[#E8DCC4]/70">
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8DCC4]/50 gap-2">
          <p>© {new Date().getFullYear()} Mo's Cafe. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p className="text-[#C49A45]/70">Artisan Food & Specialty Coffee Experience</p>
        </div>
      </div>
    </footer>
  );
};
