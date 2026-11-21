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
    <section id="products-section" className="py-12 bg-[#FAF7F5] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar (Filter, Sort, Count) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                {lang === 'ar' ? "كتالوج المستحضرات الفاخرة" : "Luxury Product Catalog"}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                {filteredProducts.length} {lang === 'ar' ? 'منتج' : 'items'}
              </span>
            </div>
            {searchQuery && (
              <p className="text-xs text-stone-500 mt-1">
                {lang === 'ar' ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}
              </p>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-full py-2 px-3 sm:px-4 focus:outline-none focus:border-rose-400 cursor-pointer shadow-2xs font-medium"
              >
                <option value="featured">{lang === 'ar' ? 'الأكثر طلباً (المميز)' : 'Featured'}</option>
                <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                <option value="discount">{lang === 'ar' ? 'أكبر نسبة خصم' : 'Biggest Discounts'}</option>
              </select>
            </div>

            {/* Price Filter Pill Button */}
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors shadow-2xs ${
                filterDrawerOpen || priceRange[1] < 2000
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold' 
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصفية الأسعار' : 'Price Filter'}</span>
            </button>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-md"
                title={lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Price Range Filter Bar */}
        {filterDrawerOpen && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {lang === 'ar' ? `أقصى سعر: ${formatPrice(priceRange[1])}` : `Max Price: ${formatPrice(priceRange[1])}`}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-rose-500 cursor-pointer"
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
