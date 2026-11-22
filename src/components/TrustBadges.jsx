import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function TrustBadges() {
  const { lang } = useStore();

  const badges = [
    {
      icon: Truck,
      title_ar: 'توصيل سريع ومضمون',
      title_en: 'Express Fast Delivery',
      desc_ar: 'شحن لجميع محافظات مصر خلال 24 - 48 ساعة مع معاينة المنتج',
      desc_en: 'To all Egypt governorates with open-box verification',
      gradient: 'from-amber-500/20 to-rose-500/20',
      iconColor: 'text-amber-400'
    },
    {
      icon: ShieldCheck,
      title_ar: 'أصلي 100% ومضمون',
      title_en: '100% Authentic Beauty',
      desc_ar: 'مستحضرات تجميل ومكونات فرنسية معتمدة وآمنة على البشرة',
      desc_en: 'Certified skin-safe formulas from top global laboratories',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      icon: CreditCard,
      title_ar: 'دفع مرن عند الاستلام',
      title_en: 'Flexible Easy Payments',
      desc_ar: 'كاش عند الاستلام، إنستاباي، أو فودافون كاش بكل سهولة وأمان',
      desc_en: 'Cash on delivery, InstaPay, or Vodafone Cash with zero hassle',
      gradient: 'from-rose-500/20 to-purple-500/20',
      iconColor: 'text-rose-400'
    },
    {
      icon: Sparkles,
      title_ar: 'هدايا وعينات فاخرة',
      title_en: 'Free Luxury Samples',
      desc_ar: 'هدية حصرية وعينات تجربة مجانية مع كل طلب يزيد عن 600 ج.م',
      desc_en: 'Exclusive gifts and trial samples with orders over 600 EGP',
      gradient: 'from-pink-500/20 to-amber-500/20',
      iconColor: 'text-pink-400'
    }
  ];

  return (
    <section className="w-full py-10 bg-[#100D14] border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="group relative p-5 sm:p-6 rounded-2xl bg-[#18131E] border border-rose-950/60 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/40 hover:-translate-y-1 flex flex-col items-center text-center sm:items-start sm:text-start"
              >
                {/* Glowing Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                  <Icon className={`w-7 h-7 ${b.iconColor}`} />
                </div>

                <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug">
                  {lang === 'ar' ? b.title_ar : b.title_en}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed hidden sm:block font-medium">
                  {lang === 'ar' ? b.desc_ar : b.desc_en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
