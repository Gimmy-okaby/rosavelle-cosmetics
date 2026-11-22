import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus,
  Sparkles,
  Phone
} from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    lang, 
    currency,
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    storeSettings,
    setIsCartOpen 
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImage, setActiveImage] = useState(
    selectedProduct.gallery && selectedProduct.gallery.length > 0 
      ? selectedProduct.gallery[0] 
      : selectedProduct.image
  );
  const [selectedShade, setSelectedShade] = useState(
    selectedProduct.shades ? selectedProduct.shades[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct.sizes ? selectedProduct.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'ingredients', 'howToUse'

  const isWish = isInWishlist(selectedProduct.id);

  const discountPercent = selectedProduct.originalPrice 
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedShade, selectedSize);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedShade, selectedSize);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-[#18131F] text-stone-100 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-rose-950/80 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images & Gallery */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 bg-[#130F17] flex flex-col items-center justify-between border-b md:border-b-0 md:border-e border-rose-950/60">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#1A1622] shadow-inner border border-rose-950/50">
            <img
              src={activeImage}
              alt={lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 start-3 text-xs font-black px-3 py-1 rounded-full bg-rose-600 text-white shadow-md">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto py-1">
              {selectedProduct.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Trust badges */}
          <div className="w-full mt-5 pt-4 border-t border-rose-950/50 grid grid-cols-2 gap-3 text-xs font-bold text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lang === 'ar' ? 'أصلي ومصرح طبياً' : 'Authentic & Tested'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lang === 'ar' ? 'شحن فوري لباب البيت' : 'Fast Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Brand & Ratings */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-rose-950/80 border border-amber-500/30 px-3 py-1 rounded-full">
                {selectedProduct.brand}
              </span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-stone-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black">{selectedProduct.rating}</span>
                <span className="text-stone-400 text-xs">({selectedProduct.reviewsCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            {/* Product Title - Bigger */}
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
              {lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-5 p-4 bg-[#1F1928] rounded-2xl border border-rose-950/60">
              <span className="text-3xl font-black text-amber-300">
                {selectedProduct.price}
              </span>
              <span className="text-sm font-bold text-amber-400 uppercase">
                {currency === 'EGP' ? 'ج.م' : currency}
              </span>
              {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-stone-500 line-through">
                  {selectedProduct.originalPrice}
                </span>
              )}
              <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-md ms-auto">
                {lang === 'ar' ? 'متوفر بالمخزون ✓' : 'In Stock ✓'}
              </span>
            </div>

            {/* Shade Selection (if available) */}
            {selectedProduct.shades && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-stone-300 mb-2">
                  <span>{lang === 'ar' ? 'اختاري الدرجة:' : 'Select Shade:'}</span>
                  <span className="text-amber-300 font-extrabold">
                    {lang === 'ar' ? selectedShade?.name_ar : selectedShade?.name_en}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {selectedProduct.shades.map((shade, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedShade(shade)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedShade?.hex === shade.hex 
                          ? 'ring-2 ring-amber-400 scale-110 border-white' 
                          : 'border-stone-700 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={lang === 'ar' ? shade.name_ar : shade.name_en}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection (if available) */}
            {selectedProduct.sizes && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  {lang === 'ar' ? 'الحجم:' : 'Size:'}
                </label>
                <div className="flex items-center gap-2">
                  {selectedProduct.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-black border transition ${
                        selectedSize === size
                          ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-md'
                          : 'bg-white/5 text-stone-300 border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-stone-300">
                {lang === 'ar' ? 'الكمية:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-stone-700 rounded-xl bg-stone-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-300 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-sm font-black text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-300 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-rose-950/50 pt-4 mb-6">
              <div className="flex items-center gap-5 border-b border-rose-950/60 text-xs font-bold pb-2 mb-3">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition ${
                    activeTab === 'desc' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'الوصف والفوائد' : 'Description'}
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-1 transition ${
                    activeTab === 'ingredients' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'المكونات الفعالة' : 'Ingredients'}
                </button>
                <button
                  onClick={() => setActiveTab('howToUse')}
                  className={`pb-1 transition ${
                    activeTab === 'howToUse' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-stone-300 leading-relaxed min-h-[60px] font-medium">
                {activeTab === 'desc' && (
                  <p>{selectedProduct.description_ar || selectedProduct.description_en}</p>
                )}
                {activeTab === 'ingredients' && (
                  <p>{selectedProduct.ingredients_ar || (lang === 'ar' ? 'مكونات طبيعية نقية مختارة بعناية فائقة.' : 'Premium clean ingredients.')}</p>
                )}
                {activeTab === 'howToUse' && (
                  <p>{selectedProduct.howToUse_ar || (lang === 'ar' ? 'يُستخدم يومياً حسب روتينك المعتاد للحصول على أفضل النتائج.' : 'Use daily as part of your beauty routine.')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-rose-950/60 flex items-center gap-3">
            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className={`p-3.5 rounded-2xl border transition ${
                isWish 
                  ? 'bg-rose-950 border-amber-400 text-rose-400' 
                  : 'bg-white/5 border-stone-800 text-stone-300 hover:text-white'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-4 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span>{lang === 'ar' ? 'إضافة إلى السلة' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 py-4 px-5 rounded-2xl font-black text-sm sm:text-base transition shadow-lg active:scale-95"
            >
              {lang === 'ar' ? 'شراء فوري' : 'Buy Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
