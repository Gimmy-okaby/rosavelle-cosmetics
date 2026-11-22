import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    lang, 
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
      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={lang === 'ar' ? product.name_ar : product.name_en}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5 items-start z-10">
          {product.badge_ar && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-900/90 text-white backdrop-blur-xs shadow-xs">
              {lang === 'ar' ? product.badge_ar : product.badge_en}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Quick View) */}
        <div className="absolute top-3 end-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWish 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 text-stone-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={lang === 'ar' ? "إضافة للمفضلة" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 flex items-center justify-center transition-all shadow-md sm:opacity-0 group-hover:opacity-100"
            title={lang === 'ar' ? "معاينة سريعة" : "Quick view"}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Shade selector circles if available */}
        {product.shades && product.shades.length > 0 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-full shadow-xs"
          >
            {product.shades.map((shade, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedShade(shade)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  selectedShade?.hex === shade.hex ? 'scale-110 border-stone-800' : 'border-white hover:scale-105'
                }`}
                style={{ backgroundColor: shade.hex }}
                title={lang === 'ar' ? shade.name_ar : shade.name_en}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Ratings */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-rose-600 text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 font-medium text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors mb-2">
            {lang === 'ar' ? product.name_ar : product.name_en}
          </h3>

          {/* Active shade preview text if makeup */}
          {selectedShade && (
            <p className="text-[11px] text-stone-500 mb-2">
              <span className="font-medium">{lang === 'ar' ? 'الدرجة: ' : 'Shade: '}</span>
              <span className="text-stone-800 font-semibold">{lang === 'ar' ? selectedShade.name_ar : selectedShade.name_en}</span>
            </p>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              {product.inStock ? (lang === 'ar' ? 'متوفر للتسليم الفوري' : 'In Stock') : (lang === 'ar' ? 'نفذت الكمية' : 'Out of Stock')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 shadow-xs active:scale-95 ${
              added 
                ? 'bg-emerald-600 text-white scale-105' 
                : 'bg-stone-900 hover:bg-rose-600 text-white'
            }`}
            title={lang === 'ar' ? "إضافة إلى السلة" : "Add to bag"}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? "تمت الإضافة!" : "Added!"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? "أضيفي" : "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
