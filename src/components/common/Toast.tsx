import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#18211C] text-white text-xs sm:text-sm font-medium rounded-xl shadow-2xl border border-white/10 animate-fade-in max-w-sm">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="truncate">{toast}</span>
    </div>
  );
};
