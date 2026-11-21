import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, Key, X, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminLoginModal() {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    loginAdmin, 
    lang, 
    showToast 
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح كمسؤول المتجر ✨' : 'Logged in as Admin successfully ✨');
      setIsAdminLoginOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-rose-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-center text-stone-900 mb-1">
          {lang === 'ar' ? 'تسجيل دخول لوحة الإدارة' : 'Admin Portal Access'}
        </h3>
        <p className="text-xs text-center text-stone-500 mb-6">
          {lang === 'ar' ? 'منطقة مخصصة لإدارة المنتجات والطلبات وإعدادات المتجر' : 'Restricted area for store management'}
        </p>

        {/* Backend Status indicator */}
        <div className="mb-5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2 text-[11px] text-stone-600">
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span>
            {isSupabaseConfigured() 
              ? (lang === 'ar' ? 'متصل بقاعدة بيانات Supabase السحابية' : 'Connected to Supabase Cloud')
              : (lang === 'ar' ? 'وضع التطوير المحلي (كلمة المرور: admin123)' : 'Local Mode (Password: admin123)')}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@rosavelle.com"
                className="w-full bg-stone-50 border border-stone-200 focus:border-rose-400 focus:bg-white rounded-xl py-2.5 px-3 ps-9 text-xs text-stone-900 outline-none transition"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute start-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 focus:border-rose-400 focus:bg-white rounded-xl py-2.5 px-3 ps-9 text-xs text-stone-900 outline-none transition"
              />
              <Key className="w-4 h-4 text-stone-400 absolute start-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'دخول لوحة التحكم' : 'Authenticate'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
