import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';

export default function StoryCategories() {
  const { lang, selectedCategory, setSelectedCategory } = useStore();

  const storyItems = [
    {
      id: 'all',
      name_ar: 'الكل',
      name_en: 'All',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
      badge: '✨'
    },
    {
      id: 'bestseller',
      name_ar: 'الأكثر مبيعاً',
      name_en: 'Bestsellers',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
      badge: '🔥'
    },
    {
      id: 'offers',
      name_ar: 'عروض حصرية',
      name_en: 'Deals',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80',
      badge: '🎁'
    },
    ...CATEGORIES.filter(c => c.id !== 'all').map(c => ({
      ...c,
      badge: null
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
    <section className="w-full bg-[#120F16] pt-4 pb-3 border-b border-rose-950/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal scroll container */}
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar py-2 px-1">
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
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#120F16] scale-110 shadow-lg shadow-rose-950/60' 
                    : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 group-hover:scale-105 group-hover:shadow-lg'
                }`}>
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full p-0.5 bg-[#1A1620] overflow-hidden shadow-inner">
                    <img
                      src={item.image}
                      alt={lang === 'ar' ? item.name_ar : item.name_en}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Badge Emoji */}
                  {item.badge && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#201B26] rounded-full flex items-center justify-center text-xs sm:text-sm shadow-md border border-amber-500/40 animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Category Label - Much bigger and bolder */}
                <span className={`mt-2.5 text-xs sm:text-sm font-extrabold tracking-tight text-center max-w-[84px] sm:max-w-[96px] truncate transition-colors ${
                  isSelected 
                    ? 'text-amber-300 font-black' 
                    : 'text-stone-300 group-hover:text-rose-300'
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
