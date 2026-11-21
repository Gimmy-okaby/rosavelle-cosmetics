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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              {lang === 'ar' ? 'إتمام الطلب وتأكيد الشحن' : 'Checkout & Confirm Order'}
            </h3>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Step 1: Customer Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">1</span>
              <span>{lang === 'ar' ? 'بيانات المستلم والتواصل' : 'Customer Information'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={lang === 'ar' ? 'مثال: سارة أحمد محمود' : 'e.g. Sarah Ahmed'}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'ar' ? 'رقم الهاتف (واتساب متاح) *' : 'Phone Number (WhatsApp active) *'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={lang === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white text-start"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني (اختياري لتأكيد الفاتورة)' : 'Email (Optional for receipt)'}
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Step 2: Delivery & Shipping Address */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">2</span>
              <span>{lang === 'ar' ? 'عنوان الشحن والتوصيل' : 'Shipping Address'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'ar' ? 'المحافظة *' : 'Governorate *'}
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white cursor-pointer"
                >
                  {GOVERNORATES.map(gov => (
                    <option key={gov.id} value={gov.id}>
                      {lang === 'ar' ? gov.name_ar : gov.name_en} {isFreeShipping ? '(شحن مجاني)' : `(${formatPrice(gov.shippingCost)})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {lang === 'ar' ? 'العنوان التفصيلي *' : 'Street & Building Details *'}
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder={lang === 'ar' ? 'المنطقة، الشارع، رقم العمارة والدور، علامة مميزة' : 'Area, street, building, apartment'}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {lang === 'ar' ? 'ملاحظات إضافية لمندوب التوصيل (اختياري)' : 'Delivery Notes (Optional)'}
              </label>
              <textarea
                name="notes"
                rows="2"
                placeholder={lang === 'ar' ? 'مثال: يُرجى الاتصال قبل الوصول بنصف ساعة...' : 'e.g. Please call before arrival...'}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[11px]">3</span>
              <span>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash On Delivery */}
              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'cod' 
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-400' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="accent-rose-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {lang === 'ar' ? 'ادفعي كاش عند استلام ومعاينة طلبك' : 'Pay when you receive items'}
                  </p>
                </div>
              </label>

              {/* InstaPay / Vodafone Cash */}
              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'instapay' 
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-400' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={formData.paymentMethod === 'instapay'}
                    onChange={handleInputChange}
                    className="accent-rose-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {lang === 'ar' ? 'إنستاباي أو فودافون كاش' : 'InstaPay / E-Wallet'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {lang === 'ar' ? 'تحويل فوري سهل وسريع' : 'Instant digital transfer'}
                  </p>
                </div>
              </label>

              {/* Credit Card */}
              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.paymentMethod === 'card' 
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-400' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="accent-rose-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {lang === 'ar' ? 'بطاقة بنكية (فيزا/ماستركارد)' : 'Credit / Debit Card'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {lang === 'ar' ? 'دفع إلكتروني مشفر وآمن' : 'Encrypted secure payment'}
                  </p>
                </div>
              </label>
            </div>

            {/* InstaPay instructions box */}
            {formData.paymentMethod === 'instapay' && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-purple-900">
                  {lang === 'ar' ? 'بيانات التحويل عبر إنستاباي أو المحفظة الإلكترونية:' : 'Transfer Account Details:'}
                </p>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-purple-100">
                  <div>
                    <span className="text-[11px] text-stone-500 block">InstaPay IPA / معرف إنستاباي:</span>
                    <span className="font-mono font-bold text-stone-900">{storeSettings.instaPayAccount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(storeSettings.instaPayAccount, 'instapay')}
                    className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedInstaPay ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-purple-100">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Vodafone Cash / فودافون كاش:</span>
                    <span className="font-mono font-bold text-stone-900">{storeSettings.vodafoneCashNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(storeSettings.vodafoneCashNumber, 'vodafone')}
                    className="px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVodafone ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>

                <p className="text-[11px] text-purple-700">
                  {lang === 'ar' 
                    ? '💡 بعد إتمام الطلب، سيتاح لك إرسال إشعار التحويل مباشرة عبر واتساب لتأكيد خروج الشحنة فوراً.' 
                    : '💡 After placing order, you can confirm via WhatsApp with receipt screenshot.'}
                </p>
              </div>
            )}

            {/* Mock Credit Card box */}
            {formData.paymentMethod === 'card' && (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'بوابة دفع إلكتروني آمنة ومشفرة 256-bit' : '256-bit encrypted checkout'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      placeholder="Card Number (4000 1234 5678 9010)" 
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="CVV" 
                      className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Final Summary */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 pb-1 border-b border-stone-200">
              {lang === 'ar' ? 'ملخص الفاتورة النهائية' : 'Order Invoice Summary'}
            </h4>
            <div className="flex justify-between text-stone-600">
              <span>{lang === 'ar' ? 'قيمة المنتجات' : 'Items Subtotal'}</span>
              <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{lang === 'ar' ? 'الخصم المطبق' : 'Discount'}</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>{lang === 'ar' ? `تكلفة الشحن (${lang === 'ar' ? selectedGov.name_ar : selectedGov.name_en})` : `Shipping (${selectedGov.name_en})`}</span>
              <span className="font-semibold text-stone-900">
                {shippingCost === 0 ? (lang === 'ar' ? 'مجاني 🎁' : 'Free 🎁') : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>{lang === 'ar' ? 'المبلغ الإجمالي المستحق' : 'Grand Total'}</span>
              <span className="text-rose-600">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'ar' ? `تأكيد الطلب الآن (${formatPrice(grandTotal)})` : `Confirm Order Now (${formatPrice(grandTotal)})`}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-400">
            {lang === 'ar' 
              ? `بالضغط على تأكيد، أنت توافقين على شروط الاستخدام وسياسة الخصوصية لمتجر ${storeSettings.storeName_ar}.` 
              : `By confirming, you agree to the Terms of Service & Privacy Policy of ${storeSettings.storeName_en}.`}
          </p>

        </form>
      </div>
    </div>
  );
}
