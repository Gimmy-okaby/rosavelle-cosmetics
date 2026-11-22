import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Search, 
  X, 
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

export default function ProductGrid() {
  const { 
    products, 
    lang, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    sortBy, 
    setSortBy,
    priceRange,
    setPriceRange,
    formatPrice
  } = useStore();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNameAr = p.name_ar?.toLowerCase().includes(query);
        const matchesNameEn = p.name_en?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesDesc = p.description_ar?.toLowerCase().includes(query);
        if (!matchesNameAr && !matchesNameEn && !matchesBrand && !matchesDesc) {
          return false;
        }
      }
      // Price range
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
        return discB - discA;
      }
      // default 'featured'
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange([0, 2000]);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '' || sortBy !== 'featured' || priceRange[1] < 2000;

  return (
    <section id="products-section" className="py-14 bg-[#0F0E11] scroll-mt-24 border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar (Filter, Sort, Count) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-950/60 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {lang === 'ar' ? "كتالوج المستحضرات الفاخرة" : "Luxury Product Catalog"}
              </h2>
              <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full bg-rose-950 text-amber-300 border border-amber-500/30">
                {filteredProducts.length} {lang === 'ar' ? 'منتج' : 'items'}
              </span>
            </div>
            {searchQuery && (
              <p className="text-sm text-stone-400 mt-1.5 font-medium">
                {lang === 'ar' ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}
              </p>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-3">
            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#18141F] border border-rose-900/40 text-stone-200 text-sm font-bold rounded-2xl py-2.5 px-4 focus:outline-none focus:border-amber-400 cursor-pointer shadow-md"
              >
                <option value="featured" className="bg-stone-900 text-white">{lang === 'ar' ? 'الأكثر طلباً (المميز)' : 'Featured'}</option>
                <option value="price-asc" className="bg-stone-900 text-white">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc" className="bg-stone-900 text-white">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                <option value="rating" className="bg-stone-900 text-white">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                <option value="discount" className="bg-stone-900 text-white">{lang === 'ar' ? 'أكبر نسبة خصم' : 'Biggest Discounts'}</option>
              </select>
            </div>

            {/* Price Filter Pill Button */}
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border transition-colors shadow-md ${
                filterDrawerOpen || priceRange[1] < 2000
                  ? 'bg-rose-950/80 border-amber-400 text-amber-300' 
                  : 'bg-[#18141F] border-rose-900/40 text-stone-200 hover:bg-[#221C2A]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'تصفية الأسعار' : 'Price Filter'}</span>
            </button>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-xl bg-white/5"
                title={lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Price Range Filter Bar */}
        {filterDrawerOpen && (
          <div className="mb-10 p-5 bg-[#18141F] rounded-3xl border border-rose-950/80 shadow-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex-1 max-w-sm">
                <label className="block text-sm font-bold text-stone-200 mb-2">
                  {lang === 'ar' ? `أقصى سعر: ${formatPrice(priceRange[1])}` : `Max Price: ${formatPrice(priceRange[1])}`}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPriceRange([0, 500])}
                  className="px-3 py-1 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs rounded-full font-medium transition"
                >
                  {lang === 'ar' ? 'أقل من 500 ج.م' : 'Under 500'}
                </button>
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="px-3 py-1 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs rounded-full font-medium transition"
                >
                  {lang === 'ar' ? 'أقل من 1000 ج.م' : 'Under 1000'}
                </button>
                <button
                  onClick={() => setPriceRange([0, 2000])}
                  className="px-3 py-1 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs rounded-full font-medium transition"
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-stone-300">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              {lang === 'ar' ? "لم نجد أي منتجات تطابق بحثك" : "No products found"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
              {lang === 'ar' 
                ? "جربي البحث بكلمات أخرى أو قومي بإلغاء بعض الفلاتر لعرض تشكيلة أوسع." 
                : "Try searching with different keywords or reset your filters."}
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-stone-800 transition shadow"
            >
              {lang === 'ar' ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
