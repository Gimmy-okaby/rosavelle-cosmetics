import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Check, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    lang, 
    currency,
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct 
  } = useStore();

  const [selectedShade, setSelectedShade] = useState(product.shades ? product.shades[0] : null);
  const [added, setAdded] = useState(false);
  const isWish = isInWishlist(product.id);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedShade, product.sizes ? product.sizes[0] : null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-[#18141F] rounded-3xl overflow-hidden border border-rose-950/60 shadow-lg hover:border-amber-500/40 hover:shadow-2xl hover:shadow-rose-950/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#120F16]">
        <img
          src={product.image}
          alt={lang === 'ar' ? product.name_ar : product.name_en}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-2 items-start z-10">
          {product.badge_ar && (
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-stone-950 to-stone-900 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
              {lang === 'ar' ? product.badge_ar : product.badge_en}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Quick View) */}
        <div className="absolute top-3 end-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isWish 
                ? 'bg-rose-600 text-white scale-105' 
                : 'bg-[#18141F]/80 backdrop-blur-md text-stone-300 hover:text-white hover:bg-rose-600'
            }`}
            title={lang === 'ar' ? "إضافة للمفضلة" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-10 h-10 rounded-full bg-[#18141F]/80 backdrop-blur-md text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-all shadow-lg sm:opacity-0 group-hover:opacity-100"
            title={lang === 'ar' ? "معاينة سريعة" : "Quick view"}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Shade selector circles if available */}
        {product.shades && product.shades.length > 0 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 bg-[#120F16]/90 backdrop-blur-md py-1.5 px-3 rounded-full border border-stone-800 shadow-md"
          >
            {product.shades.map((shade, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedShade(shade)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  selectedShade?.hex === shade.hex ? 'scale-125 border-amber-400' : 'border-stone-700 hover:scale-110'
                }`}
                style={{ backgroundColor: shade.hex }}
                title={lang === 'ar' ? shade.name_ar : shade.name_en}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#18141F] to-[#14101A]">
        <div>
          {/* Brand & Ratings */}
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="font-extrabold uppercase tracking-widest text-amber-400 text-xs">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black">{product.rating}</span>
              <span className="text-stone-500 text-xs">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title - Bigger and Bolder */}
          <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors mb-2.5">
            {lang === 'ar' ? product.name_ar : product.name_en}
          </h3>

          {/* Active shade preview text if makeup */}
          {selectedShade && (
            <p className="text-xs text-stone-300 mb-3 font-medium">
              <span>{lang === 'ar' ? 'الدرجة: ' : 'Shade: '}</span>
              <span className="text-amber-300 font-bold">{lang === 'ar' ? selectedShade.name_ar : selectedShade.name_en}</span>
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-4 border-t border-rose-950/40 flex items-center justify-between gap-3 mt-auto">
          {/* High-Impact Price Typography */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-2xl sm:text-3xl text-amber-300 tracking-tight">
                {product.price}
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-400/80 uppercase">
                {currency === 'EGP' ? 'ج.م' : currency}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-500 line-through mr-1">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-400 font-bold mt-0.5">
              {product.inStock ? (lang === 'ar' ? 'متوفر للتسليم الفوري ✓' : 'In Stock ✓') : (lang === 'ar' ? 'نفذت الكمية' : 'Out of Stock')}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black transition-all duration-200 shadow-md active:scale-95 cursor-pointer ${
              added 
                ? 'bg-emerald-600 text-white scale-105' 
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-950/50'
            }`}
            title={lang === 'ar' ? "إضافة إلى السلة" : "Add to bag"}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>{lang === 'ar' ? "تمت!" : "Added!"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ar' ? "أضيفي" : "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
