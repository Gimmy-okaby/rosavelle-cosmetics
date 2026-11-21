import React from 'react';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Hero from './components/Hero';
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

function MainApp() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] selection:bg-rose-200 selection:text-rose-900">
      {/* Top Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero />
        <FeaturedCategories />
        <ProductGrid />
      </main>

      {/* Footer */}
      <Footer />

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
