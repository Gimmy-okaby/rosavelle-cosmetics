import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  MessageSquare, 
  X, 
  ShoppingBag, 
  Truck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function OrderSuccessModal() {
  const { lastOrderPlaced, setLastOrderPlaced, lang, formatPrice, storeSettings } = useStore();

  if (!lastOrderPlaced) return null;

  // Prepare clean formatted WhatsApp message
  const itemsText = lastOrderPlaced.items
    .map(i => `• ${i.name_ar || i.name} (كمية: ${i.quantity}) - ${i.price} ج.م`)
    .join('\n');

  const paymentMethodLabels = {
    cod: 'دفع عند الاستلام',
    instapay: 'إنستاباي / محفظة إلكترونية',
    card: 'بطاقة بنكية'
  };

  const whatsappMessage = encodeURIComponent(
`مرحباً ${storeSettings.storeName_ar} ✨
أود تأكيد طلبي الجديد من الموقع:

رقم الطلب: ${lastOrderPlaced.id}
اسم العميل: ${lastOrderPlaced.customer.name}
رقم الهاتف: ${lastOrderPlaced.customer.phone}
العنوان: ${lastOrderPlaced.customer.governorate_name || ''} - ${lastOrderPlaced.customer.address}

المنتجات:
${itemsText}

المجموع الكلي: ${lastOrderPlaced.total} ج.م
طريقة الدفع: ${paymentMethodLabels[lastOrderPlaced.paymentMethod] || lastOrderPlaced.paymentMethod}

شكراً لكم!`
  );

  const cleanPhone = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-[#181320] text-stone-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-500/40 p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setLastOrderPlaced(null)}
          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-5 animate-bounce shadow-xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
          {lang === 'ar' ? 'تم استلام طلبك بنجاح! 🎉' : 'Order Placed Successfully! 🎉'}
        </h3>

        <p className="text-sm text-stone-300 font-medium mb-6">
          {lang === 'ar'
            ? 'شكراً لثقتك في روزافيل كوزمتكس. سيقوم فريق خدمة العملاء بالتواصل معك لتأكيد موعد الشحن.'
            : 'Thank you for choosing Rosavelle Cosmetics. Our support team will contact you to verify dispatch.'}
        </p>

        {/* Order Details Card */}
        <div className="bg-[#1F1928] p-5 rounded-2xl border border-rose-950/60 text-start space-y-2.5 text-xs sm:text-sm mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-rose-950/40">
            <span className="text-stone-400 font-bold">{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
            <span className="font-mono font-black text-amber-300 text-base">{lastOrderPlaced.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-bold">{lang === 'ar' ? 'الاسم:' : 'Customer:'}</span>
            <span className="font-bold text-white">{lastOrderPlaced.customer.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-400 font-bold">{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
            <span className="font-bold text-white">{lastOrderPlaced.customer.phone}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-rose-950/40">
            <span className="text-stone-400 font-bold">{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total:'}</span>
            <span className="font-black text-amber-300 text-lg">{formatPrice(lastOrderPlaced.total)}</span>
          </div>
        </div>

        {/* WhatsApp Notification Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 transition mb-3"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>{lang === 'ar' ? 'متابعة وتأكيد الطلب عبر واتساب' : 'Track Order on WhatsApp'}</span>
        </a>

        <button
          onClick={() => setLastOrderPlaced(null)}
          className="w-full text-sm font-bold text-stone-400 hover:text-white py-2"
        >
          {lang === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
        </button>

      </div>
    </div>
  );
}
