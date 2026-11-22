import React from 'react';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import FlashSaleBanner from './components/FlashSaleBanner';
import StoryCategories from './components/StoryCategories';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import FeaturedCategories from './components/FeaturedCategories';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import RecentSalesNotification from './components/RecentSalesNotification';
import MobileBottomNav from './components/MobileBottomNav';

function MainApp() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0E11] text-stone-100 selection:bg-rose-600 selection:text-white pb-20 sm:pb-0">
      {/* Top Navigation */}
      <Header />

      {/* Luxury Promo Countdown Banner */}
      <FlashSaleBanner />

      {/* Instagram-style Category Story Bubbles */}
      <StoryCategories />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero />
        <TrustBadges />
        <FeaturedCategories />
        <ProductGrid />
      </main>

      {/* Footer */}
      <Footer />

      {/* Native-app Style Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Floating Interactive Widgets */}
      <FloatingWhatsApp />
      <RecentSalesNotification />

      {/* Interactive Drawers & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminPanel />
      <AdminLoginModal />
      
      {/* Dynamic Toast Feedback */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
