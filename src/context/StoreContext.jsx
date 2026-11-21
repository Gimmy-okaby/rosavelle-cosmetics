import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_STORE_SETTINGS, 
  COUPONS, 
  GOVERNORATES 
} from '../data/initialData';
import { 
  getProducts, 
  createProduct as createProductService, 
  updateProduct as updateProductService,
  deleteProduct as deleteProductService, 
  uploadProductImage 
} from '../services/productsService';
import { 
  getOrders, 
  submitOrder, 
  updateOrderStatus as updateOrderStatusService 
} from '../services/ordersService';
import { 
  getStoreSettings, 
  updateStoreSettings 
} from '../services/settingsService';
import { 
  signInAdmin, 
  signOutAdmin, 
  getAdminSession 
} from '../services/authService';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // --- Persistent Storage State ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('lueur_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lueur_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('lueur_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('lueur_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('lueur_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lueur_lang') || 'ar';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('lueur_currency') || 'EGP';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bloomora_theme') || 'rose';
  });

  // --- Auth State ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // --- Filter & Search States ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  // --- Modals State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastOrderPlaced, setLastOrderPlaced] = useState(null);

  // --- Coupon State ---
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // --- Toast Notification State ---
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === prev?.id ? null : prev));
    }, 3500);
  };

  // --- Initial Data Fetching from Supabase ---
  useEffect(() => {
    // 1. Fetch active products
    getProducts().then(fetchedProducts => {
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
    }).catch(err => console.warn('Product sync note:', err));

    // 2. Fetch store settings
    getStoreSettings().then(fetchedSettings => {
      if (fetchedSettings) {
        setStoreSettings(fetchedSettings);
      }
    }).catch(err => console.warn('Settings sync note:', err));

    // 3. Check for existing admin session
    getAdminSession().then(session => {
      if (session) {
        setIsAdminAuthenticated(true);
        setAdminUser(session.user || session);
        // If authenticated admin, load orders
        getOrders().then(setOrders).catch(console.warn);
      }
    }).catch(console.warn);
  }, []);

  // --- Sync with localStorage & document attributes ---
  useEffect(() => {
    localStorage.setItem('lueur_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lueur_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lueur_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('lueur_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lueur_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lueur_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('lueur_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('bloomora_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Price Formatting & Currency Conversion ---
  const formatPrice = (egpAmount) => {
    if (currency === 'USD') {
      const usd = (egpAmount / 50).toFixed(2);
      return `$${usd}`;
    }
    if (currency === 'SAR') {
      const sar = (egpAmount / 13.3).toFixed(1);
      return `${sar} ر.س`;
    }
    // Default EGP
    return lang === 'ar' ? `${egpAmount} ج.م` : `${egpAmount} EGP`;
  };

  // --- Cart Calculations ---
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const discountAmount = appliedCoupon 
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100) 
    : 0;

  const isFreeShipping = cartSubtotal >= (storeSettings?.freeShippingThreshold || 600);

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1, shade = null, size = null) => {
    const cartItemId = `${product.id}-${shade?.name_en || shade?.name_ar || 'def'}-${size || 'def'}`;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          cartItemId,
          id: product.id,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          brand: product.brand,
          shade,
          size,
          quantity
        }];
      }
    });

    showToast(
      lang === 'ar' 
        ? `تمت إضافة "${product.name_ar}" إلى حقيبة التسوق ✨` 
        : `Added "${product.name_en}" to your shopping bag ✨`
    );
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast(
      lang === 'ar' ? 'تم حذف المنتج من الحقيبة' : 'Item removed from bag',
      'info'
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(
          lang === 'ar' ? 'تمت إزالة المنتج من المفضلة' : 'Removed from wishlist',
          'info'
        );
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(
          lang === 'ar' ? 'تمت إضافة المنتج إلى قائمة أمنياتك ❤️' : 'Added to wishlist ❤️'
        );
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // --- Coupon Action ---
  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    const coupon = COUPONS[normalized];
    if (!coupon) {
      setCouponError(lang === 'ar' ? 'كود الخصم غير صحيح أو منتهي الصلاحية' : 'Invalid or expired coupon code');
      return false;
    }
    if (cartSubtotal < coupon.minSpend) {
      setCouponError(
        lang === 'ar' 
          ? `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minSpend} ج.م` 
          : `Minimum spend for this coupon is ${coupon.minSpend} EGP`
      );
      return false;
    }

    setAppliedCoupon({
      code: normalized,
      discountPercent: coupon.discountPercent,
      label_ar: coupon.label_ar
    });
    setCouponError('');
    showToast(
      lang === 'ar' ? `🎉 مبروك! تم تطبيق خصم ${coupon.discountPercent}%` : `Applied ${coupon.discountPercent}% OFF!`
    );
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // --- Place Order Action (Async Backend + WhatsApp Ready) ---
  const placeOrder = async (orderData) => {
    try {
      const createdOrder = await submitOrder({
        customer: orderData.customer,
        cartItems: cart,
        shippingCost: orderData.shippingCost,
        paymentMethod: orderData.paymentMethod,
        couponCode: appliedCoupon?.code,
        notes: orderData.notes
      });

      setOrders(prev => [createdOrder, ...prev]);
      setLastOrderPlaced(createdOrder);
      clearCart();
      setIsCheckoutOpen(false);
      showToast(
        lang === 'ar' ? '🎉 تم تسجيل طلبك بنجاح! شكراً لثقتك بنا.' : '🎉 Order placed successfully! Thank you.',
        'success'
      );
      return createdOrder;
    } catch (err) {
      console.error('Order creation error:', err);
      showToast(lang === 'ar' ? 'حدث خطأ أثناء حفظ الطلب' : 'Error placing order', 'error');
      throw err;
    }
  };

  // --- Admin Authentication Actions ---
  const openAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
      // Refresh orders
      getOrders().then(setOrders).catch(console.warn);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const loginAdmin = async (email, password) => {
    const result = await signInAdmin(email, password);
    setIsAdminAuthenticated(true);
    setAdminUser(result.user || result.profile);
    setIsAdminOpen(true);
    // Fetch fresh orders
    getOrders().then(setOrders).catch(console.warn);
    return result;
  };

  const logoutAdmin = async () => {
    await signOutAdmin();
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setIsAdminOpen(false);
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'info');
  };

  // --- Admin Product Management ---
  const addProduct = async (newProduct, imageFile = null) => {
    let imageUrl = newProduct.image;
    
    // If an image file was uploaded via Supabase Storage
    if (imageFile) {
      const uploadedUrl = await uploadProductImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const productToCreate = {
      ...newProduct,
      image: imageUrl
    };

    const savedProduct = await createProductService(productToCreate);
    setProducts(prev => [savedProduct, ...prev]);
    showToast(lang === 'ar' ? 'تمت إضافة المنتج الجديد للمتجر بنجاح' : 'Product added successfully');
    return savedProduct;
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const persisted = await updateProductService(updatedProduct.id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...persisted } : p));
      showToast(lang === 'ar' ? 'تم تحديث بيانات المنتج بنجاح' : 'Product updated');
      return persisted;
    } catch (err) {
      console.error('Failed to update product in database:', err);
      showToast(lang === 'ar' ? 'فشل تحديث بيانات المنتج في السيرفر' : 'Failed to update product on server', 'error');
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    await deleteProductService(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(lang === 'ar' ? 'تم حذف المنتج من المتجر' : 'Product deleted', 'info');
  };

  // --- Admin Order Status Management ---
  const updateOrderStatus = async (orderId, newStatus) => {
    await updateOrderStatusService(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Order status updated');
  };

  // --- Save Store Settings ---
  const saveStoreSettings = async (newSettings) => {
    await updateStoreSettings(newSettings);
    setStoreSettings(newSettings);
    showToast(lang === 'ar' ? 'تم حفظ إعدادات المتجر بنجاح' : 'Store settings saved');
  };

  // --- Reset to Demo Data ---
  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('lueur_products');
    localStorage.removeItem('lueur_orders');
    localStorage.removeItem('lueur_settings');
    localStorage.removeItem('lueur_cart');
    localStorage.removeItem('lueur_wishlist');
    showToast(lang === 'ar' ? 'تم استعادة البيانات الافتراضية بنجاح' : 'Reset to demo data');
  };

  return (
    <StoreContext.Provider value={{
      products,
      orders,
      storeSettings,
      setStoreSettings: saveStoreSettings,
      cart,
      wishlist,
      lang,
      setLang,
      currency,
      setCurrency,
      theme,
      setTheme,
      formatPrice,
      
      // Admin Auth
      isAdminAuthenticated,
      adminUser,
      openAdmin,
      loginAdmin,
      logoutAdmin,
      isAdminLoginOpen,
      setIsAdminLoginOpen,

      // Filters
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      priceRange,
      setPriceRange,

      // Modals
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAdminOpen,
      setIsAdminOpen,
      selectedProduct,
      setSelectedProduct,
      lastOrderPlaced,
      setLastOrderPlaced,

      // Cart calculations
      cartSubtotal,
      discountAmount,
      isFreeShipping,
      appliedCoupon,
      couponError,
      applyCoupon,
      removeCoupon,

      // Actions
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      placeOrder,

      // Admin actions
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      resetDemoData,

      // Toast
      toastMessage,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
