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
    currency,
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#18131E] text-stone-100 h-full shadow-2xl flex flex-col justify-between animate-slide-in relative border-s border-rose-950/80"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-rose-950/60 flex items-center justify-between bg-[#14101A]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h3 className="font-black text-white text-lg sm:text-xl">
              {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Bag'}
            </h3>
            <span className="text-xs font-black bg-rose-900/80 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-[#201828] border-b border-rose-950/60">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2 text-stone-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>
                {isFreeShipping 
                  ? (lang === 'ar' ? '🎉 مبروك! حصلتِ على شحن مجاني!' : '🎉 You unlocked Free Shipping!') 
                  : (lang === 'ar' 
                      ? `أضيفي منتجات بـ ${formatPrice(remainingForFreeShipping)} للشحن المجاني` 
                      : `Add ${formatPrice(remainingForFreeShipping)} more for FREE shipping`)}
              </span>
            </div>
            <span className="text-amber-400 font-black">{freeShippingPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 rounded-full transition-all duration-500"
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
                className="flex gap-4 p-3.5 rounded-2xl bg-[#1F1928] border border-rose-950/50 hover:border-amber-500/30 transition shadow-md"
              >
                {/* Item Thumbnail */}
                <img 
                  src={item.image} 
                  alt={lang === 'ar' ? item.name_ar : item.name_en}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-800" 
                />

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-black text-white truncate">
                        {lang === 'ar' ? item.name_ar : item.name_en}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-400 p-1 transition"
                        title={lang === 'ar' ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Shade / Size Badges */}
                    <div className="flex items-center gap-2 mt-1">
                      {item.shade && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-300">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-stone-600" 
                            style={{ backgroundColor: item.shade.hex }} 
                          />
                          <span className="font-medium">{lang === 'ar' ? item.shade.name_ar : item.shade.name_en}</span>
                        </div>
                      )}
                      {item.size && (
                        <span className="text-xs font-bold bg-white/10 text-stone-200 px-2 py-0.5 rounded">
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-rose-950/40">
                    <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1.5 text-stone-300 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1.5 text-stone-300 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-end">
                      <span className="font-black text-lg text-amber-300">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 rounded-full bg-rose-950/50 text-amber-400 mx-auto flex items-center justify-center mb-5 border border-amber-500/20">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-white mb-2">
                {lang === 'ar' ? 'سلة التسوق فارغة' : 'Your bag is empty'}
              </h4>
              <p className="text-sm text-stone-400 max-w-xs mx-auto mb-6">
                {lang === 'ar' 
                  ? 'اكتشفي تشكيلة روزافيل الفاخرة وأضيفي لمستك الخاصة اليوم.' 
                  : 'Explore our luxury cosmetics collection and start shopping.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-7 py-3 rounded-full text-sm font-extrabold hover:from-rose-500 hover:to-pink-500 transition shadow-lg"
              >
                {lang === 'ar' ? 'ابدئي التسوق الآن ✨' : 'Start Shopping ✨'}
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-rose-950/80 bg-[#14101A] space-y-4">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-sm">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-400 text-xs font-bold"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'كود الخصم (جربي GLAM20)' : 'Coupon code (try GLAM20)'}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-[#1F1928] border border-rose-900/40 text-white placeholder-stone-500 rounded-xl py-2.5 px-3.5 text-xs font-bold uppercase focus:outline-none focus:border-amber-400"
                    />
                    <Tag className="w-4 h-4 text-amber-400 absolute end-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs font-black transition"
                  >
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-xs text-rose-400 mt-1.5 font-bold">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm text-stone-300 pt-2 border-t border-rose-950/60 font-semibold">
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="font-black text-white">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>{lang === 'ar' ? 'قيمة الخصم' : 'Discount'}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span className="font-bold text-amber-300">
                  {isFreeShipping 
                    ? (lang === 'ar' ? 'مجاني 🎁' : 'Free 🎁') 
                    : (lang === 'ar' ? 'يُحسب عند إتمام الطلب' : 'Calculated at checkout')}
                </span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-black text-white pt-2.5 border-t border-rose-950/80">
                <span>{lang === 'ar' ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                <span className="text-amber-300 text-xl font-black">
                  {formatPrice(Math.max(0, cartSubtotal - discountAmount))}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-4 px-5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 transition active:scale-95 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'متابعة إتمام الطلب الآن' : 'Proceed to Checkout'}</span>
              <ArrowIcon className="w-5 h-5 text-amber-300" />
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-xs text-stone-400 hover:text-white font-bold py-1"
            >
              {lang === 'ar' ? 'أو تابعي التسوق' : 'Or continue shopping'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
