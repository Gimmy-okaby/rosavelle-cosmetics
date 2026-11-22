import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function WishlistModal() {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    formatPrice, 
    lang, 
    setSelectedProduct 
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleAddAllToCart = () => {
    wishlist.forEach(p => {
      addToCart(p, 1, p.shades ? p.shades[0] : null, p.sizes ? p.sizes[0] : null);
    });
    setIsWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#18131E] text-stone-100 h-full shadow-2xl flex flex-col justify-between animate-slide-in relative border-s border-rose-950/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-rose-950/60 flex items-center justify-between bg-[#14101A]">
          <div className="flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            <h3 className="font-black text-white text-lg sm:text-xl">
              {lang === 'ar' ? 'قائمة أمنياتي المفضلة' : 'My Wishlist'}
            </h3>
            <span className="text-xs font-black bg-rose-950 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#1F1928] border border-rose-950/50 hover:border-amber-500/30 transition shadow-md"
              >
                <img 
                  src={item.image} 
                  alt={lang === 'ar' ? item.name_ar : item.name_en}
                  className="w-18 h-18 rounded-xl object-cover shrink-0 border border-stone-800"
                />

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsWishlistOpen(false);
                    }}
                    className="text-sm font-black text-white hover:text-amber-300 cursor-pointer truncate"
                  >
                    {lang === 'ar' ? item.name_ar : item.name_en}
                  </h4>
                  <div className="font-black text-base text-amber-300 mt-1">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(item, 1, item.shades ? item.shades[0] : null, item.sizes ? item.sizes[0] : null);
                      toggleWishlist(item);
                    }}
                    className="p-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl shadow-md transition"
                    title={lang === 'ar' ? 'إضافة للسلة' : 'Add to cart'}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2.5 text-stone-400 hover:text-rose-400 rounded-xl transition"
                    title={lang === 'ar' ? 'إزالة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 rounded-full bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-5 border border-rose-900/50">
                <Heart className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-white mb-2">
                {lang === 'ar' ? 'قائمة الأمنيات فارغة' : 'Wishlist is empty'}
              </h4>
              <p className="text-sm text-stone-400 max-w-xs mx-auto mb-6">
                {lang === 'ar' 
                  ? 'احفظي منتجاتك المفضلة هنا لشرائها في أي وقت بسهولة.' 
                  : 'Save items you love here to shop them anytime.'}
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-7 py-3 rounded-full text-sm font-extrabold hover:from-rose-500 hover:to-pink-500 transition shadow-lg"
              >
                {lang === 'ar' ? 'اكتشفي المنتجات الآن ✨' : 'Discover Beauty ✨'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-rose-950/80 bg-[#14101A]">
            <button
              onClick={handleAddAllToCart}
              className="w-full bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-4 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950/60 transition"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span>{lang === 'ar' ? 'إضافة كل المفضلة إلى السلة دفعة واحدة' : 'Move All to Bag'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
