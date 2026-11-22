import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowLeft, ArrowRight, Star, ShieldCheck, Flame } from 'lucide-react';

export default function Hero() {
  const { lang, setSelectedCategory } = useStore();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#16121B] via-[#120F16] to-[#0F0E11] pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-rose-950/50">
      
      {/* Decorative Glow Blobs */}
      <div className="absolute top-10 start-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-start">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/60 border border-amber-500/30 text-xs sm:text-sm font-bold text-amber-300 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {lang === 'ar' ? "✨ تشكيلة 2026 الحصرية متوفرة الآن بأعلى جودة" : "✨ Exclusive 2026 Beauty Collection Live"}
              </span>
            </div>

            {/* Main Headline - Ultra Large & Bold */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight sm:leading-none">
              {lang === 'ar' ? (
                <>
                  جمالك الباريسي <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-pink-500">
                    بسحر يخطف القلوب
                  </span>
                </>
              ) : (
                <>
                  Radiate Luxury <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-pink-500">
                    With French Elegance
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle - Bigger text */}
            <p className="text-stone-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {lang === 'ar' ? (
                "مستحضرات تجميل وعناية بالبشرة أصلية 100% مستخلصة من أنقى المكونات الطبيعية والمختبرة معملياً، لتمنحك إشراقة مخملية دائمة وثقة لا تنتهي."
              ) : (
                "Pure Parisian-inspired cosmetics and clinical skincare meticulously crafted to enhance your natural beauty with clean, dermatologist-approved ingredients."
              )}
            </p>

            {/* Action Buttons - Bigger & Bolder */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToProducts}
                className="flex items-center gap-3 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-9 py-4 rounded-2xl font-extrabold text-base sm:text-lg transition-all shadow-xl shadow-rose-950/60 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{lang === 'ar' ? "تسوقي المجموعة الآن" : "Shop Collection"}</span>
                <ArrowIcon className="w-5 h-5 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('skincare');
                  scrollToProducts();
                }}
                className="bg-[#1C1822] hover:bg-[#251F2E] text-stone-200 hover:text-white border border-rose-900/40 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                {lang === 'ar' ? "العناية بالبشرة ✨" : "Explore Skincare ✨"}
              </button>
            </div>

            {/* Quick Metrics / Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-stone-300 font-bold">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-black text-lg text-white">4.9 / 5</span>
                <span className="text-stone-400 font-medium">{lang === 'ar' ? "(+5,000 عميلة سعيدة)" : "(5,000+ happy clients)"}</span>
              </div>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-stone-200">{lang === 'ar' ? "شحن فوري لكل مصر" : "Fast delivery"}</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main Image Card with Gold/Rose border glow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/80 border-2 border-rose-800/40 bg-[#1A1620] aspect-[4/5] group">
                <img 
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=85" 
                  alt="Rosavelle Paris Cosmetics Collection" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Discount Tag */}
                <div className="absolute top-4 start-4 bg-[#141018]/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2 text-sm font-extrabold text-amber-300">
                  <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>{lang === 'ar' ? "خصومات حصرية حتى 30%" : "Up to 30% OFF"}</span>
                </div>

                {/* Floating Bottom Product Snippet */}
                <div className="absolute bottom-4 inset-x-4 bg-[#141018]/90 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-rose-900/50 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-rose-800/40">
                    <img 
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80" 
                      alt="Serum" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {lang === 'ar' ? "سيروم الهيالورونيك الفرنسي المركّز" : "Pure Hyaluronic Serum"}
                    </p>
                    <p className="text-xs text-amber-300 font-extrabold mt-0.5">
                      {lang === 'ar' ? "الأكثر مبيعاً وتقييماً هذا الشهر ⭐" : "Top Bestseller this month ⭐"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
