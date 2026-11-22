import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav() {
  const { 
    lang, 
    cart, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen,
    setSelectedCategory
  } = useStore();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedCategory('all');
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories-section') || document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const focusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const searchInput = document.getElementById('header-search-input');
      if (searchInput) searchInput.focus();
    }, 300);
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#130F17]/95 backdrop-blur-xl border-t border-rose-950/80 px-3 py-2 shadow-[0_-6px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center p-1.5 text-stone-400 hover:text-amber-400 transition-colors active:scale-90"
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1 text-stone-300">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
        </button>

        {/* Categories */}
        <button
          onClick={scrollToCategories}
          className="flex flex-col items-center justify-center p-1.5 text-stone-400 hover:text-amber-400 transition-colors active:scale-90"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1 text-stone-300">
            {lang === 'ar' ? 'الأقسام' : 'Categories'}
          </span>
        </button>

        {/* Search */}
        <button
          onClick={focusSearch}
          className="flex flex-col items-center justify-center p-1.5 text-stone-400 hover:text-amber-400 transition-colors active:scale-90"
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px] font-bold mt-1 text-stone-300">
            {lang === 'ar' ? 'بحث' : 'Search'}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-stone-400 hover:text-rose-400 transition-colors active:scale-90"
        >
          <Heart className="w-5 h-5" />
          {totalWishlistCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
              {totalWishlistCount}
            </span>
          )}
          <span className="text-[11px] font-bold mt-1 text-stone-300">
            {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-amber-400 font-extrabold transition-transform active:scale-90"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black mt-1 text-amber-300">
            {lang === 'ar' ? 'السلة' : 'Cart'}
          </span>
        </button>

      </div>
    </nav>
  );
}
