import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Truck, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { lang, setSelectedCategory } = useStore();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F5EBE6] via-[#FAF7F5] to-[#FAF7F5] pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-stone-200/60">
      
      {/* Decorative Glow Blobs */}
      <div className="absolute top-10 start-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 end-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-rose-200/80 shadow-xs text-xs font-semibold text-rose-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>
                {lang === 'ar' ? "المجموعة الحصرية الجديدة 2026 متوفرة الآن" : "New Exclusive 2026 Collection Live"}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight sm:leading-tight">
              {lang === 'ar' ? (
                <>
                  تألقي بجمال طبيعي <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600">
                    يخطف الأنظار والقلوب
                  </span>
                </>
              ) : (
                <>
                  Radiate Effortless Elegance <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600">
                    With Luxury French Formulations
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {lang === 'ar' ? (
                "مستحضرات تجميل وعناية بالبشرة أصلية 100% مستخلصة من أنقى المكونات الطبيعية والمختبرة معملياً، لتمنحك إشراقة مخملية دائمة وثقة لا تنتهي."
              ) : (
                "Pure Parisian-inspired cosmetics and clinical skincare meticulously crafted to enhance your natural beauty with clean, dermatologist-approved ingredients."
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={scrollToProducts}
                className="flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{lang === 'ar' ? "تسوقي المجموعة الآن" : "Shop Collection"}</span>
                <ArrowIcon className="w-4 h-4 text-rose-300" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('skincare');
                  scrollToProducts();
                }}
                className="bg-white/80 hover:bg-white text-stone-800 border border-stone-300/80 px-6 py-3.5 rounded-full font-medium text-sm transition-all shadow-xs hover:shadow"
              >
                {lang === 'ar' ? "منتجات العناية بالبشرة" : "Explore Skincare"}
              </button>
            </div>

            {/* Quick Metrics / Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-stone-900">4.9 ★</span>
                <span className="text-stone-500">{lang === 'ar' ? "(أكثر من 5,000 عميلة سعيدة)" : "(5,000+ happy clients)"}</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-stone-700">{lang === 'ar' ? "توصيل خلال 24-48 ساعة" : "Fast delivery"}</span>
              </div>
            </div>

          </div>

          {/* Hero Visual Card / Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=900&q=85" 
                  alt="Rosavelle Paris Cosmetics Collection" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Discount Tag */}
                <div className="absolute top-4 start-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-rose-100 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'ar' ? "خصومات حتى 25%" : "Up to 25% OFF"}</span>
                </div>

                {/* Floating Bottom Product Snippet */}
                <div className="absolute bottom-4 inset-x-4 glass-card p-3.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80" 
                      alt="Serum" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {lang === 'ar' ? "سيروم الهيالورونيك الفرنسي" : "Pure Hyaluronic Serum"}
                    </p>
                    <p className="text-[11px] text-rose-600 font-semibold">
                      {lang === 'ar' ? "المنتج الأكثر طلباً هذا الأسبوع ✨" : "Weekly Top Bestseller ✨"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature Trust Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-stone-200/50 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {lang === 'ar' ? "شحن مجاني وسريع" : "Free Fast Shipping"}
              </h4>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar' ? "للطلبات أكثر من 600 ج.م" : "On orders over 600 EGP"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-stone-200/50 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {lang === 'ar' ? "منتجات أصلية 100%" : "100% Authentic"}
              </h4>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar' ? "ضمان الجودة والأمان" : "Dermatologist approved"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-stone-200/50 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {lang === 'ar' ? "دفع عند الاستلام" : "Cash on Delivery"}
              </h4>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar' ? "أو إنستاباي ومحافظ ذكية" : "Or InstaPay & Wallets"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-stone-200/50 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {lang === 'ar' ? "استرجاع واستبدال مرن" : "Easy 14-Day Returns"}
              </h4>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar' ? "خلال 14 يوم بكل سهولة" : "Hassle-free guarantee"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
