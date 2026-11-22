import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { Sparkles, Flame, Percent, Crown } from 'lucide-react';

export default function StoryCategories() {
  const { lang, selectedCategory, setSelectedCategory } = useStore();

  const storyItems = [
    {
      id: 'all',
      name_ar: 'الكل',
      name_en: 'All',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
      badge: '✨',
      isSpecial: true
    },
    {
      id: 'bestseller',
      name_ar: 'الأكثر مبيعاً',
      name_en: 'Bestsellers',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
      badge: '🔥',
      isSpecial: true
    },
    {
      id: 'offers',
      name_ar: 'عروض حصرية',
      name_en: 'Special Deals',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
      badge: '🎁',
      isSpecial: true
    },
    ...CATEGORIES.filter(c => c.id !== 'all').map(c => ({
      ...c,
      badge: null,
      isSpecial: false
    }))
  ];

  const handleSelect = (id) => {
    setSelectedCategory(id);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#FAF7F5] pt-4 pb-2 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1">
          {storyItems.map((item) => {
            const isSelected = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="group flex flex-col items-center shrink-0 focus:outline-none transition-transform active:scale-95"
              >
                {/* Story Circle Avatar */}
                <div className={`relative p-0.5 rounded-full transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-rose-600 ring-offset-2 ring-offset-[#FAF7F5] scale-105' 
                    : 'bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 group-hover:scale-105 group-hover:shadow-md'
                }`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-white overflow-hidden shadow-inner">
                    <img
                      src={item.image}
                      alt={lang === 'ar' ? item.name_ar : item.name_en}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Badge Emoji / Icon */}
                  {item.badge && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center text-xs shadow-md border border-rose-100 animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <span className={`mt-2 text-xs sm:text-sm font-medium tracking-tight text-center max-w-[76px] sm:max-w-[88px] truncate transition-colors ${
                  isSelected 
                    ? 'text-rose-800 font-bold' 
                    : 'text-stone-700 group-hover:text-rose-600'
                }`}>
                  {lang === 'ar' ? item.name_ar : item.name_en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
