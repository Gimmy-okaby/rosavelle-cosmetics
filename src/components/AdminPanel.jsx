import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import { 
  X, 
  Settings, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Phone, 
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Upload,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminPanel() {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    orders, 
    storeSettings, 
    setStoreSettings, 
    addProduct, 
    deleteProduct, 
    updateOrderStatus, 
    resetDemoData, 
    formatPrice, 
    lang,
    theme,
    setTheme,
    showToast,
    logoutAdmin,
    adminUser 
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'settings'

  // New product form state
  const [newProd, setNewProd] = useState({
    name_ar: '',
    name_en: '',
    brand: 'Rosavelle',
    category: 'skincare',
    price: '',
    originalPrice: '',
    image: '',
    description_ar: '',
    badge_ar: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  if (!isAdminOpen) return null;

  // Key Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProd.name_ar || !newProd.price || (!newProd.image && !imageFile)) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم وسعر وصورة المنتج' : 'Please provide name, price and image', 'error');
      return;
    }
    setIsSubmittingProduct(true);
    try {
      await addProduct({
        ...newProd,
        price: Number(newProd.price),
        originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : null,
        name_en: newProd.name_en || newProd.name_ar,
        image: newProd.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
      }, imageFile);

      setNewProd({
        name_ar: '',
        name_en: '',
        brand: 'Rosavelle',
        category: 'skincare',
        price: '',
        originalPrice: '',
        image: '',
        description_ar: '',
        badge_ar: ''
      });
      setImageFile(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoreSettings(settingsForm);
    showToast(lang === 'ar' ? 'تم حفظ إعدادات المتجر بنجاح' : 'Store settings saved');
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabelsAr = {
    pending: 'قيد المراجعة',
    processing: 'جاري التجهيز',
    shipped: 'تم الشحن مع المندوب',
    delivered: 'تم التسليم بنجاح',
    cancelled: 'طلب ملغي'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-rose-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {lang === 'ar' ? 'لوحة تحكم المتجر (Admin Dashboard)' : 'Store Admin Dashboard'}
              </h2>
              <p className="text-xs text-stone-400">
                {lang === 'ar' ? 'إدارة الطلبات، المنتجات، وأرقام التحويل والواتساب' : 'Manage orders, products, and store settings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Supabase status badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${
              isSupabaseConfigured() 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800'
            }`}>
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured() ? 'Supabase Cloud' : 'Local Mode'}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في استعادة البيانات الافتراضية؟' : 'Reset to default demo data?')) {
                  resetDemoData();
                }
              }}
              className="text-xs text-stone-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-stone-700 hover:border-stone-500 flex items-center gap-1 transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="text-xs text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-rose-900 hover:border-rose-700 bg-rose-950/40 flex items-center gap-1 transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'خروج' : 'Logout'}</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Header Bar */}
        <div className="bg-stone-50 p-4 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-500 block">{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
            <span className="text-lg sm:text-xl font-extrabold text-stone-900">{formatPrice(totalRevenue)}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-500 block">{lang === 'ar' ? 'عدد الطلبات' : 'Total Orders'}</span>
            <span className="text-lg sm:text-xl font-extrabold text-stone-900">{orders.length}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-600 block">{lang === 'ar' ? 'طلبات قيد المراجعة' : 'Pending Orders'}</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-600">{pendingOrdersCount}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-500 block">{lang === 'ar' ? 'عدد المنتجات' : 'Products Count'}</span>
            <span className="text-lg sm:text-xl font-extrabold text-stone-900">{products.length}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-stone-200 bg-white px-6 flex items-center gap-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'orders' ? 'border-rose-500 text-rose-600' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{lang === 'ar' ? `الطلبات الواردة (${orders.length})` : `Orders (${orders.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'products' ? 'border-rose-500 text-rose-600' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'ar' ? `إدارة المنتجات (${products.length})` : `Products (${products.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'settings' ? 'border-rose-500 text-rose-600' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إعدادات المتجر والدفع' : 'Store Settings'}</span>
          </button>
        </div>

        {/* Main Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
                  const clientWhatsappUrl = `https://wa.me/2${cleanPhone}`;

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                            <span className="text-xs text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 font-semibold mt-0.5">
                            {order.customer.name} • {order.customer.phone}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Order Status Select */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                              statusColors[order.status] || 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            <option value="pending">{lang === 'ar' ? statusLabelsAr.pending : 'Pending'}</option>
                            <option value="processing">{lang === 'ar' ? statusLabelsAr.processing : 'Processing'}</option>
                            <option value="shipped">{lang === 'ar' ? statusLabelsAr.shipped : 'Shipped'}</option>
                            <option value="delivered">{lang === 'ar' ? statusLabelsAr.delivered : 'Delivered'}</option>
                            <option value="cancelled">{lang === 'ar' ? statusLabelsAr.cancelled : 'Cancelled'}</option>
                          </select>

                          {/* Contact customer via WhatsApp */}
                          <a
                            href={clientWhatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                            title="Chat with Customer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                          </a>
                        </div>
                      </div>

                      {/* Customer Address & Payment */}
                      <div className="text-xs text-stone-600 flex flex-wrap gap-x-4 gap-y-1 bg-stone-50 p-2.5 rounded-xl">
                        <div>
                          <span className="text-stone-400">{lang === 'ar' ? 'العنوان: ' : 'Address: '}</span>
                          <span className="font-medium text-stone-800">{order.customer.address}</span>
                        </div>
                        <div>
                          <span className="text-stone-400">{lang === 'ar' ? 'طريقة الدفع: ' : 'Payment: '}</span>
                          <span className="font-semibold text-rose-600">{order.paymentMethod.toUpperCase()}</span>
                        </div>
                        {order.notes && (
                          <div className="w-full">
                            <span className="text-stone-400">{lang === 'ar' ? 'ملاحظة: ' : 'Note: '}</span>
                            <span className="text-stone-700 italic">{order.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Items Ordered */}
                      <div className="text-xs space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-stone-700">
                            <span>
                              {item.quantity}x {item.name_ar || item.name} {item.shade ? `(${item.shade})` : ''}
                            </span>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between text-xs font-extrabold text-stone-900 pt-2 border-t border-stone-100">
                        <span>{lang === 'ar' ? 'المبلغ الكلي شامل الشحن:' : 'Grand Total with Shipping:'}</span>
                        <span className="text-sm text-rose-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                  <p className="text-sm text-stone-500">{lang === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Add New Product Box */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs">
                <h3 className="font-bold text-stone-900 text-sm mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-rose-500" />
                  <span>{lang === 'ar' ? 'إضافة منتج كوزمتكس جديد' : 'Add New Cosmetic Product'}</span>
                </h3>

                <form onSubmit={handleAddProductSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'اسم المنتج بالعربي *' : 'Product Name (Arabic) *'}</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="سيروم فيتامين C للنضارة" 
                        value={newProd.name_ar} 
                        onChange={(e) => setNewProd({...newProd, name_ar: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'الاسم بالإنجليزية' : 'Product Name (English)'}</label>
                      <input 
                        type="text" 
                        placeholder="Vitamin C Glow Serum" 
                        value={newProd.name_en} 
                        onChange={(e) => setNewProd({...newProd, name_en: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'القسم *' : 'Category *'}</label>
                      <select 
                        value={newProd.category} 
                        onChange={(e) => setNewProd({...newProd, category: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:border-rose-400"
                      >
                        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'صورة المنتج *' : 'Product Image *'}</label>
                      <div className="space-y-2">
                        <input 
                          type="url" 
                          placeholder={lang === 'ar' ? 'رابط صورة مباشر (URL)...' : 'https://images.unsplash.com/...'} 
                          value={newProd.image} 
                          onChange={(e) => {
                            setNewProd({...newProd, image: e.target.value});
                            setImageFile(null);
                          }}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-400"
                        />
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-1.5 transition">
                            <Upload className="w-3.5 h-3.5 text-rose-500" />
                            <span>{imageFile ? imageFile.name : (lang === 'ar' ? 'أو ارفع صورة من جهازك' : 'Or upload image file')}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setImageFile(e.target.files[0]);
                                  setNewProd({...newProd, image: URL.createObjectURL(e.target.files[0])});
                                }
                              }}
                            />
                          </label>
                          {imageFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setNewProd({...newProd, image: ''});
                              }}
                              className="text-[11px] text-rose-600 hover:underline"
                            >
                              {lang === 'ar' ? 'إلغاء الملف' : 'Clear file'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'السعر (ج.م) *' : 'Price (EGP) *'}</label>
                      <input 
                        type="number" 
                        required 
                        placeholder="350" 
                        value={newProd.price} 
                        onChange={(e) => setNewProd({...newProd, price: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">{lang === 'ar' ? 'السعر قبل الخصم (اختياري)' : 'Original Price (Optional)'}</label>
                      <input 
                        type="number" 
                        placeholder="450" 
                        value={newProd.originalPrice} 
                        onChange={(e) => setNewProd({...newProd, originalPrice: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 text-xs">{lang === 'ar' ? 'الوصف' : 'Description'}</label>
                    <textarea 
                      rows="2" 
                      placeholder="وصف مميزات وفوائد المنتج..." 
                      value={newProd.description_ar} 
                      onChange={(e) => setNewProd({...newProd, description_ar: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    {isSubmittingProduct ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-rose-300" />
                        <span>{lang === 'ar' ? 'إضافة المنتج للمتجر فورياً' : 'Add Product'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Existing Products List */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm mb-3">
                  {lang === 'ar' ? 'قائمة المنتجات الحالية بالمتجر' : 'Current Store Products'}
                </h4>

                <div className="space-y-2">
                  {products.map((p) => (
                    <div 
                      key={p.id} 
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image} alt={p.name_ar} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
                            {p.name_ar}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {formatPrice(p.price)} • {p.category}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-stone-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                        title={lang === 'ar' ? 'حذف المنتج' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* THEME PALETTE SELECTOR */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                      {lang === 'ar' ? '🎨 ثيم وألوان المتجر (Theme Palette)' : '🎨 Store Color Theme'}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {lang === 'ar' ? 'اختاري اللمسة الجمالية لمتجرك وسيتم تغيير الألوان فورياً في كل الموقع' : 'Choose your brand accent color palette'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 uppercase border border-stone-200">
                    {theme}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Rose Blossom */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('rose');
                      showToast(lang === 'ar' ? 'تم تطبيق ثيم الورد المخملي 🌸' : 'Applied Rose Blossom Theme 🌸');
                    }}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      theme === 'rose' ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-500 shrink-0 border border-white shadow-xs" />
                    <div>
                      <p className="font-bold text-xs text-stone-900">{lang === 'ar' ? 'الوردي المخملي' : 'Rose Blossom'}</p>
                      <p className="text-[10px] text-stone-500">{lang === 'ar' ? 'كلاسيكي وناعم' : 'Classic Soft'}</p>
                    </div>
                  </button>

                  {/* Royal Gold */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('gold');
                      showToast(lang === 'ar' ? 'تم تطبيق ثيم الذهب الملكي 👑' : 'Applied Royal Gold Theme 👑');
                    }}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      theme === 'gold' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 shrink-0 border border-white shadow-xs" />
                    <div>
                      <p className="font-bold text-xs text-stone-900">{lang === 'ar' ? 'الذهبي الملكي' : 'Royal Gold'}</p>
                      <p className="text-[10px] text-stone-500">{lang === 'ar' ? 'فخامة وشمبانيا' : 'Luxury Champagne'}</p>
                    </div>
                  </button>

                  {/* Clean Emerald */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('emerald');
                      showToast(lang === 'ar' ? 'تم تطبيق ثيم الزمردي الطبيعي 🌿' : 'Applied Clean Emerald Theme 🌿');
                    }}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      theme === 'emerald' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 shrink-0 border border-white shadow-xs" />
                    <div>
                      <p className="font-bold text-xs text-stone-900">{lang === 'ar' ? 'الزمردي الطبيعي' : 'Clean Emerald'}</p>
                      <p className="text-[10px] text-stone-500">{lang === 'ar' ? 'أورجانيك وعناية' : 'Organic & Fresh'}</p>
                    </div>
                  </button>

                  {/* Velvet Burgundy */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('burgundy');
                      showToast(lang === 'ar' ? 'تم تطبيق ثيم البرغندي الفاخر 🍷' : 'Applied Velvet Burgundy Theme 🍷');
                    }}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      theme === 'burgundy' ? 'border-rose-900 bg-rose-50 ring-2 ring-rose-200' : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-900 shrink-0 border border-white shadow-xs" />
                    <div>
                      <p className="font-bold text-xs text-stone-900">{lang === 'ar' ? 'البرغندي الفاخر' : 'Velvet Burgundy'}</p>
                      <p className="text-[10px] text-stone-500">{lang === 'ar' ? 'جاذبية وأناقة' : 'Deep Elegance'}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Settings */}
              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-stone-900 text-sm mb-2">
                  {lang === 'ar' ? 'تخصيص أرقام وحسابات المتجر' : 'Store Setup & Accounts'}
                </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {lang === 'ar' ? 'رقم الواتساب لاستقبال الطلبات *' : 'WhatsApp Number for Orders *'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-rose-400"
                    placeholder="+201012345678"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    {lang === 'ar' ? 'يُستخدم في زر تأكيد الطلبات عبر واتساب وفي تواصل العملاء.' : 'Used for WhatsApp confirmations.'}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {lang === 'ar' ? 'معرف حساب إنستاباي (InstaPay IPA)' : 'InstaPay IPA Account'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instaPayAccount}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instaPayAccount: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-rose-400"
                    placeholder="store.cosmetics@instapay"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {lang === 'ar' ? 'رقم محفظة فودافون كاش' : 'Vodafone Cash Number'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.vodafoneCashNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vodafoneCashNumber: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-rose-400"
                    placeholder="01012345678"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {lang === 'ar' ? 'الحد الأدنى للشحن المجاني (ج.م)' : 'Free Shipping Threshold (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-400"
                    placeholder="600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    {lang === 'ar' ? 'رسالة الشريط العلوي (العروض والإعلانات)' : 'Top Announcement Banner'}
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement_ar}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement_ar: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4 text-rose-300" />
                  <span>{lang === 'ar' ? 'حفظ إعدادات المتجر' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>
          )}

        </div>
      </div>
    </div>
  );
}
