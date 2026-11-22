import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, X } from 'lucide-react';

const RECENT_PURCHASES = [
  {
    name_ar: 'سارة من المعادي - القاهرة',
    name_en: 'Sara from Maadi, Cairo',
    product_ar: 'سيروم الهيالورونيك المركّز للترطيب الفوري',
    product_en: 'Ultra Pure Hyaluronic Acid Hydrating Serum',
    time_ar: 'منذ دقيقتين',
    time_en: '2 minutes ago',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80'
  },
  {
    name_ar: 'مي من سموحة - الإسكندرية',
    name_en: 'Mai from Smouha, Alexandria',
    product_ar: 'عطر ميس لورين - فانيلا مسك فاخر',
    product_en: 'Miss Lorraine Luxury Vanilla Musk Perfume',
    time_ar: 'منذ 5 دقائق',
    time_en: '5 minutes ago',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=150&q=80'
  },
  {
    name_ar: 'نوران من الدقي - الجيزة',
    name_en: 'Nouran from Dokki, Giza',
    product_ar: 'أحمر شفاه مخملي مطفي - فيلفيت كيس',
    product_en: 'Velvet Matte Luxe Lipstick',
    time_ar: 'منذ 9 دقائق',
    time_en: '9 minutes ago',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=150&q=80'
  },
  {
    name_ar: 'ياسمين من المنصورة - الدقهلية',
    name_en: 'Yasmine from Mansoura, Dakahlia',
    product_ar: 'كريم الإشراقة وتجديد خلايا البشرة بفيتامين C',
    product_en: 'Radiance Renewal Vitamin C Face Cream',
    time_ar: 'منذ 12 دقيقة',
    time_en: '12 minutes ago',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&q=80'
  }
];

export default function RecentSalesNotification() {
  const { lang } = useStore();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let index = 0;
    // Show first notification after 6 seconds
    const initialTimeout = setTimeout(() => {
      showNextNotification();
    }, 6000);

    const interval = setInterval(() => {
      showNextNotification();
    }, 18000);

    function showNextNotification() {
      setCurrentNotification(RECENT_PURCHASES[index % RECENT_PURCHASES.length]);
      setVisible(true);
      index++;

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5500);
    }

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (!currentNotification || !visible || dismissed) return null;

  return (
    <div className={`fixed bottom-20 sm:bottom-6 ${lang === 'ar' ? 'right-4' : 'left-4'} z-30 max-w-sm bg-white/95 backdrop-blur-md border border-rose-200/80 rounded-2xl p-3 shadow-xl transition-all duration-500 animate-slide-up flex items-center gap-3`}>
      {/* Product Thumbnail */}
      <img
        src={currentNotification.image}
        alt="Product"
        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-100 shadow-sm"
      />

      {/* Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="font-semibold text-stone-900 truncate">
            {lang === 'ar' ? currentNotification.name_ar : currentNotification.name_en}
          </span>
        </div>
        <p className="text-xs font-medium text-rose-900 truncate mt-0.5">
          {lang === 'ar' ? currentNotification.product_ar : currentNotification.product_en}
        </p>
        <span className="text-[10px] text-stone-400 block">
          {lang === 'ar' ? currentNotification.time_ar : currentNotification.time_en}
        </span>
      </div>

      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        className="text-stone-400 hover:text-stone-600 p-1 shrink-0 rounded-full hover:bg-stone-100 transition-colors"
        title="إغلاق"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
