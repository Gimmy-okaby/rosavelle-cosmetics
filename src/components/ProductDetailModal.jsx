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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images & Gallery */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-stone-50 flex flex-col items-center justify-between">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-xs border border-stone-200/60">
            <img
              src={activeImage}
              alt={lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 start-3 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-xs">
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
                    activeImage === img ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Trust badges */}
          <div className="w-full mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'ar' ? 'أصلي ومصرح طبياً' : 'Authentic & Tested'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{lang === 'ar' ? 'شحن فوري لباب البيت' : 'Fast Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Brand & Ratings */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {selectedProduct.brand}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold text-stone-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating}</span>
                <span className="text-stone-400 text-xs">({selectedProduct.reviewsCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug mb-3">
              {lang === 'ar' ? selectedProduct.name_ar : selectedProduct.name_en}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-2xl font-extrabold text-stone-900">
                {formatPrice(selectedProduct.price)}
              </span>
              {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(selectedProduct.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-md ms-auto">
                {lang === 'ar' ? 'متوفر بالمخزون' : 'In Stock'}
              </span>
            </div>

            {/* Shade Selection (if available) */}
            {selectedProduct.shades && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                  <span>{lang === 'ar' ? 'اختاري الدرجة:' : 'Select Shade:'}</span>
                  <span className="text-rose-600">
                    {lang === 'ar' ? selectedShade?.name_ar : selectedShade?.name_en}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.shades.map((shade, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedShade(shade)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedShade?.hex === shade.hex 
                          ? 'ring-2 ring-stone-900 scale-110 border-white' 
                          : 'border-white opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={lang === 'ar' ? shade.name_ar : shade.name_en}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size / Volume Selection (if available) */}
            {selectedProduct.sizes && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  {lang === 'ar' ? 'الحجم:' : 'Size:'}
                </label>
                <div className="flex items-center gap-2">
                  {selectedProduct.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedSize === size
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
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
              <span className="text-xs font-semibold text-stone-800">
                {lang === 'ar' ? 'الكمية:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-stone-900"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-stone-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs (Description, Ingredients, How to use) */}
            <div className="border-t border-stone-200/80 pt-4 mb-6">
              <div className="flex items-center gap-4 border-b border-stone-200 text-xs font-bold pb-2 mb-3">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition ${
                    activeTab === 'desc' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {lang === 'ar' ? 'الوصف والفوائد' : 'Description'}
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-1 transition ${
                    activeTab === 'ingredients' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {lang === 'ar' ? 'المكونات الفعالة' : 'Ingredients'}
                </button>
                <button
                  onClick={() => setActiveTab('howToUse')}
                  className={`pb-1 transition ${
                    activeTab === 'howToUse' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
                </button>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed min-h-[60px]">
                {activeTab === 'desc' && (
                  <p>{lang === 'ar' ? selectedProduct.description_ar : selectedProduct.description_en}</p>
                )}
                {activeTab === 'ingredients' && (
                  <p>{selectedProduct.ingredients_ar || (lang === 'ar' ? 'مكونات طبيعية مختارة بعناية فائقة.' : 'Premium clean ingredients.')}</p>
                )}
                {activeTab === 'howToUse' && (
                  <p>{selectedProduct.howToUse_ar || (lang === 'ar' ? 'يُستخدم يومياً حسب روتينك المعتاد للحصول على أفضل النتائج.' : 'Use daily as part of your beauty routine.')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className={`p-3 rounded-2xl border transition ${
                isWish 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              <span>{lang === 'ar' ? 'إضافة إلى حقيبة التسوق' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-rose-500 hover:bg-rose-600 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition shadow"
            >
              {lang === 'ar' ? 'شراء فوري' : 'Buy Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
