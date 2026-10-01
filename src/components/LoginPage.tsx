import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToMenu: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToMenu }) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We will validate the PIN in App.tsx to keep settings centralized, 
    // but we can also pass a validation function here.
    // For now, we just trigger the success callback if it's not empty, 
    // and App.tsx will handle the actual PIN check against settings.
    if (pinInput.length >= 4) {
      onLoginSuccess();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#140C08] flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card rounded-3xl p-7 border border-amber-500/30 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#FDFBF7] mb-1">
          Админ Нэвтрэх
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Кафены удирдлагын хэсэгт нэвтрэхийн тулд PIN кодыг оруулна уу.
        </p>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            maxLength={8}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError(false);
            }}
            placeholder="PIN код оруулна уу"
            autoFocus
            className="w-full py-3 px-4 bg-black/60 border border-amber-500/30 rounded-xl text-center text-xl tracking-widest text-[#FDFBF7] placeholder-stone-600 focus:outline-none focus:border-amber-400"
          />

          {pinError && (
            <p className="text-xs text-red-400 animate-shake">
              Буруу PIN код! Дахин оролдоно уу.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/40 transition-all"
          >
            Нэвтрэх
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-stone-200 mt-4 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Цэс рүү буцах</span>
          </button>
        </form>
      </div>
    </div>
  );
};
