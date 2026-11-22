import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  Settings, 
  Phone, 
  X,
  Menu,
  ChevronDown,
  Globe
} from 'lucide-react';

export default function Header() {
  const { 
    storeSettings, 
    cart, 
    wishlist, 
    lang, 
    setLang, 
    currency, 
    setCurrency, 
    formatPrice,
    cartSubtotal,
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    openAdmin,
    isAdminAuthenticated 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131116]/95 backdrop-blur-xl border-b border-rose-950/60 shadow-lg transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-stone-950 via-rose-950 to-stone-950 text-stone-200 text-sm py-2.5 px-4 border-b border-rose-900/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="font-bold text-sm tracking-wide text-rose-100">
              {lang === 'ar' ? storeSettings.announcement_ar : storeSettings.announcement_en}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* WhatsApp Contact */}
            <a 
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 font-semibold text-xs transition-colors"
              title={lang === 'ar' ? "تواصل معنا واتساب" : "WhatsApp Support"}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? "خدمة العملاء" : "Support"}</span>
            </a>

            <span className="hidden sm:inline text-stone-700">|</span>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-stone-300 hover:text-amber-400 font-bold text-xs transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            <span className="text-stone-700">|</span>

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-stone-900 text-amber-300 font-bold text-xs focus:outline-none cursor-pointer rounded px-1.5 py-0.5 border border-stone-800"
            >
              <option value="EGP" className="bg-stone-900 text-white font-bold">EGP (ج.م)</option>
              <option value="SAR" className="bg-stone-900 text-white font-bold">SAR (ر.س)</option>
              <option value="USD" className="bg-stone-900 text-white font-bold">USD ($)</option>
            </select>

            <span className="text-stone-700">|</span>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={openAdmin}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                isAdminAuthenticated 
                  ? 'bg-rose-900/80 hover:bg-rose-800 text-amber-300 border-rose-700' 
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
              }`}
              title={lang === 'ar' ? "لوحة تحكم المتجر" : "Admin Panel"}
            >
              <Settings className={`w-3.5 h-3.5 ${isAdminAuthenticated ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{lang === 'ar' ? "الإدارة" : "Admin"}</span>
              {isAdminAuthenticated && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          {/* Brand Logo */}
          <div className="flex flex-col items-start cursor-pointer" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-100 drop-shadow-md">
                ROSAVELLE
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-extrabold px-2.5 py-0.5 bg-rose-950/80 rounded-full border border-amber-500/30">
                Paris
              </span>
            </div>
            <span className="text-xs text-rose-300/80 font-medium tracking-wider hidden sm:block mt-0.5">
              {lang === 'ar' ? storeSettings.storeName_ar : storeSettings.storeTagline_en}
            </span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                placeholder={lang === 'ar' ? "ابحثي عن سيروم، روج، عطر، كريم ترطيب..." : "Search serums, lipsticks, fragrances, creams..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C1820] border border-rose-900/40 focus:border-rose-500 focus:bg-[#231E28] text-white placeholder-stone-500 rounded-full py-3 px-11 text-base shadow-inner focus:outline-none transition-all"
              />
              <Search className="w-5 h-5 text-amber-400 absolute start-4 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-3.5 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons (Wishlist & Cart) */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-3 text-stone-300 hover:text-rose-400 hover:bg-rose-950/50 rounded-full transition-all"
              title={lang === 'ar' ? "المفضلة" : "Wishlist"}
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 end-1 w-5 h-5 text-xs bg-rose-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-3 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white px-5 py-3 rounded-2xl transition-all shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95"
              title={lang === 'ar' ? "سلة الشراء" : "Shopping Bag"}
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-sm font-black text-amber-200">
                  {formatPrice(cartSubtotal)}
                </span>
                <span className="text-xs text-rose-200 font-semibold">
                  {totalCartItems} {lang === 'ar' ? 'منتج' : 'items'}
                </span>
              </div>
              {totalCartItems > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -start-1" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={lang === 'ar' ? "ابحثي عن منتجك المفضل..." : "Search products..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1820] border border-rose-900/40 focus:border-rose-500 text-white placeholder-stone-400 rounded-full py-2.5 px-10 text-sm shadow-inner focus:outline-none"
            />
            <Search className="w-4 h-4 text-amber-400 absolute start-3.5 top-3" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute end-3.5 top-3 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Categories Bar */}
      <nav className="border-t border-rose-950/40 bg-[#161218]/90 overflow-x-auto scrollbar-none py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center gap-2 sm:gap-4 whitespace-nowrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  scrollToProducts();
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-extrabold shadow-md shadow-rose-950/50 scale-105'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'ar' ? cat.name_ar : cat.name_en}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-950 bg-[#1A1620] p-5 shadow-2xl">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
            {lang === 'ar' ? "أقسام المتجر" : "Categories"}
          </p>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  scrollToProducts();
                  setMobileMenuOpen(false);
                }}
                className={`text-start px-4 py-3 rounded-xl text-base font-bold ${
                  selectedCategory === cat.id 
                    ? 'bg-rose-600 text-white' 
                    : 'text-stone-200 hover:bg-white/5'
                }`}
              >
                {lang === 'ar' ? cat.name_ar : cat.name_en}
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between text-sm">
            <button
              onClick={() => {
                openAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-amber-400 font-bold"
            >
              <Settings className="w-5 h-5" />
              <span>{lang === 'ar' ? "لوحة الإدارة" : "Store Admin"}</span>
            </button>

            <a 
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-emerald-400 font-bold"
            >
              <Phone className="w-5 h-5" />
              <span>{lang === 'ar' ? "واتساب المتجر" : "WhatsApp"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
