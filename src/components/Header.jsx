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
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#EBE4DE] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-rose-300 shrink-0 animate-pulse" />
            <span className="font-medium tracking-wide">
              {lang === 'ar' ? storeSettings.announcement_ar : storeSettings.announcement_en}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* WhatsApp Contact */}
            <a 
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition-colors"
              title={lang === 'ar' ? "تواصل معنا واتساب" : "WhatsApp Support"}
            >
              <Phone className="w-3 h-3" />
              <span>{lang === 'ar' ? "خدمة العملاء" : "Support"}</span>
            </a>

            <span className="hidden sm:inline text-stone-600">|</span>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-stone-300 hover:text-rose-300 font-medium transition-colors"
              title="Change Language"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            <span className="text-stone-600">|</span>

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-stone-300 text-xs focus:outline-none cursor-pointer hover:text-rose-300"
            >
              <option value="EGP" className="bg-stone-900 text-white">EGP (ج.م)</option>
              <option value="SAR" className="bg-stone-900 text-white">SAR (ر.س)</option>
              <option value="USD" className="bg-stone-900 text-white">USD ($)</option>
            </select>

            <span className="text-stone-600">|</span>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={openAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition ${
                isAdminAuthenticated 
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
              title={lang === 'ar' ? "لوحة تحكم المتجر" : "Admin Panel"}
            >
              <Settings className={`w-3 h-3 ${isAdminAuthenticated ? 'text-rose-400' : 'text-stone-400'}`} />
              <span>{lang === 'ar' ? "لوحة الإدارة" : "Admin"}</span>
              {isAdminAuthenticated && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-rose-900 rounded-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex flex-col items-start cursor-pointer" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-display tracking-widest font-bold text-stone-900">
                ROSAVELLE
              </span>
              <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold px-2 py-0.5 bg-rose-50 rounded-full border border-rose-100">
                Paris
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-light -mt-0.5 tracking-wider hidden sm:block">
              {lang === 'ar' ? storeSettings.storeName_ar : storeSettings.storeTagline_en}
            </span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={lang === 'ar' ? "ابحثي عن مستحضرات تجميل، سيروم، أحمر شفاه..." : "Search cosmetics, serums, lipsticks..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-stone-200 focus:border-rose-400 focus:bg-white rounded-full py-2.5 px-10 text-sm text-stone-800 placeholder-stone-400 shadow-xs focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons (Wishlist & Cart) */}
          <div className="flex items-center gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 text-stone-700 hover:text-rose-600 hover:bg-rose-50/60 rounded-full transition-all"
              title={lang === 'ar' ? "قائمة الأمنيات" : "Wishlist"}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 end-1 w-4 h-4 text-[10px] bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
              title={lang === 'ar' ? "حقيبة التسوق" : "Shopping Bag"}
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-semibold">
                  {formatPrice(cartSubtotal)}
                </span>
                <span className="text-[10px] text-stone-300">
                  {totalCartItems} {lang === 'ar' ? 'قطع' : 'items'}
                </span>
              </div>
              {totalCartItems > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute top-2 start-2" />
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
              className="w-full bg-white border border-stone-200 focus:border-rose-400 rounded-full py-2 px-9 text-xs text-stone-800 placeholder-stone-400 shadow-xs focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Categories Bar */}
      <nav className="border-t border-[#EBE4DE] bg-white/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center gap-2 sm:gap-6 py-2.5 whitespace-nowrap text-xs sm:text-sm font-medium">
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
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
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
        <div className="md:hidden border-t border-stone-200 bg-white p-4 shadow-xl">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            {lang === 'ar' ? "الأقسام" : "Categories"}
          </p>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  scrollToProducts();
                  setMobileMenuOpen(false);
                }}
                className={`text-start px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === cat.id 
                    ? 'bg-rose-50 text-rose-600 font-semibold' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {lang === 'ar' ? cat.name_ar : cat.name_en}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <button
              onClick={() => {
                openAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-rose-600 font-semibold"
            >
              <Settings className="w-4 h-4" />
              <span>{lang === 'ar' ? "إدارة المتجر والطلبات" : "Store Admin"}</span>
            </button>

            <a 
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>{lang === 'ar' ? "واتساب المتجر" : "WhatsApp"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
