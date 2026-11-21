import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-rose-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 animate-bounce-short">
      <div className="bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-stone-800 text-sm font-medium">
        {icons[toastMessage.type] || icons.success}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
}
