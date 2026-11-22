import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const { lang, storeSettings } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanPhone = (storeSettings.whatsappNumber || '+201012345678').replace(/[^0-9]/g, '');
  const greeting = lang === 'ar'
    ? encodeURIComponent('مرحباً روزافيل كوزمتكس، أود الاستفسار عن المنتجات والعروض الحالية ✨')
    : encodeURIComponent('Hello Rosavelle Cosmetics, I would like to inquire about current products and offers ✨');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;

  return (
    <div className={`fixed bottom-20 sm:bottom-6 ${lang === 'ar' ? 'left-4' : 'right-4'} z-40 flex items-center gap-2 group`}>
      {/* Tooltip Prompt */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-stone-200/80 text-xs font-semibold text-stone-800 animate-fade-in">
          <span>{lang === 'ar' ? 'محتارة في اختيار الروتين؟ كلمينا واتساب 💬' : 'Need skincare advice? Chat with us! 💬'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Pulsing WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-full shadow-lg shadow-emerald-900/30 hover:scale-110 active:scale-95 transition-all duration-300"
        title={lang === 'ar' ? 'تواصل معنا على واتساب' : 'Chat on WhatsApp'}
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none" />
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
      </a>
    </div>
  );
}
