import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_STORE_SETTINGS } from '../data/initialData';

export async function getStoreSettings() {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('lueur_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  }

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Could not fetch store settings from Supabase, using fallback');
      const saved = localStorage.getItem('lueur_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    }

    return {
      storeName_ar: data.store_name_ar,
      storeName_en: data.store_name_en,
      storeTagline_ar: data.store_tagline_ar,
      storeTagline_en: data.store_tagline_en,
      whatsappNumber: data.whatsapp_number,
      instaPayAccount: data.instapay_account,
      vodafoneCashNumber: data.vodafone_cash_number,
      freeShippingThreshold: Number(data.free_shipping_threshold),
      announcement_ar: data.announcement_ar,
      announcement_en: data.announcement_en,
      currency: data.currency || 'EGP'
    };
  } catch (err) {
    console.error('Exception fetching store settings:', err);
    const saved = localStorage.getItem('lueur_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings) {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } = await supabase
    .from('store_settings')
    .upsert({
      id: 1,
      store_name_ar: settings.storeName_ar,
      store_name_en: settings.storeName_en,
      store_tagline_ar: settings.storeTagline_ar,
      store_tagline_en: settings.storeTagline_en,
      whatsapp_number: settings.whatsappNumber,
      instapay_account: settings.instaPayAccount,
      vodafone_cash_number: settings.vodafoneCashNumber,
      free_shipping_threshold: settings.freeShippingThreshold,
      announcement_ar: settings.announcement_ar,
      announcement_en: settings.announcement_en
    });

  if (error) {
    throw new Error(error.message);
  }
  return true;
}
