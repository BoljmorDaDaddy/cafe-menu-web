import React from 'react';
import { Home, Utensils, Tv, Sparkles, User } from 'lucide-react';

interface BottomNavProps {
  activeView: 'menu' | 'tv' | 'admin' | '404';
  activeSection: 'all' | 'food' | 'drink';
  onNavigate: (view: 'menu' | 'tv' | 'admin') => void;
  onSelectSection: (sec: 'all' | 'food' | 'drink') => void;
  onOpenAi: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  activeSection,
  onNavigate,
  onSelectSection,
  onOpenAi,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#123F36] text-[#E8DCC4] border-t border-[#2A6B5C] shadow-xl py-2 px-4">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => {
            onNavigate('menu');
            onSelectSection('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'menu' && activeSection === 'all'
              ? 'text-[#C49A45] font-bold'
              : 'text-[#E8DCC4]/60 hover:text-[#E8DCC4]'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Menu */}
        <button
          onClick={() => {
            onNavigate('menu');
            onSelectSection('food');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'menu' && activeSection === 'food'
              ? 'text-[#C49A45] font-bold'
              : 'text-[#E8DCC4]/60 hover:text-[#E8DCC4]'
          }`}
          aria-label="Menu"
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>

        {/* 3. AI Assistant */}
        <button
          onClick={onOpenAi}
          className="flex flex-col items-center gap-1 text-[#E8DCC4]/60 hover:text-[#C49A45] transition-colors"
          aria-label="Mo's AI"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">AI Chat</span>
        </button>

        {/* 4. Profile */}
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === 'admin'
              ? 'text-[#C49A45] font-bold'
              : 'text-[#E8DCC4]/60 hover:text-[#E8DCC4]'
          }`}
          aria-label="Profile"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
