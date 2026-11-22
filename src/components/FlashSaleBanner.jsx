import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Clock, Copy, Check, Sparkles } from 'lucide-react';

export default function FlashSaleBanner() {
  const { lang, addToast } = useStore();
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 38,
    seconds: 45
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('GLAM20');
    setCopied(true);
    addToast(lang === 'ar' ? 'تم نسخ كود الخصم GLAM20 بنجاح!' : 'Coupon GLAM20 copied!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white py-4 px-4 overflow-hidden relative shadow-md">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Deal Info */}
        <div className="flex items-center gap-3 text-center md:text-start">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0 animate-pulse">
            <Flame className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full">
                {lang === 'ar' ? 'عرض خاص محدود' : 'Flash Offer'}
              </span>
              <span className="text-xs text-rose-200">
                {lang === 'ar' ? 'خصم 20% على طلبات أكثر من 700 ج.م' : '20% OFF on orders over 700 EGP'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {lang === 'ar' 
                ? 'استخدم كود GLAM20 عند إتمام الطلب الآن' 
                : 'Use code GLAM20 at checkout for instant luxury savings'}
            </h4>
          </div>
        </div>

        {/* Countdown & Action */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 font-mono text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1.5 rounded-lg min-w-[38px]">
              <span className="text-sm sm:text-base font-bold text-rose-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="block text-[9px] text-stone-300 font-sans uppercase">س</span>
            </div>
            <span className="text-rose-400 font-bold">:</span>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1.5 rounded-lg min-w-[38px]">
              <span className="text-sm sm:text-base font-bold text-rose-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="block text-[9px] text-stone-300 font-sans uppercase">د</span>
            </div>
            <span className="text-rose-400 font-bold">:</span>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1.5 rounded-lg min-w-[38px]">
              <span className="text-sm sm:text-base font-bold text-rose-400 animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="block text-[9px] text-stone-300 font-sans uppercase">ث</span>
            </div>
          </div>

          {/* Copy Coupon Code Button */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold transition-all active:scale-95 text-white"
            title={lang === 'ar' ? 'نسخ الكود' : 'Copy code'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>GLAM20</span>
          </button>

          {/* Shop Now CTA */}
          <button
            onClick={scrollToProducts}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/40 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تسوقي العرض' : 'Shop Deal'}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
