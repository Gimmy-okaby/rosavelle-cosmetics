import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GOVERNORATES } from '../data/initialData';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discountAmount, 
    formatPrice, 
    lang, 
    storeSettings, 
    isFreeShipping, 
    placeOrder,
    showToast 
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    governorate: 'cairo',
    address: '',
    notes: '',
    paymentMethod: 'cod' // 'cod', 'instapay', 'card'
  });

  const [copiedInstaPay, setCopiedInstaPay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const selectedGov = GOVERNORATES.find(g => g.id === formData.governorate) || GOVERNORATES[0];
  const shippingCost = isFreeShipping ? 0 : selectedGov.shippingCost;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'instapay') {
      setCopiedInstaPay(true);
      setTimeout(() => setCopiedInstaPay(false), 2000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2000);
    }
    showToast(lang === 'ar' ? 'تم نسخ الرقم بنجاح' : 'Copied to clipboard');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast(lang === 'ar' ? 'يرجى ملء جميع البيانات الأساسية المطلوبة' : 'Please fill all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await placeOrder({
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          governorate: formData.governorate,
          governorate_name: lang === 'ar' ? selectedGov.name_ar : selectedGov.name_en,
          address: formData.address
        },
        shippingCost,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-[#181320] text-stone-100 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-rose-950/80 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-rose-950/60 flex items-center justify-between bg-[#130F18]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-white text-lg sm:text-xl">
              {lang === 'ar' ? 'إتمام وتأكيد الشحن' : 'Checkout & Confirm Order'}
            </h3>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Step 1: Customer Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-amber-300 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-rose-950 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-black">1</span>
              <span>{lang === 'ar' ? 'بيانات المستلم والتواصل' : 'Customer Information'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={lang === 'ar' ? 'مثال: سارة أحمد محمود' : 'e.g. Sarah Ahmed'}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {lang === 'ar' ? 'رقم الهاتف (واتساب متاح) *' : 'Phone Number (WhatsApp active) *'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={lang === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30] text-start"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                {lang === 'ar' ? 'البريد الإلكتروني (اختياري لتأكيد الفاتورة)' : 'Email (Optional for receipt)'}
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30]"
              />
            </div>
          </div>

          {/* Step 2: Delivery & Shipping Address */}
          <div className="space-y-4 pt-4 border-t border-rose-950/60">
            <div className="flex items-center gap-2 text-sm font-black text-amber-300 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-rose-950 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-black">2</span>
              <span>{lang === 'ar' ? 'عنوان الشحن والتوصيل' : 'Shipping Address'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {lang === 'ar' ? 'المحافظة *' : 'Governorate *'}
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30] cursor-pointer"
                >
                  {GOVERNORATES.map(gov => (
                    <option key={gov.id} value={gov.id} className="bg-stone-900 text-white font-bold">
                      {lang === 'ar' ? gov.name_ar : gov.name_en} {isFreeShipping ? '(شحن مجاني)' : `(${formatPrice(gov.shippingCost)})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  {lang === 'ar' ? 'العنوان التفصيلي *' : 'Street & Building Details *'}
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder={lang === 'ar' ? 'المنطقة، الشارع، رقم العمارة والدور، علامة مميزة' : 'Area, street, building, apartment'}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                {lang === 'ar' ? 'ملاحظات إضافية لمندوب التوصيل (اختياري)' : 'Delivery Notes (Optional)'}
              </label>
              <textarea
                name="notes"
                rows="2"
                placeholder={lang === 'ar' ? 'مثال: يُرجى الاتصال قبل الوصول بنصف ساعة...' : 'e.g. Please call before arrival...'}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full bg-[#1F1928] border border-rose-950/80 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:bg-[#251E30]"
              />
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-4 pt-4 border-t border-rose-950/60">
            <div className="flex items-center gap-2 text-sm font-black text-amber-300 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-rose-950 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs font-black">3</span>
              <span>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash On Delivery */}
              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-amber-400 bg-rose-950/70 ring-1 ring-amber-400' 
                    : 'border-rose-950/70 bg-[#1F1928] hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-6 h-6 text-emerald-400" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="accent-amber-400"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {lang === 'ar' ? 'ادفعي كاش عند استلام ومعاينة طلبك' : 'Pay when you receive items'}
                  </p>
                </div>
              </label>

              {/* InstaPay / Vodafone Cash */}
              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'instapay' 
                    ? 'border-amber-400 bg-rose-950/70 ring-1 ring-amber-400' 
                    : 'border-rose-950/70 bg-[#1F1928] hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={formData.paymentMethod === 'instapay'}
                    onChange={handleInputChange}
                    className="accent-amber-400"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {lang === 'ar' ? 'إنستاباي أو فودافون كاش' : 'InstaPay / E-Wallet'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {lang === 'ar' ? 'تحويل فوري سهل وسريع' : 'Instant digital transfer'}
                  </p>
                </div>
              </label>

              {/* Credit Card */}
              <label 
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'card' 
                    ? 'border-amber-400 bg-rose-950/70 ring-1 ring-amber-400' 
                    : 'border-rose-950/70 bg-[#1F1928] hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-6 h-6 text-amber-400" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="accent-amber-400"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {lang === 'ar' ? 'بطاقة بنكية' : 'Credit / Debit Card'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {lang === 'ar' ? 'دفع إلكتروني مشفر وآمن' : 'Encrypted secure payment'}
                  </p>
                </div>
              </label>
            </div>

            {/* InstaPay instructions box */}
            {formData.paymentMethod === 'instapay' && (
              <div className="p-4 bg-[#231A30] border border-purple-500/40 rounded-2xl text-xs space-y-3">
                <p className="font-bold text-purple-200">
                  {lang === 'ar' ? 'بيانات التحويل عبر إنستاباي أو المحفظة الإلكترونية:' : 'Transfer Account Details:'}
                </p>
                <div className="flex items-center justify-between bg-[#1A1424] p-3 rounded-xl border border-purple-500/30">
                  <div>
                    <span className="text-xs text-stone-400 block">InstaPay IPA / معرف إنستاباي:</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{storeSettings.instaPayAccount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(storeSettings.instaPayAccount, 'instapay')}
                    className="px-3 py-1.5 bg-purple-900/60 text-purple-200 hover:bg-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-500/40"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedInstaPay ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#1A1424] p-3 rounded-xl border border-purple-500/30">
                  <div>
                    <span className="text-xs text-stone-400 block">Vodafone Cash / فودافون كاش:</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{storeSettings.vodafoneCashNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(storeSettings.vodafoneCashNumber, 'vodafone')}
                    className="px-3 py-1.5 bg-purple-900/60 text-purple-200 hover:bg-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-500/40"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedVodafone ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <p className="text-xs text-purple-300 font-medium">
                  {lang === 'ar' 
                    ? '💡 بعد إتمام الطلب، سيتاح لك إرسال إشعار التحويل مباشرة عبر واتساب لتأكيد خروج الشحنة فوراً.' 
                    : '💡 After placing order, you can confirm via WhatsApp with receipt screenshot.'}
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Final Summary */}
          <div className="p-5 bg-[#1F1928] rounded-3xl border border-rose-950/80 space-y-3 text-sm">
            <h4 className="font-black text-white pb-2 border-b border-rose-950/60 text-base">
              {lang === 'ar' ? 'ملخص الفاتورة النهائية' : 'Order Invoice Summary'}
            </h4>
            <div className="flex justify-between text-stone-300 font-medium">
              <span>{lang === 'ar' ? 'قيمة المنتجات' : 'Items Subtotal'}</span>
              <span className="font-bold text-white">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>{lang === 'ar' ? 'الخصم المطبق' : 'Discount'}</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-300 font-medium">
              <span>{lang === 'ar' ? `تكلفة الشحن (${lang === 'ar' ? selectedGov.name_ar : selectedGov.name_en})` : `Shipping (${selectedGov.name_en})`}</span>
              <span className="font-bold text-amber-300">
                {shippingCost === 0 ? (lang === 'ar' ? 'مجاني 🎁' : 'Free 🎁') : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-black text-white pt-3 border-t border-rose-950/80">
              <span>{lang === 'ar' ? 'المبلغ الإجمالي المستحق' : 'Grand Total'}</span>
              <span className="text-amber-300 text-2xl font-black">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-rose-950/70 transition cursor-pointer active:scale-95"
          >
            {submitting ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-amber-300" />
                <span>{lang === 'ar' ? `تأكيد الطلب الآن (${formatPrice(grandTotal)})` : `Confirm Order Now (${formatPrice(grandTotal)})`}</span>
              </>
            )}
          </button>

          <p className="text-xs text-center text-stone-500">
            {lang === 'ar' 
              ? `بالضغط على تأكيد، أنت توافقين على شروط الاستخدام وسياسة الخصوصية لمتجر ${storeSettings.storeName_ar}.` 
              : `By confirming, you agree to the Terms of Service & Privacy Policy of ${storeSettings.storeName_en}.`}
          </p>

        </form>
      </div>
    </div>
  );
}
