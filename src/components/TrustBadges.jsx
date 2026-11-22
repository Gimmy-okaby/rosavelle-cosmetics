import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, CreditCard, Sparkles, RefreshCw, HeartHandshake } from 'lucide-react';

export default function TrustBadges() {
  const { lang } = useStore();

  const badges = [
    {
      icon: Truck,
      title_ar: 'توصيل سريع ومضمون',
      title_en: 'Fast Express Delivery',
      desc_ar: 'شحن لجميع محافظات مصر خلال 24 - 48 ساعة مع معاينة المنتج',
      desc_en: 'To all Egypt governorates with open-box verification',
      gradient: 'from-amber-500/10 to-rose-500/10',
      iconColor: 'text-rose-600'
    },
    {
      icon: ShieldCheck,
      title_ar: 'أصلي 100% ومضمون',
      title_en: '100% Authentic Beauty',
      desc_ar: 'مستحضرات تجميل ومكونات فرنسية معتمدة وآمنة على البشرة',
      desc_en: 'Certified skin-safe formulas from top global laboratories',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-600'
    },
    {
      icon: CreditCard,
      title_ar: 'دفع مرن عند الاستلام',
      title_en: 'Flexible Easy Payments',
      desc_ar: 'كاش عند الاستلام، إنستاباي، أو فودافون كاش بكل سهولة وأمان',
      desc_en: 'Cash on delivery, InstaPay, or Vodafone Cash with zero hassle',
      gradient: 'from-indigo-500/10 to-purple-500/10',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Sparkles,
      title_ar: 'هدايا وعينات فاخرة',
      title_en: 'Free Luxury Samples',
      desc_ar: 'هدية حصرية وعينات تجربة مجانية مع كل طلب يزيد عن 600 ج.م',
      desc_en: 'Exclusive gifts and trial samples with orders over 600 EGP',
      gradient: 'from-rose-500/10 to-pink-500/10',
      iconColor: 'text-rose-600'
    }
  ];

  return (
    <section className="w-full py-8 bg-white border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#FAF7F5] border border-stone-200/70 hover:border-rose-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center sm:items-start sm:text-start"
              >
                {/* Glowing Icon Container */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${b.iconColor}`} />
                </div>

                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                  {lang === 'ar' ? b.title_ar : b.title_en}
                </h3>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed hidden sm:block">
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
