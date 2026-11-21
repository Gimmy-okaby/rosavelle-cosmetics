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
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              {lang === 'ar' ? 'قائمة أمنياتي المفضلة' : 'My Wishlist'}
            </h3>
            <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition"
              >
                <img 
                  src={item.image} 
                  alt={lang === 'ar' ? item.name_ar : item.name_en}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(item);
                    setIsWishlistOpen(false);
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsWishlistOpen(false);
                    }}
                    className="text-xs sm:text-sm font-bold text-stone-900 truncate cursor-pointer hover:text-rose-600 transition"
                  >
                    {lang === 'ar' ? item.name_ar : item.name_en}
                  </h4>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      addToCart(item, 1, item.shades ? item.shades[0] : null, item.sizes ? item.sizes[0] : null);
                    }}
                    className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs transition"
                    title={lang === 'ar' ? 'إضافة للسلة' : 'Add to bag'}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition"
                    title={lang === 'ar' ? 'حذف من المفضلة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-900 mb-1">
                {lang === 'ar' ? 'قائمتك المفضلة فارغة' : 'Your wishlist is empty'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                {lang === 'ar' 
                  ? 'اضغطي على علامة القلب على أي منتج لحفظه والرجوع إليه لاحقاً.' 
                  : 'Click the heart icon on any product to save it for later.'}
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-stone-800 transition"
              >
                {lang === 'ar' ? 'تصفحي المنتجات' : 'Browse Products'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white">
            <button
              onClick={handleAddAllToCart}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              <span>{lang === 'ar' ? 'نقل جميع المنتجات للحقيبة' : 'Move All to Bag'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
