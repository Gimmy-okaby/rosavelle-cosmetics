import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart,
  Send,
  CreditCard
} from 'lucide-react';

export default function Footer() {
  const { lang, storeSettings, setSelectedCategory, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(
      lang === 'ar' 
        ? 'تم اشتراكك بنجاح! استخدمي كود BEAUTY10 للحصول على خصم 10% ✨' 
        : 'Subscribed! Use code BEAUTY10 for 10% OFF ✨'
    );
    setNewsletterEmail('');
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Callout Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-800 to-stone-850 border border-stone-700/80 p-6 sm:p-10 mb-16 overflow-hidden">
          <div className="absolute top-0 end-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? "نادي روزافيل للجمال" : "Rosavelle VIP Club"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {lang === 'ar' 
                  ? "اشتركي الآن واحصلي على خصم 10% على طلبك الأول" 
                  : "Subscribe & Get 10% Off Your First Order"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                {lang === 'ar' 
                  ? "كوني أول من يتعرف على أحدث صيحات الجمال والمنتجات الحصرية والعروض الموسمية." 
                  : "Be the first to know about new arrivals, beauty rituals, and exclusive offers."}
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder={lang === 'ar' ? "أدخلي بريدك الإلكتروني..." : "Enter your email..."}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-stone-900/80 border border-stone-700 rounded-full py-3 px-5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition shadow-md"
                >
                  {lang === 'ar' ? "اشتراك" : "Join"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800 text-xs sm:text-sm">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold tracking-widest text-white">
                ROSAVELLE
              </span>
              <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold px-2 py-0.5 bg-rose-950/60 rounded-full border border-rose-800/60">
                Paris
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs max-w-sm">
              {lang === 'ar'
                ? "وجهتك الأولى لمستحضرات التجميل والعناية بالبشرة الفاخرة، تركيبات نظيفة ومعتمدة تمنحك الثقة والتألق الدائم."
                : "Your premier destination for luxury cosmetics and clean clinical skincare, crafted to deliver effortless radiant beauty."}
            </p>
            <div className="flex items-center gap-3 text-stone-400 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? "منتجات أصلية 100%" : "100% Authentic"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{lang === 'ar' ? "تركيبات خالية من القسوة" : "Cruelty Free"}</span>
              </div>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? "أقسام المتجر" : "Categories"}
            </h4>
            <ul className="space-y-2 text-stone-400">
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => {
                      setSelectedCategory(c.id);
                      scrollToProducts();
                    }}
                    className="hover:text-rose-300 transition text-start"
                  >
                    {lang === 'ar' ? c.name_ar : c.name_en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? "خدمة العملاء" : "Customer Care"}
            </h4>
            <ul className="space-y-2.5 text-stone-400 text-xs">
              <li>
                <a 
                  href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{storeSettings.whatsappNumber}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-300" />
                <span>support@rosavelle-eg.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{lang === 'ar' ? "القاهرة، جمهورية مصر العربية" : "Cairo, Egypt"}</span>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {lang === 'ar' ? "طرق الدفع المدعومة" : "Payment Methods"}
            </h4>
            <p className="text-xs text-stone-400">
              {lang === 'ar' 
                ? "دفع عند الاستلام، إنستاباي، فودافون كاش، وبطاقات الفيزا وماستركارد وميزة." 
                : "Cash on delivery, InstaPay, Vodafone Cash, and Bank Cards."}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-stone-800 rounded-md text-[11px] font-semibold text-stone-300 border border-stone-700">
                Cash on Delivery
              </span>
              <span className="px-2.5 py-1 bg-purple-950/60 rounded-md text-[11px] font-semibold text-purple-300 border border-purple-800">
                InstaPay
              </span>
              <span className="px-2.5 py-1 bg-rose-950/60 rounded-md text-[11px] font-semibold text-rose-300 border border-rose-800">
                Vodafone Cash
              </span>
              <span className="px-2.5 py-1 bg-stone-800 rounded-md text-[11px] font-semibold text-stone-300 border border-stone-700">
                Visa / Meeza
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {storeSettings.storeName_ar} | Rosavelle Cosmetics. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>{lang === 'ar' ? "مجهّز ومبرمج وجاهز للربط بالدومين فوراً" : "Production Ready E-Commerce Platform"}</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
