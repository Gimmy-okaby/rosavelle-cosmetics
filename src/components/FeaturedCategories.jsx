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
    <section className="py-14 bg-[#100D14] border-b border-rose-950/40" id="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? "تسوقي حسب القسم" : "Curated Categories"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {lang === 'ar' ? "اختاري روتين جمالك المفضل" : "Find Your Perfect Beauty Ritual"}
            </h2>
          </div>
          
          <button
            onClick={() => {
              setSelectedCategory('all');
              scrollToProducts();
            }}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold text-amber-300 hover:text-amber-200 transition"
          >
            <span>{lang === 'ar' ? "عرض جميع المنتجات" : "View All Products"}</span>
            <ArrowIcon className="w-5 h-5" />
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
                className={`group relative overflow-hidden rounded-3xl cursor-pointer aspect-[3/4] shadow-xl hover:shadow-2xl hover:shadow-rose-950/60 transition-all duration-300 border ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-rose-950/60 hover:border-amber-500/40'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent group-hover:from-stone-950/95 transition-all" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <span className="text-xs font-bold text-amber-300 tracking-wider">
                    {count} {lang === 'ar' ? 'منتج فاخر' : 'Products'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white group-hover:text-amber-200 transition-colors">
                    {lang === 'ar' ? cat.name_ar : cat.name_en}
                  </h3>
                  
                  <div className="mt-3 flex items-center gap-1.5 text-sm font-extrabold text-rose-300 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <span>{lang === 'ar' ? "تصفحي المنتجات" : "Explore now"}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-4 end-4 bg-amber-400 text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                    {lang === 'ar' ? "القسم المختار ✓" : "Active ✓"}
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
