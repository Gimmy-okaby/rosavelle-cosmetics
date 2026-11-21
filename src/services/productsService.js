import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_PRODUCTS } from '../data/initialData';

/**
 * Fetch all active products with their variants from Supabase
 */
export async function getProducts() {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('lueur_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name_ar, name_en),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getProducts error, falling back to local data:', error.message);
      const saved = localStorage.getItem('lueur_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return INITIAL_PRODUCTS;
    }

    // Map database fields to frontend structure for backward compatibility
    return data.map(p => ({
      id: p.id,
      slug: p.slug,
      name_ar: p.name_ar,
      name_en: p.name_en,
      brand: p.brand,
      category: p.category?.slug || 'skincare',
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : null,
      rating: Number(p.rating) || 5.0,
      reviewsCount: p.reviews_count || 0,
      image: p.main_image,
      gallery: p.gallery || [p.main_image],
      inStock: p.in_stock,
      badge_ar: p.badge_ar,
      badge_en: p.badge_en,
      badgeType: p.badge_type || 'normal',
      description_ar: p.description_ar,
      description_en: p.description_en,
      ingredients_ar: p.ingredients_ar,
      howToUse_ar: p.how_to_use_ar,
      skinType: p.skin_type_ar || p.skin_type_en,
      shades: p.variants?.filter(v => v.variant_type === 'shade').map(v => ({
        id: v.id,
        name_ar: v.name_ar,
        name_en: v.name_en,
        hex: v.color_hex
      })) || [],
      sizes: p.variants?.filter(v => v.variant_type === 'size').map(v => v.name_en || v.name_ar) || []
    }));
  } catch (err) {
    console.error('Exception in getProducts:', err);
    const saved = localStorage.getItem('lueur_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }
}

/**
 * Upload a product image to Supabase Storage bucket 'product-images'
 */
export async function uploadProductImage(file) {
  if (!isSupabaseConfigured() || !file) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Failed to upload image to Supabase storage:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error('Error in uploadProductImage:', err);
    return null;
  }
}

/**
 * Create a new product in Supabase
 */
export async function createProduct(productData) {
  if (!isSupabaseConfigured()) {
    return {
      ...productData,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true
    };
  }

  const slug = productData.name_en 
    ? productData.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
    : `prod-${Date.now()}`;

  const { data, error } = await supabase
    .from('products')
    .insert({
      slug,
      name_ar: productData.name_ar,
      name_en: productData.name_en || productData.name_ar,
      brand: productData.brand || 'Rosavelle',
      price: productData.price,
      original_price: productData.originalPrice || null,
      main_image: productData.image,
      gallery: productData.gallery || [productData.image],
      badge_ar: productData.badge_ar || null,
      description_ar: productData.description_ar || null,
      in_stock: true,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Also initialize inventory record
  await supabase.from('inventory').insert({
    product_id: data.id,
    quantity: productData.stockCount || 20,
    low_stock_threshold: 5
  });

  return {
    ...productData,
    id: data.id,
    rating: 5.0,
    reviewsCount: 1,
    inStock: true
  };
}

/**
 * Delete a product (or archive it)
 */
export async function deleteProduct(productId) {
  if (!isSupabaseConfigured()) {
    return true;
  }

  // Soft delete by setting is_active = false
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId);

  if (error) {
    throw new Error(error.message);
  }
  return true;
}
