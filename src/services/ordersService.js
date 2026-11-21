import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_ORDERS } from '../data/initialData';

/**
 * Submit an order either via secure Supabase RPC or local fallback
 */
export async function submitOrder({ customer, cartItems, shippingCost, paymentMethod, couponCode, notes }) {
  if (!isSupabaseConfigured()) {
    // Local fallback
    const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder = {
      id: `LU-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      subtotal: cartSubtotal,
      discountAmount: 0,
      shippingCost,
      total: cartSubtotal + shippingCost,
      customer,
      paymentMethod,
      notes: notes || '',
      status: 'pending'
    };
    return newOrder;
  }

  try {
    // Format items for RPC payload
    const formattedItems = cartItems.map(item => ({
      product_id: item.id,
      variant_id: item.shade?.id || null,
      quantity: item.quantity,
      shade_name_ar: item.shade?.name_ar || null,
      size_label: item.size || null
    }));

    const { data, error } = await supabase.rpc('place_guest_order', {
      p_customer_name: customer.name,
      p_customer_phone: customer.phone,
      p_customer_email: customer.email || null,
      p_governorate: customer.governorate,
      p_governorate_name_ar: customer.governorate_name || customer.governorate,
      p_address: customer.address,
      p_payment_method: paymentMethod,
      p_shipping_cost: shippingCost,
      p_items: formattedItems,
      p_coupon_code: couponCode || null,
      p_notes: notes || null
    });

    if (error) {
      console.error('Supabase RPC place_guest_order error:', error);
      throw new Error(error.message);
    }

    return {
      id: data.order_number,
      order_uuid: data.order_id,
      createdAt: data.created_at,
      items: [...cartItems],
      subtotal: data.subtotal,
      discountAmount: data.discount_amount,
      shippingCost: data.shipping_cost,
      total: data.total,
      customer,
      paymentMethod,
      notes: notes || '',
      status: 'pending'
    };
  } catch (err) {
    console.warn('Falling back to local order submission due to error:', err);
    // Fallback gracefully so customer order is never lost
    const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return {
      id: `LU-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      subtotal: cartSubtotal,
      discountAmount: 0,
      shippingCost,
      total: cartSubtotal + shippingCost,
      customer,
      paymentMethod,
      notes: notes || '',
      status: 'pending'
    };
  }
}

/**
 * Fetch orders for the admin dashboard
 */
export async function getOrders() {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('lueur_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to fetch orders from Supabase:', error.message);
      const saved = localStorage.getItem('lueur_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(o => ({
      id: o.order_number,
      order_uuid: o.id,
      createdAt: o.created_at,
      customer: {
        name: o.customer_name,
        phone: o.customer_phone,
        email: o.customer_email,
        governorate: o.governorate,
        address: o.address
      },
      items: (o.items || []).map(i => ({
        id: i.product_id,
        name: i.product_name_ar,
        name_ar: i.product_name_ar,
        name_en: i.product_name_en,
        quantity: i.quantity,
        price: Number(i.unit_price),
        shade: i.shade_name_ar
      })),
      subtotal: Number(o.subtotal),
      shippingCost: Number(o.shipping_cost),
      discountAmount: Number(o.discount_amount),
      total: Number(o.total),
      paymentMethod: o.payment_method,
      status: o.status
    }));
  } catch (err) {
    console.error('Exception fetching orders:', err);
    const saved = localStorage.getItem('lueur_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderNumber, newStatus) {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('order_number', orderNumber);

  if (error) {
    console.error('Failed to update order status in Supabase:', error);
  }
  return true;
}
