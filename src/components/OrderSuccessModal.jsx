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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100 p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setLastOrderPlaced(null)}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-stone-900 mb-1">
          {lang === 'ar' ? 'تم استلام طلبك بنجاح! 🎉' : 'Order Placed Successfully! 🎉'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          {lang === 'ar' 
            ? `شكراً لتسوقك من ${storeSettings.storeName_ar}. سيتم تجهيز وشحن طلبك بأعلى عناية.` 
            : `Thank you for shopping with ${storeSettings.storeName_en}. Your order is being prepared.`}
        </p>

        {/* Order ID Badge */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 mb-6 text-start">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <span className="text-xs text-stone-500">{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
            <span className="font-mono font-extrabold text-stone-900 text-base">{lastOrderPlaced.id}</span>
          </div>

          <div className="py-2.5 space-y-1.5 text-xs text-stone-600 border-b border-stone-200">
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'المستلم:' : 'Recipient:'}</span>
              <span className="font-semibold text-stone-800">{lastOrderPlaced.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
              <span className="font-semibold text-stone-800">{lastOrderPlaced.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'العنوان:' : 'Address:'}</span>
              <span className="font-semibold text-stone-800 truncate max-w-[200px]">{lastOrderPlaced.customer.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-sm font-extrabold text-stone-900">
            <span>{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
            <span className="text-rose-600 text-base">{formatPrice(lastOrderPlaced.total)}</span>
          </div>
        </div>

        {/* Big Action: WhatsApp Instant Confirmation Button */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{lang === 'ar' ? 'تأكيد وشحن الطلب عبر واتساب 💬' : 'Confirm Order via WhatsApp 💬'}</span>
          </a>

          <button
            onClick={() => setLastOrderPlaced(null)}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-2xl font-semibold text-xs transition"
          >
            {lang === 'ar' ? 'متابعة التسوق في المتجر' : 'Continue Shopping'}
          </button>
        </div>

      </div>
    </div>
  );
}
