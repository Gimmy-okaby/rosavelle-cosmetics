import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function FeaturedCategories() {
  const { lang, selectedCategory, setSelectedCategory, products } = useStore();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const validCategories = CATEGORIES.filter(c => c.id !== 'all');

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? "تسوقي حسب القسم" : "Curated Categories"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {lang === 'ar' ? "اختاري روتين جمالك المفضل" : "Find Your Perfect Beauty Ritual"}
            </h2>
          </div>
          
          <button
            onClick={() => {
              setSelectedCategory('all');
              scrollToProducts();
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
          >
            <span>{lang === 'ar' ? "عرض جميع المنتجات" : "View All Products"}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {validCategories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  scrollToProducts();
                }}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-300 border ${
                  isSelected ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-200/70'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark/Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent group-hover:from-stone-950/95 transition-all" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[11px] font-medium text-rose-200 tracking-wider">
                    {count} {lang === 'ar' ? 'منتج حصري' : 'Products'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1 text-white group-hover:text-rose-200 transition-colors">
                    {lang === 'ar' ? cat.name_ar : cat.name_en}
                  </h3>
                  
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-rose-300 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <span>{lang === 'ar' ? "تصفحي المنتجات" : "Explore now"}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-3 end-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {lang === 'ar' ? "القسم المختار" : "Active"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
