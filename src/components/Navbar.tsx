import React from 'react';
import { Search, Bell, Menu, ShieldCheck, Tv, Sparkles, X } from 'lucide-react';
import type { CafeSettings } from '../types';

interface NavbarProps {
  settings: CafeSettings;
  activeView: 'menu' | 'tv' | 'admin' | '404';
  onNavigate: (view: 'menu' | 'tv' | 'admin') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  onOpenAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeView,
  onNavigate,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  setIsSearchOpen,
  onOpenAiChat,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#123F36] text-[#E8DCC4] shadow-md border-b border-[#2A6B5C]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src="/src/assets/logo.png" alt="Mo's Cafe Logo" className="w-8 h-8 object-contain" />
          <span className="font-serif font-bold text-sm sm:text-base tracking-tight">Mo's Cafe</span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search coffee, food..."
              className="w-full pl-9 pr-8 py-2 bg-[#E8DCC4] text-[#123F36] text-xs sm:text-sm rounded-full placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C49A45] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: AI Assistant Toggle Only */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAiChat}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/15 text-[#E8DCC4] transition-colors"
            title="AI туслах"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C49A45] ring-2 ring-[#123F36]" />
          </button>
        </div>
      </div>
    </header>
  );
};
