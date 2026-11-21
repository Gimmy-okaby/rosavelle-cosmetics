import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Tag, 
  ArrowLeft, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartSubtotal, 
    discountAmount, 
    formatPrice, 
    lang, 
    storeSettings,
    isFreeShipping,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const remainingForFreeShipping = Math.max(0, storeSettings.freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / storeSettings.freeShippingThreshold) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              {lang === 'ar' ? 'حقيبة المشتريات' : 'Shopping Bag'}
            </h3>
            <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-rose-50/60 border-b border-rose-100/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-stone-800">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-500" />
              <span>
                {isFreeShipping 
                  ? (lang === 'ar' ? '🎉 مبروك! حصلتِ على شحن مجاني!' : '🎉 You unlocked Free Shipping!') 
                  : (lang === 'ar' 
                      ? `أضيفي منتجات بـ ${formatPrice(remainingForFreeShipping)} للشحن المجاني` 
                      : `Add ${formatPrice(remainingForFreeShipping)} more for FREE shipping`)}
              </span>
            </div>
            <span className="text-rose-600 font-bold">{freeShippingPercent}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div 
                key={item.cartItemId}
                className="flex gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition"
              >
                {/* Item Thumbnail */}
                <img 
                  src={item.image} 
                  alt={lang === 'ar' ? item.name_ar : item.name_en}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200/80" 
                />

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {lang === 'ar' ? item.name_ar : item.name_en}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition"
                        title={lang === 'ar' ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Shade / Size Badges */}
                    <div className="flex items-center gap-2 mt-1">
                      {item.shade && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <span 
                            className="w-3 h-3 rounded-full border border-stone-300" 
                            style={{ backgroundColor: item.shade.hex }} 
                          />
                          <span>{lang === 'ar' ? item.shade.name_ar : item.shade.name_en}</span>
                        </div>
                      )}
                      {item.size && (
                        <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1 text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1 text-stone-600 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-end">
                      <span className="font-extrabold text-sm text-stone-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-900 mb-1">
                {lang === 'ar' ? 'حقيبة التسوق فارغة' : 'Your bag is empty'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                {lang === 'ar' 
                  ? 'اكتشفي أحدث المستحضرات وأضيفي لمستك الخاصة اليوم.' 
                  : 'Explore our luxury cosmetics collection and start shopping.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-stone-800 transition"
              >
                {lang === 'ar' ? 'ابدئي التسوق الآن' : 'Start Shopping'}
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-red-500 text-[11px] font-bold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'كود الخصم (جربي BEAUTY10)' : 'Coupon code (try BEAUTY10)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2 px-3 text-xs uppercase focus:outline-none focus:border-rose-400"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute end-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{lang === 'ar' ? 'قيمة الخصم' : 'Discount'}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span className="font-semibold text-stone-900">
                  {isFreeShipping 
                    ? (lang === 'ar' ? 'مجاني 🎁' : 'Free 🎁') 
                    : (lang === 'ar' ? 'يُحسب عند إتمام الطلب' : 'Calculated at checkout')}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>{lang === 'ar' ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                <span className="text-rose-600">
                  {formatPrice(Math.max(0, cartSubtotal - discountAmount))}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>{lang === 'ar' ? 'متابعة إتمام الطلب الآن' : 'Proceed to Checkout'}</span>
              <ArrowIcon className="w-4 h-4 text-rose-300" />
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-800 font-medium py-1"
            >
              {lang === 'ar' ? 'أو تابعي التسوق' : 'Or continue shopping'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
