-- ==============================================================================
-- ROSAVELLE COSMETICS - HARDENED PRODUCTION DATABASE SETUP
-- Version: 2.1 (RLS Recursion Hardened & Payload Deduplicated)
-- ==============================================================================

-- ==============================================================================
-- 01_schema.sql - Normalized PostgreSQL Schema for Rosavelle Cosmetics
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to handle updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon TEXT DEFAULT 'Sparkles',
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'Rosavelle',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    rating DECIMAL(2, 1) NOT NULL DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    reviews_count INT NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    main_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    in_stock BOOLEAN NOT NULL DEFAULT true,
    badge_ar TEXT,
    badge_en TEXT,
    badge_type TEXT DEFAULT 'normal' CHECK (badge_type IN ('normal', 'bestseller', 'sale', 'trending', 'new')),
    description_ar TEXT,
    description_en TEXT,
    ingredients_ar TEXT,
    ingredients_en TEXT,
    how_to_use_ar TEXT,
    how_to_use_en TEXT,
    skin_type_ar TEXT,
    skin_type_en TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 4. PRODUCT_VARIANTS (Shades, Sizes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL CHECK (variant_type IN ('shade', 'size', 'scent', 'bundle')),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    color_hex TEXT, -- Used for lipstick / makeup shades (e.g. #C46B72)
    sku TEXT,
    price_override DECIMAL(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
    in_stock BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 5. INVENTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_variant_inventory UNIQUE NULLS NOT DISTINCT (product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON public.inventory(variant_id);

-- ------------------------------------------------------------------------------
-- 6. STORE_SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton record
    store_name_ar TEXT NOT NULL DEFAULT 'Ø±ÙˆØ²Ø§ÙÙŠÙ„ ÙƒÙˆØ²Ù…ØªÙƒØ³',
    store_name_en TEXT NOT NULL DEFAULT 'Rosavelle Cosmetics',
    store_tagline_ar TEXT DEFAULT 'Ø³Ø­Ø± Ø§Ù„ÙˆØ±Ø¯ ÙˆØ§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„Ø¨Ø§Ø±ÙŠØ³ÙŠ Ø§Ù„ÙØ§Ø®Ø±',
    store_tagline_en TEXT DEFAULT 'Pure Rose Luxury & Radiant Beauty',
    whatsapp_number TEXT NOT NULL DEFAULT '+201012345678',
    instapay_account TEXT DEFAULT 'rosavelle.cosmetics@instapay',
    vodafone_cash_number TEXT DEFAULT '01012345678',
    free_shipping_threshold DECIMAL(10, 2) NOT NULL DEFAULT 600.00,
    announcement_ar TEXT DEFAULT 'âœ¨ Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ Ù„Ø¬Ù…ÙŠØ¹ Ù…Ø­Ø§ÙØ¸Ø§Øª Ù…ØµØ± Ù„Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØªÙŠ ØªØ²ÙŠØ¯ Ø¹Ù† 600 Ø¬.Ù… + Ù‡Ø¯ÙŠØ© Ø­ØµØ±ÙŠØ© Ù…Ù† Ø±ÙˆØ²Ø§ÙÙŠÙ„ Ù…Ø¹ ÙƒÙ„ Ø·Ù„Ø¨! ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ…: BEAUTY10',
    announcement_en TEXT DEFAULT 'âœ¨ Free express shipping on orders over 600 EGP + Free Rosavelle luxury gift with every order! Use code: BEAUTY10',
    currency TEXT NOT NULL DEFAULT 'EGP',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 7. COUPONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (min_spend >= 0),
    max_discount_amount DECIMAL(10, 2),
    label_ar TEXT,
    label_en TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ------------------------------------------------------------------------------
-- 8. ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE, -- E.g. LU-10930
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    governorate TEXT NOT NULL,
    governorate_name_ar TEXT,
    governorate_name_en TEXT,
    address TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'instapay', 'vodafone_cash', 'card')),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_cost >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    coupon_code TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest checkout
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 9. ORDER_ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name_ar TEXT NOT NULL,
    product_name_en TEXT NOT NULL,
    shade_name_ar TEXT,
    shade_name_en TEXT,
    size_label TEXT,
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- ------------------------------------------------------------------------------
-- 10. INVENTORY_MOVEMENTS (Audit trail for stock)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    change_amount INT NOT NULL, -- Negative for orders/deductions, positive for restocks
    previous_quantity INT,
    new_quantity INT,
    reason TEXT NOT NULL CHECK (reason IN ('order', 'order_cancellation', 'restock', 'manual_adjustment', 'loss')),
    reference_id TEXT, -- E.g. Order ID
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inv_movements_product ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_created ON public.inventory_movements(created_at DESC);

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC ORDER STATUS & INVENTORY RESTORATION TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    v_item RECORD;
BEGIN
    -- Prevent non-admins from changing order status
    IF OLD.status != NEW.status AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only store administrators can change order status.';
    END IF;

    -- 1. Order Cancelled: Restore inventory exactly once
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        FOR v_item IN 
            SELECT product_id, variant_id, quantity 
            FROM public.order_items 
            WHERE order_id = NEW.id 
        LOOP
            -- Atomically restore stock in inventory
            UPDATE public.inventory
            SET quantity = quantity + v_item.quantity,
                updated_at = NOW()
            WHERE product_id = v_item.product_id
              AND (
                  (v_item.variant_id IS NOT NULL AND variant_id = v_item.variant_id)
                  OR (v_item.variant_id IS NULL AND variant_id IS NULL)
              );

            -- Log movement audit record
            INSERT INTO public.inventory_movements (
                product_id,
                variant_id,
                change_amount,
                previous_quantity,
                new_quantity,
                reason,
                reference_id,
                notes
            ) VALUES (
                v_item.product_id,
                v_item.variant_id,
                v_item.quantity,
                (SELECT quantity - v_item.quantity FROM public.inventory WHERE product_id = v_item.product_id AND ((v_item.variant_id IS NOT NULL AND variant_id = v_item.variant_id) OR (v_item.variant_id IS NULL AND variant_id IS NULL)) LIMIT 1),
                (SELECT quantity FROM public.inventory WHERE product_id = v_item.product_id AND ((v_item.variant_id IS NOT NULL AND variant_id = v_item.variant_id) OR (v_item.variant_id IS NULL AND variant_id IS NULL)) LIMIT 1),
                'order_cancellation',
                NEW.order_number,
                'Inventory restored automatically upon order cancellation'
            );
        END LOOP;
    END IF;

    -- 2. Prevent un-cancelling an order directly to prevent double-restoring or state corruption
    IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
        RAISE EXCEPTION 'Cancelled orders cannot be reopened directly to prevent inventory discrepancies. Please create a new order.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_handle_order_status ON public.orders;
CREATE TRIGGER trg_handle_order_status
BEFORE UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_change();

-- ------------------------------------------------------------------------------
-- 12. IMMUTABLE ROLE PROTECTION TRIGGER FOR PROFILES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    -- Prevent modifying role unless the user executing this is a verified admin
    IF NEW.role != OLD.role AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Users cannot modify their own account privileges.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();


-- ==============================================================================
-- 02_security_and_rls.sql - Hardened Row Level Security (RLS) Policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. HELPER FUNCTION: Check if requesting user is an Admin
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. PROFILES POLICIES & SECURE REGISTRATION TRIGGER
-- ------------------------------------------------------------------------------
-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own personal details (name, phone)
-- Role immutability is strictly enforced by the BEFORE UPDATE trigger 'trg_protect_profile_role'
-- avoiding recursive RLS subquery evaluation on public.profiles.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can view and manage all profiles
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- Auto-create profile on user signup
-- CRITICAL SECURITY RULE: Every newly registered user receives 'customer' role.
-- Never trust client-supplied metadata for authorization!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'customer' -- HARDCODED: Role cannot be elevated via registration payload
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to invoke profile creation on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active categories
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true OR public.is_admin());

-- Admins can manage categories
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
CREATE POLICY "Admins have full access to categories"
ON public.categories FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true OR public.is_admin());

-- Admins can manage products
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products"
ON public.products FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. PRODUCT_VARIANTS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view product variants
DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants"
ON public.product_variants FOR SELECT
USING (true);

-- Admins can manage product variants
DROP POLICY IF EXISTS "Admins have full access to product variants" ON public.product_variants;
CREATE POLICY "Admins have full access to product variants"
ON public.product_variants FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. INVENTORY POLICIES
-- ------------------------------------------------------------------------------
-- Public can check inventory quantity (read-only)
DROP POLICY IF EXISTS "Public can read inventory" ON public.inventory;
CREATE POLICY "Public can read inventory"
ON public.inventory FOR SELECT
USING (true);

-- Admins can manage inventory
DROP POLICY IF EXISTS "Admins have full access to inventory" ON public.inventory;
CREATE POLICY "Admins have full access to inventory"
ON public.inventory FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. STORE_SETTINGS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view store settings
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings"
ON public.store_settings FOR SELECT
USING (true);

-- Admins can update store settings
DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings"
ON public.store_settings FOR UPDATE
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. COUPONS POLICIES
-- ------------------------------------------------------------------------------
-- Public can check active, non-expired coupons
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
CREATE POLICY "Public can view active coupons"
ON public.coupons FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Admins can manage coupons
DROP POLICY IF EXISTS "Admins have full access to coupons" ON public.coupons;
CREATE POLICY "Admins have full access to coupons"
ON public.coupons FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. ORDERS POLICIES
-- ------------------------------------------------------------------------------
-- HARDENED: Direct INSERT on orders table by public/anonymous is REVOKED.
-- All guest checkout must go through the validated place_guest_order() RPC!
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert orders directly" ON public.orders;
CREATE POLICY "Admins can insert orders directly"
ON public.orders FOR INSERT
WITH CHECK (public.is_admin());

-- Users can view their own orders; guests cannot view other orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.is_admin()
);

-- Admins have full access to orders
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders"
ON public.orders FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. ORDER_ITEMS POLICIES
-- ------------------------------------------------------------------------------
-- HARDENED: Direct INSERT on order_items table by public/anonymous is REVOKED.
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert order items directly" ON public.order_items;
CREATE POLICY "Admins can insert order items directly"
ON public.order_items FOR INSERT
WITH CHECK (public.is_admin());

-- Users can view their own order items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
);

-- Admins have full access to order items
DROP POLICY IF EXISTS "Admins have full access to order items" ON public.order_items;
CREATE POLICY "Admins have full access to order items"
ON public.order_items FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. INVENTORY_MOVEMENTS POLICIES
-- ------------------------------------------------------------------------------
-- Only admins can view or manage inventory movements
DROP POLICY IF EXISTS "Admins only access to inventory movements" ON public.inventory_movements;
CREATE POLICY "Admins only access to inventory movements"
ON public.inventory_movements FOR ALL
USING (public.is_admin());


-- ==============================================================================
-- 03_functions.sql - Secure Business Logic & Atomic RPC Functions (Hardened)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Function: place_guest_order
-- Performs atomic validation, pricing recalculation, inventory deduction,
-- and order record creation safely on the database server.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.place_guest_order(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_governorate TEXT,
    p_governorate_name_ar TEXT,
    p_address TEXT,
    p_payment_method TEXT,
    p_shipping_cost DECIMAL,
    p_items JSONB, -- Array of { product_id, variant_id, quantity, size_label, shade_name_ar }
    p_coupon_code TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB 
SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_subtotal DECIMAL(10, 2) := 0.00;
    v_discount_amount DECIMAL(10, 2) := 0.00;
    v_shipping_cost DECIMAL(10, 2) := GREATEST(0.00, COALESCE(p_shipping_cost, 0.00));
    v_total DECIMAL(10, 2) := 0.00;
    v_item JSONB;
    v_product RECORD;
    v_variant RECORD;
    v_variant_id UUID;
    v_item_qty INT;
    v_unit_price DECIMAL(10, 2);
    v_item_total DECIMAL(10, 2);
    v_coupon RECORD;
    v_free_shipping_threshold DECIMAL(10, 2) := 600.00;
    v_inventory_id UUID;
    v_current_stock INT;
    v_new_stock INT;
    v_items_count INT;
BEGIN
    -- 1. Validate customer input
    IF TRIM(COALESCE(p_customer_name, '')) = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;
    IF LENGTH(TRIM(p_customer_name)) > 150 THEN
        RAISE EXCEPTION 'Customer name is too long (maximum 150 characters)';
    END IF;
    IF TRIM(COALESCE(p_customer_phone, '')) = '' THEN
        RAISE EXCEPTION 'Customer phone is required';
    END IF;
    IF LENGTH(TRIM(p_customer_phone)) > 30 THEN
        RAISE EXCEPTION 'Customer phone is invalid';
    END IF;
    IF TRIM(COALESCE(p_address, '')) = '' THEN
        RAISE EXCEPTION 'Delivery address is required';
    END IF;
    IF p_payment_method NOT IN ('cod', 'instapay', 'vodafone_cash', 'card') THEN
        RAISE EXCEPTION 'Invalid payment method: %', p_payment_method;
    END IF;

    -- 2. Validate items array
    v_items_count := jsonb_array_length(p_items);
    IF v_items_count = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;
    IF v_items_count > 50 THEN
        RAISE EXCEPTION 'Order contains too many distinct items (maximum 50)';
    END IF;

    -- Reject duplicate product/variant items in the same payload
    IF (
        SELECT COUNT(*)
        FROM (
            SELECT DISTINCT v->>'product_id', COALESCE(v->>'variant_id', '')
            FROM jsonb_array_elements(p_items) v
        ) sub
    ) != v_items_count THEN
        RAISE EXCEPTION 'Duplicate items detected in order payload. Please combine quantities for the same product.';
    END IF;

    -- 3. Fetch free shipping threshold from store settings
    SELECT free_shipping_threshold INTO v_free_shipping_threshold
    FROM public.store_settings WHERE id = 1;

    -- 4. Calculate subtotal & validate each item against database
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- 4a. STRICT QUANTITY VALIDATION
        -- Reject null, zero, negative, or excessive quantities
        BEGIN
            v_item_qty := (v_item->>'quantity')::INT;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'Invalid quantity format: must be a whole number';
        END;

        IF v_item_qty IS NULL OR v_item_qty < 1 THEN
            RAISE EXCEPTION 'Item quantity must be at least 1 (received %)', v_item->>'quantity';
        END IF;

        IF v_item_qty > 50 THEN
            RAISE EXCEPTION 'Item quantity exceeds maximum allowed per item (50 units)';
        END IF;

        -- 4b. VERIFY PRODUCT
        SELECT id, name_ar, name_en, price, is_active, in_stock, main_image 
        INTO v_product
        FROM public.products
        WHERE id = (v_item->>'product_id')::UUID;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % does not exist', v_item->>'product_id';
        END IF;

        IF v_product.is_active = false THEN
            RAISE EXCEPTION 'Ø§Ù„Ù…Ù†ØªØ¬ "%" ØºÙŠØ± Ù…ØªØ§Ø­ Ø­Ø§Ù„ÙŠØ§Ù‹ Ù„Ù„Ø·Ù„Ø¨', v_product.name_ar;
        END IF;

        IF v_product.in_stock = false THEN
            RAISE EXCEPTION 'Ø§Ù„Ù…Ù†ØªØ¬ "%" Ù†ÙØ¯ Ù…Ù† Ø§Ù„Ù…Ø®Ø²ÙˆÙ†', v_product.name_ar;
        END IF;

        v_unit_price := v_product.price;
        v_variant_id := NULL;

        -- 4c. VERIFY VARIANT (and ensure it belongs to this product)
        IF v_item->>'variant_id' IS NOT NULL AND TRIM(v_item->>'variant_id') != '' THEN
            v_variant_id := (v_item->>'variant_id')::UUID;

            SELECT id, product_id, name_ar, name_en, price_override, in_stock
            INTO v_variant
            FROM public.product_variants
            WHERE id = v_variant_id;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Specified product variant does not exist';
            END IF;

            -- Crucial: Ensure variant belongs to this product!
            IF v_variant.product_id != v_product.id THEN
                RAISE EXCEPTION 'Variant ID % does not belong to product "%"', v_variant_id, v_product.name_ar;
            END IF;

            IF v_variant.in_stock = false THEN
                RAISE EXCEPTION 'Ø§Ù„Ø¯Ø±Ø¬Ø©/Ø§Ù„Ù†ÙˆØ¹ "%" ØºÙŠØ± Ù…ØªÙˆÙØ±Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ ÙÙŠ Ø§Ù„Ù…Ø®Ø²ÙˆÙ†', v_variant.name_ar;
            END IF;

            IF v_variant.price_override IS NOT NULL THEN
                v_unit_price := v_variant.price_override;
            END IF;
        END IF;

        -- 4d. ROW LOCKING & CONCURRENCY-SAFE STOCK VALIDATION
        SELECT id, quantity INTO v_inventory_id, v_current_stock
        FROM public.inventory
        WHERE product_id = v_product.id
          AND (
            (v_variant_id IS NOT NULL AND variant_id = v_variant_id)
            OR (v_variant_id IS NULL AND variant_id IS NULL)
          )
        FOR UPDATE; -- Prevents concurrent overselling

        IF v_inventory_id IS NOT NULL THEN
            IF v_current_stock < v_item_qty THEN
                RAISE EXCEPTION 'Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ù…Ù† "%" ØºÙŠØ± Ù…ØªÙˆÙØ±Ø© (Ø§Ù„Ù…ØªÙˆÙØ± Ø­Ø§Ù„ÙŠØ§Ù‹: % Ù‚Ø·Ø¹Ø©)', v_product.name_ar, v_current_stock;
            END IF;
        END IF;

        v_item_total := v_unit_price * v_item_qty;
        v_subtotal := v_subtotal + v_item_total;
    END LOOP;

    -- 5. Validate coupon code if supplied
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) != '' THEN
        SELECT * INTO v_coupon
        FROM public.coupons
        WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
          AND is_active = true
          AND (expires_at IS NULL OR expires_at > NOW())
        FOR UPDATE; -- Lock coupon row to prevent usage limit race conditions

        IF FOUND THEN
            -- Check usage limit
            IF v_coupon.usage_limit IS NOT NULL AND v_coupon.times_used >= v_coupon.usage_limit THEN
                RAISE EXCEPTION 'ØªÙ… ØªØ¬Ø§ÙˆØ² Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ… Ù‡Ø°Ø§';
            END IF;

            -- Check minimum spend
            IF v_subtotal >= v_coupon.min_spend THEN
                v_discount_amount := ROUND((v_subtotal * v_coupon.discount_percent) / 100.0, 2);
                IF v_coupon.max_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.max_discount_amount THEN
                    v_discount_amount := v_coupon.max_discount_amount;
                END IF;

                -- Update coupon usage count
                UPDATE public.coupons
                SET times_used = times_used + 1, updated_at = NOW()
                WHERE id = v_coupon.id;
            ELSE
                RAISE EXCEPTION 'Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ù„ØªØ·Ø¨ÙŠÙ‚ Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¨ÙˆÙ† Ù‡Ùˆ % Ø¬.Ù…', v_coupon.min_spend;
            END IF;
        ELSE
            RAISE EXCEPTION 'ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ… ØºÙŠØ± ØµØ­ÙŠØ­ Ø£Ùˆ Ù…Ù†ØªÙ‡ÙŠ Ø§Ù„ØµÙ„Ø§Ø­ÙŠØ©';
        END IF;
    END IF;

    -- 6. Enforce free shipping threshold from trusted settings
    IF v_subtotal >= v_free_shipping_threshold THEN
        v_shipping_cost := 0.00;
    END IF;

    -- 7. Compute grand total
    v_total := GREATEST(0.00, v_subtotal - v_discount_amount + v_shipping_cost);

    -- 8. Generate unique order number (LU-YYMM-XXXX)
    v_order_number := 'LU-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(FLOOR(1000 + RANDOM() * 9000)::TEXT, 4, '0');

    -- 9. Insert into public.orders
    INSERT INTO public.orders (
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        governorate,
        governorate_name_ar,
        address,
        notes,
        payment_method,
        subtotal,
        discount_amount,
        shipping_cost,
        total,
        coupon_code,
        status,
        user_id
    ) VALUES (
        v_order_number,
        TRIM(p_customer_name),
        TRIM(p_customer_phone),
        TRIM(p_customer_email),
        p_governorate,
        p_governorate_name_ar,
        TRIM(p_address),
        p_notes,
        p_payment_method,
        v_subtotal,
        v_discount_amount,
        v_shipping_cost,
        v_total,
        p_coupon_code,
        'pending',
        auth.uid() -- Automatically links if customer is authenticated
    )
    RETURNING id INTO v_order_id;

    -- 10. Insert order items & deduct inventory atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_qty := (v_item->>'quantity')::INT;

        SELECT id, name_ar, name_en, price, main_image 
        INTO v_product
        FROM public.products
        WHERE id = (v_item->>'product_id')::UUID;

        v_unit_price := v_product.price;
        v_variant_id := NULL;

        IF v_item->>'variant_id' IS NOT NULL AND TRIM(v_item->>'variant_id') != '' THEN
            v_variant_id := (v_item->>'variant_id')::UUID;
            SELECT id, name_ar, name_en, price_override
            INTO v_variant
            FROM public.product_variants
            WHERE id = v_variant_id;

            IF FOUND AND v_variant.price_override IS NOT NULL THEN
                v_unit_price := v_variant.price_override;
            END IF;
        END IF;

        v_item_total := v_unit_price * v_item_qty;

        -- Insert order item
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name_ar,
            product_name_en,
            shade_name_ar,
            size_label,
            unit_price,
            quantity,
            total_price,
            image_url
        ) VALUES (
            v_order_id,
            v_product.id,
            v_variant_id,
            v_product.name_ar,
            v_product.name_en,
            v_item->>'shade_name_ar',
            v_item->>'size_label',
            v_unit_price,
            v_item_qty,
            v_item_total,
            v_product.main_image
        );

        -- Deduct inventory
        SELECT id, quantity INTO v_inventory_id, v_current_stock
        FROM public.inventory
        WHERE product_id = v_product.id
          AND (
            (v_variant_id IS NOT NULL AND variant_id = v_variant_id)
            OR (v_variant_id IS NULL AND variant_id IS NULL)
          );

        IF v_inventory_id IS NOT NULL THEN
            v_new_stock := v_current_stock - v_item_qty;
            
            UPDATE public.inventory
            SET quantity = v_new_stock, updated_at = NOW()
            WHERE id = v_inventory_id;

            -- Log movement audit trail
            INSERT INTO public.inventory_movements (
                product_id,
                variant_id,
                change_amount,
                previous_quantity,
                new_quantity,
                reason,
                reference_id,
                notes
            ) VALUES (
                v_product.id,
                v_variant_id,
                -(v_item_qty),
                v_current_stock,
                v_new_stock,
                'order',
                v_order_number,
                'Deducted automatically for order ' || v_order_number
            );
        END IF;
    END LOOP;

    -- 11. Return verified order details
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'discount_amount', v_discount_amount,
        'shipping_cost', v_shipping_cost,
        'total', v_total,
        'created_at', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Explicit Execution Permissions:
-- Revoke from PUBLIC, grant exclusively to anon and authenticated
REVOKE EXECUTE ON FUNCTION public.place_guest_order FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_guest_order TO anon, authenticated;


-- ==============================================================================
-- 04_seed.sql - Complete Initial Seed Data for Rosavelle Cosmetics (All 12 Products)
-- ==============================================================================

-- 1. STORE SETTINGS (Singleton)
INSERT INTO public.store_settings (
    id,
    store_name_ar,
    store_name_en,
    store_tagline_ar,
    store_tagline_en,
    whatsapp_number,
    instapay_account,
    vodafone_cash_number,
    free_shipping_threshold,
    announcement_ar,
    announcement_en,
    currency
) VALUES (
    1,
    'Ø±ÙˆØ²Ø§ÙÙŠÙ„ ÙƒÙˆØ²Ù…ØªÙƒØ³',
    'Rosavelle Cosmetics',
    'Ø³Ø­Ø± Ø§Ù„ÙˆØ±Ø¯ ÙˆØ§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„Ø¨Ø§Ø±ÙŠØ³ÙŠ Ø§Ù„ÙØ§Ø®Ø±',
    'Pure Rose Luxury & Radiant Beauty',
    '+201012345678',
    'rosavelle.cosmetics@instapay',
    '01012345678',
    600.00,
    'âœ¨ Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ Ù„Ø¬Ù…ÙŠØ¹ Ù…Ø­Ø§ÙØ¸Ø§Øª Ù…ØµØ± Ù„Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØªÙŠ ØªØ²ÙŠØ¯ Ø¹Ù† 600 Ø¬.Ù… + Ù‡Ø¯ÙŠØ© Ø­ØµØ±ÙŠØ© Ù…Ù† Ø±ÙˆØ²Ø§ÙÙŠÙ„ Ù…Ø¹ ÙƒÙ„ Ø·Ù„Ø¨! ÙƒÙˆØ¯ Ø§Ù„Ø®ØµÙ…: BEAUTY10',
    'âœ¨ Free express shipping on orders over 600 EGP + Free Rosavelle luxury gift with every order! Use code: BEAUTY10',
    'EGP'
) ON CONFLICT (id) DO UPDATE SET
    store_name_ar = EXCLUDED.store_name_ar,
    store_name_en = EXCLUDED.store_name_en,
    free_shipping_threshold = EXCLUDED.free_shipping_threshold;

-- 2. COUPONS
INSERT INTO public.coupons (code, discount_percent, min_spend, label_ar, label_en, is_active, usage_limit)
VALUES 
    ('BEAUTY10', 10, 300.00, 'Ø®ØµÙ… 10% Ø¹Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø£ÙƒØ«Ø± Ù…Ù† 300 Ø¬.Ù…', '10% off orders over 300 EGP', true, 5000),
    ('GLAM20', 20, 700.00, 'Ø®ØµÙ… 20% Ø¹Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø£ÙƒØ«Ø± Ù…Ù† 700 Ø¬.Ù…', '20% off orders over 700 EGP', true, 2000),
    ('WELCOME', 15, 200.00, 'Ø®ØµÙ… 15% ØªØ±Ø­ÙŠØ¨ÙŠ Ù„Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø£ÙˆÙ„', '15% off your first order', true, 10000)
ON CONFLICT (code) DO UPDATE SET
    discount_percent = EXCLUDED.discount_percent,
    min_spend = EXCLUDED.min_spend,
    is_active = EXCLUDED.is_active;

-- 3. CATEGORIES
INSERT INTO public.categories (id, slug, name_ar, name_en, icon, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'skincare', 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©', 'Skincare', 'Sparkles', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80', 1),
    ('11111111-1111-1111-1111-111111111102', 'makeup', 'Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„', 'Makeup', 'Heart', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80', 2),
    ('11111111-1111-1111-1111-111111111103', 'haircare', 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±', 'Haircare', 'Award', 'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=500&q=80', 3),
    ('11111111-1111-1111-1111-111111111104', 'fragrance', 'Ø§Ù„Ø¹Ø·ÙˆØ± ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„Ø¬Ø³Ù…', 'Fragrance & Body', 'Award', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80', 4)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    image_url = EXCLUDED.image_url;

-- 4. ALL 12 PRODUCTS
INSERT INTO public.products (
    id, slug, name_ar, name_en, brand, category_id, price, original_price, rating, reviews_count,
    main_image, gallery, in_stock, badge_ar, badge_en, badge_type,
    description_ar, description_en, ingredients_ar, how_to_use_ar, skin_type_ar, is_featured
) VALUES 
    (
        '22222222-2222-2222-2222-222222222201',
        'hyaluronic-acid-serum',
        'Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ Ø§Ù„Ù…Ø±ÙƒÙ‘Ø² Ù„Ù„ØªØ±Ø·ÙŠØ¨ Ø§Ù„ÙÙˆØ±ÙŠ',
        'Ultra Pure Hyaluronic Acid Hydrating Serum',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111101',
        390.00, 490.00, 4.9, 128,
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
        ],
        true, 'Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹', 'Bestseller', 'bestseller',
        'ØªØ±ÙƒÙŠØ¨Ø© ÙØ±Ù†Ø³ÙŠØ© Ù…ØªØ·ÙˆØ±Ø© ØªØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ø­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ Ø«Ù„Ø§Ø«ÙŠ Ø§Ù„Ø£ÙˆØ²Ø§Ù† Ø§Ù„Ø¬Ø²ÙŠØ¦ÙŠØ© Ù„Ø§Ø®ØªØ±Ø§Ù‚ Ø·Ø¨Ù‚Ø§Øª Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ø¹Ù…Ù‚ØŒ ÙŠÙ…Ù†Ø­Ùƒ Ø§Ù…ØªÙ„Ø§Ø¡Ù‹ ÙÙˆØ±ÙŠØ§Ù‹ ÙˆÙ†Ø¶Ø§Ø±Ø© ØªØ¯ÙˆÙ… 48 Ø³Ø§Ø¹Ø© ÙˆÙŠÙ‚Ù„Ù„ Ù…Ù† Ø§Ù„Ø®Ø·ÙˆØ· Ø§Ù„ØªØ¹Ø¨ÙŠØ±ÙŠØ©.',
        'Advanced French formula featuring triple molecular weight Hyaluronic Acid to penetrate deep skin layers, providing instant plumping and 48-hour hydration.',
        'Ø­Ù…Ø¶ Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ Ù†Ù‚ÙŠ 2%ØŒ ÙÙŠØªØ§Ù…ÙŠÙ† B5 (Ø¨Ø§Ù†Ø«ÙŠÙ†ÙˆÙ„)ØŒ Ù…Ø³ØªØ®Ù„Øµ Ø²Ù‡Ø±Ø© Ø§Ù„Ø¨Ø§Ø¨ÙˆÙ†Ø¬ Ø§Ù„Ø¹Ø¶ÙˆÙŠØŒ Ø¬Ù„ÙŠØ³Ø±ÙŠÙ† Ù†Ø¨Ø§ØªÙŠØŒ Ù…Ø§Ø¡ Ø§Ù„ÙˆØ±Ø¯ Ø§Ù„Ù†Ù‚ÙŠ.',
        'Ø¶Ø¹ÙŠ 3-4 Ù‚Ø·Ø±Ø§Øª ØµØ¨Ø§Ø­Ø§Ù‹ ÙˆÙ…Ø³Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ù†Ø¸ÙŠÙØ© ÙˆØ±Ø·Ø¨Ø© Ù‚Ù„ÙŠÙ„Ø§Ù‹ Ù‚Ø¨Ù„ ÙƒØ±ÙŠÙ… Ø§Ù„ØªØ±Ø·ÙŠØ¨. Ø±Ø¨ØªÙŠ Ø¨Ù„Ø·Ù Ø­ØªÙ‰ Ø§Ù„Ø§Ù…ØªØµØ§Øµ Ø§Ù„ØªØ§Ù….',
        'Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø© / Ø¬Ø§ÙØ© ÙˆØ­Ø³Ø§Ø³Ø©',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        'velvet-matte-lipstick',
        'Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡ Ù…Ø®Ù…Ù„ÙŠ Ù…Ø·ÙÙŠ - ÙÙŠÙ„ÙÙŠØª ÙƒÙŠØ³',
        'Velvet Matte Luxe Lipstick',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        280.00, 350.00, 4.8, 94,
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1599732434444-2f22b7a0f7e4?auto=format&fit=crop&w=800&q=80'
        ],
        true, 'ØªØ®ÙÙŠØ¶ 20%', '20% OFF', 'sale',
        'Ù„ÙˆÙ† ØºÙ†ÙŠ ÙˆÙ…ÙƒØ«Ù Ø¨Ù„Ù…Ø³Ø© Ù†Ù‡Ø§Ø¦ÙŠØ© Ù…Ø®Ù…Ù„ÙŠØ© Ù…Ø§Øª ØºÙŠØ± Ø¬Ø§ÙØ©. Ù…Ø¹Ø²Ø² Ø¨Ø²Ø¨Ø¯Ø© Ø§Ù„Ø´ÙŠØ§ ÙˆÙÙŠØªØ§Ù…ÙŠÙ† E Ù„ØªØ±Ø·ÙŠØ¨ Ø§Ù„Ø´ÙØ§Ù‡ ÙˆÙ…Ù†Ø¹ ØªØ´Ù‚Ù‚Ù‡Ø§ Ù…Ø¹ Ø«Ø¨Ø§Øª ÙŠØ¯ÙˆÙ… Ø­ØªÙ‰ 12 Ø³Ø§Ø¹Ø© Ø¯ÙˆÙ† ØªÙ„Ø·Ø®.',
        'Rich saturated color with a non-drying velvety matte finish. Infused with Shea butter and Vitamin E for 12-hour comfortable wear.',
        'Ø´Ù…Ø¹ Ø§Ù„Ù†Ø­Ù„ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØŒ Ø²Ø¨Ø¯Ø© Ø§Ù„Ø´ÙŠØ§ Ø§Ù„Ù†Ù‚ÙŠØ©ØŒ Ø²ÙŠØª Ø§Ù„Ø¬ÙˆØ¬ÙˆØ¨Ø§ØŒ ÙÙŠØªØ§Ù…ÙŠÙ† EØŒ Ø£ØµØ¨Ø§Øº Ù…Ø¹Ø¯Ù†ÙŠØ© Ø·Ø¨ÙŠØ¹ÙŠØ© ÙØ§Ø¦Ù‚Ø© Ø§Ù„Ù†Ù‚Ø§Ø¡.',
        'Ø§Ø¨Ø¯Ø¦ÙŠ Ø¨ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø´ÙØ§Ù‡ Ù…Ù† Ø§Ù„Ù…Ù†ØªØµÙ Ø«Ù… Ø§Ù…Ù„Ø¦ÙŠ Ø§Ù„Ø´ÙØªÙŠÙ† Ø¨Ø§Ù„ØªØ³Ø§ÙˆÙŠ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ ØªØºØ·ÙŠØ© Ù…Ø®Ù…Ù„ÙŠØ© Ø³Ø§Ø­Ø±Ø©.',
        'Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø´ÙØ§Ù‡',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222203',
        'radiance-boost-moisturizer',
        'ÙƒØ±ÙŠÙ… Ø§Ù„Ø¥Ø´Ø±Ø§Ù‚Ø© ÙˆØªØ¬Ø¯ÙŠØ¯ Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨ÙÙŠØªØ§Ù…ÙŠÙ† C',
        'Radiance Boost C-Glow Moisturizer',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        450.00, 560.00, 4.7, 76,
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø¥Ø´Ø±Ø§Ù‚Ø© ÙÙˆØ±ÙŠØ©', 'Glow Boost', 'trending',
        'ÙƒØ±ÙŠÙ… ØºÙ†ÙŠ Ø¨ÙÙŠØªØ§Ù…ÙŠÙ† C Ø§Ù„Ù…Ø³ØªÙ‚Ø± ÙˆØ§Ù„Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯ Ù„ØªÙˆØ­ÙŠØ¯ Ù„ÙˆÙ† Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„ØªØ®Ù„Øµ Ù…Ù† Ø§Ù„ØªØµØ¨ØºØ§Øª ÙˆØ§Ù„Ø¨Ù‚Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†Ø©.',
        'Infused with stabilized Vitamin C and Niacinamide to even skin tone, fade dark spots, and revive dull skin.',
        'ÙÙŠØªØ§Ù…ÙŠÙ† C 10%ØŒ Ù†ÙŠØ§Ø³ÙŠÙ†Ø§Ù…ÙŠØ¯ 4%ØŒ Ù…Ø³ØªØ®Ù„Øµ Ù‚Ø´Ø± Ø§Ù„Ø¨Ø±ØªÙ‚Ø§Ù„ Ø§Ù„Ø¹Ø¶ÙˆÙŠØŒ Ø­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ.',
        'ÙŠÙÙˆØ¶Ø¹ ØµØ¨Ø§Ø­Ø§Ù‹ Ø¨Ø¹Ø¯ Ø§Ù„Ø³ÙŠØ±ÙˆÙ… Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø© Ù…Ø¹ ØªØ¯Ù„ÙŠÙƒ ØªØµØ§Ø¹Ø¯ÙŠ Ø®ÙÙŠÙ.',
        'Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¨Ø§Ù‡ØªØ© ÙˆØ§Ù„Ù…ØªØµØ¨ØºØ©',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222204',
        'miss-lueur-perfume',
        'Ø¹Ø·Ø± Ù…ÙŠØ³ Ù„ÙˆØ±ÙŠÙ† - ÙØ§Ù†ÙŠÙ„Ø§ Ù…Ø³Ùƒ ÙØ§Ø®Ø± 100 Ù…Ù„',
        'Miss Lueur - Vanilla Musk Eau de Parfum',
        'Rosavelle Parfums',
        '11111111-1111-1111-1111-111111111104',
        850.00, 1100.00, 5.0, 153,
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø§Ù„Ø£Ø¹Ù„Ù‰ ØªÙ‚ÙŠÙŠÙ…Ø§Ù‹', 'Top Rated', 'bestseller',
        'ØªÙˆÙ„ÙŠÙØ© Ø³Ø§Ø­Ø±Ø© ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ù†ÙØ­Ø§Øª Ø§Ù„ÙØ§Ù†ÙŠÙ„ÙŠØ§ Ø§Ù„Ù…Ø¯ØºØ´Ù‚Ø±ÙŠØ© Ø§Ù„Ø¯Ø§ÙØ¦Ø© Ù…Ø¹ Ù„Ù…Ø³Ø§Øª Ù…Ù† Ø§Ù„Ù…Ø³Ùƒ Ø§Ù„Ø£Ø¨ÙŠØ¶ Ø§Ù„Ù†Ù‚ÙŠ ÙˆØ²Ù‡ÙˆØ± Ø§Ù„Ø£ÙˆØ±ÙƒÙŠØ¯ Ø§Ù„Ø¨Ø§Ø±ÙŠØ³ÙŠØ©.',
        'An enchanting composition blending warm Madagascan vanilla with pristine white musk and Parisian orchid.',
        'ÙƒØ­ÙˆÙ„ Ø¹Ø¶ÙˆÙŠ Ù†Ù‚ÙŠØŒ Ø²ÙŠÙˆØª Ø¹Ø·Ø±ÙŠØ© ÙØ±Ù†Ø³ÙŠØ©ØŒ Ø®Ù„Ø§ØµØ© Ø§Ù„ÙØ§Ù†ÙŠÙ„ÙŠØ§ ÙˆØ§Ù„Ù…Ø³Ùƒ ÙˆØ§Ù„ÙˆØ±Ø¯ Ø§Ù„Ø¬ÙˆØ±ÙŠ.',
        'ÙŠÙØ±Ø´ Ø¹Ù„Ù‰ Ù†Ù‚Ø§Ø· Ø§Ù„Ù†Ø¨Ø¶ (Ø§Ù„Ù…Ø¹ØµÙ…ÙŠÙ†ØŒ Ø®Ù„Ù Ø§Ù„Ø£Ø°Ù†ÙŠÙ†ØŒ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø©) Ù„Ø«Ø¨Ø§Øª ÙˆÙÙˆØ§Ø­Ø§Ù† ÙŠØ¯ÙˆÙ… Ø·ÙˆØ§Ù„ Ø§Ù„ÙŠÙˆÙ….',
        'Ù„Ø¬Ù…ÙŠØ¹ Ø¹Ø´Ø§Ù‚ Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ø´Ø±Ù‚ÙŠØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222205',
        'argan-hair-elixir',
        'Ø²ÙŠØª Ø§Ù„Ø£Ø±Ø¬Ø§Ù† Ø§Ù„Ù†Ù‚ÙŠ Ø§Ù„Ù…Ø±Ù…Ù… ÙˆØ§Ù„Ù…ÙƒØ«Ù Ù„Ø£Ø·Ø±Ø§Ù Ø§Ù„Ø´Ø¹Ø±',
        'Pure Moroccan Argan Hair Elixir',
        'Rosavelle Haircare',
        '11111111-1111-1111-1111-111111111103',
        340.00, 420.00, 4.8, 88,
        'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø·Ø¨ÙŠØ¹ÙŠ 100%', '100% Natural', 'bestseller',
        'Ø¥ÙƒØ³ÙŠØ± Ø¹Ù„Ø§Ø¬ÙŠ Ø³Ø­Ø±ÙŠ Ù„Ù„Ø´Ø¹Ø± Ø§Ù„ØªØ§Ù„Ù ÙˆØ§Ù„Ø¬Ø§ÙØŒ ÙŠÙ…Ù†Ø¹ Ø§Ù„Ù‡ÙŠØ´Ø§Ù† ÙÙˆØ±ÙŠØ§Ù‹ ÙˆÙŠØµÙ„Ø­ Ø§Ù„Ø£Ø·Ø±Ø§Ù Ø§Ù„Ù…ØªÙ‚ØµÙØ© ÙˆÙŠØ­Ù…ÙŠ Ø§Ù„Ø´Ø¹Ø± Ù…Ù† Ø­Ø±Ø§Ø±Ø© Ø§Ù„Ù…ÙƒÙˆØ§Ø©.',
        'Restorative hair elixir for frizzy and heat-damaged hair. Tames frizz instantly and repairs split ends.',
        'Ø²ÙŠØª Ø£Ø±Ø¬Ø§Ù† Ù…ØºØ±Ø¨ÙŠ Ù…Ø¹ØµÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø§Ø±Ø¯ØŒ Ø²ÙŠØª Ø¨Ø°ÙˆØ± Ø§Ù„ÙƒØ§Ù…ÙŠÙ„ÙŠØ§ØŒ ÙÙŠØªØ§Ù…ÙŠÙ† EØŒ Ø²ÙŠØª Ø¬ÙˆØ² Ø§Ù„Ù‡Ù†Ø¯.',
        'ÙˆØ²Ø¹ÙŠ Ù‚Ø·Ø±ØªÙŠÙ† Ø¥Ù„Ù‰ Ø«Ù„Ø§Ø« Ù‚Ø·Ø±Ø§Øª Ø¹Ù„Ù‰ Ø±Ø§Ø­Ø© Ø§Ù„ÙŠØ¯ÙŠÙ† Ø«Ù… Ù…Ø±Ø±ÙŠÙ‡Ø§ Ø¹Ù„Ù‰ Ø£Ø·Ø±Ø§Ù Ø§Ù„Ø´Ø¹Ø± Ø§Ù„Ø±Ø·Ø¨ Ø£Ùˆ Ø§Ù„Ø¬Ø§Ù.',
        'Ù„Ù„Ø´Ø¹Ø± Ø§Ù„Ø¬Ø§Ù ÙˆØ§Ù„ØªØ§Ù„Ù ÙˆØ§Ù„Ù…Ø¹Ø§Ù„Ø¬ Ø¨Ø§Ù„ØµØ¨ØºØ©',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222206',
        'royal-lash-mascara',
        'Ù…Ø§Ø³ÙƒØ§Ø±Ø§ Ø§Ù„Ø±Ù…ÙˆØ´ Ø§Ù„Ù…Ù„ÙƒÙŠØ© Ù„ØªÙƒØ«ÙŠÙ ÙˆØªØ·ÙˆÙŠÙ„ Ù…Ø¶Ø§Ø¹Ù',
        'Royal Lash Supreme Volumizing Mascara',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        240.00, 310.00, 4.9, 110,
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'],
        true, 'Ù…Ù‚Ø§ÙˆÙ…Ø© Ù„Ù„Ù…Ø§Ø¡', 'Waterproof', 'trending',
        'ÙØ±Ø´Ø§Ø© Ø³ÙŠÙ„ÙŠÙƒÙˆÙ† Ø­Ù„Ø²ÙˆÙ†ÙŠØ© Ù…Ø¨ØªÙƒØ±Ø© ØªØºÙ„Ù ÙƒÙ„ Ø±Ù…Ø´ Ù…Ù† Ø§Ù„Ø¬Ø°ÙˆØ± Ø­ØªÙ‰ Ø§Ù„Ø£Ø·Ø±Ø§Ù Ù„Ù…Ù†Ø­Ùƒ Ø±Ù…ÙˆØ´Ø§Ù‹ ÙƒØ«ÙŠÙØ© ÙˆØ·ÙˆÙŠÙ„Ø©.',
        'Innovative spiral silicone brush coats every single lash from root to tip, delivering dramatic volume.',
        'Ø´Ù…Ø¹ Ø§Ù„ÙƒØ§Ø±Ù†ÙˆØ¨Ø§ØŒ ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† Ù†Ø¨Ø§ØªÙŠØŒ Ø²ÙŠØª Ø§Ù„Ø®Ø±ÙˆØ¹ Ù„ØªÙ‚ÙˆÙŠØ© Ø§Ù„Ø±Ù…ÙˆØ´ØŒ Ø£ØµØ¨Ø§Øº Ø³ÙˆØ¯Ø§Ø¡ ÙƒØ±Ø¨ÙˆÙ†ÙŠØ©.',
        'Ù…Ø±Ø±ÙŠ Ø§Ù„ÙØ±Ø´Ø§Ø© Ø¨Ø­Ø±ÙƒØ© Ø²Ø¬Ø²Ø§Ø¬ÙŠØ© Ù…Ù† Ù…Ù†Ø¨Øª Ø§Ù„Ø±Ù…ÙˆØ´ Ø¨Ø§ØªØ¬Ø§Ù‡ Ø§Ù„Ø£Ø¹Ù„Ù‰.',
        'Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„Ø¹ÙŠÙˆÙ† Ø§Ù„Ø­Ø³Ø§Ø³Ø© ÙˆÙ…Ø³ØªØ®Ø¯Ù…ÙŠ Ø§Ù„Ø¹Ø¯Ø³Ø§Øª',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222207',
        'velvet-touch-sunscreen',
        'ÙˆØ§Ù‚ÙŠ Ø§Ù„Ø´Ù…Ø³ Ø§Ù„Ù…Ø®Ù…Ù„ÙŠ ØºÙŠØ± Ø§Ù„Ù„Ø§Ù…Ø¹ SPF 50+',
        'Invisible Velvet Touch Sunscreen SPF 50+',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        360.00, 450.00, 4.8, 97,
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø­Ù…Ø§ÙŠØ© Ù‚ØµÙˆÙ‰', 'SPF 50+', 'sale',
        'Ø¬Ù„ ÙƒØ±ÙŠÙ…ÙŠ Ø´ÙØ§Ù Ø®ÙÙŠÙ Ø§Ù„ÙˆØ²Ù† Ø³Ø±ÙŠØ¹ Ø§Ù„Ø§Ù…ØªØµØ§ØµØŒ Ù„Ø§ ÙŠØªØ±Ùƒ Ø£ÙŠ Ø£Ø«Ø± Ø£Ø¨ÙŠØ¶ Ø£Ùˆ Ù…Ù„Ù…Ø³ Ø¯Ù‡Ù†ÙŠØŒ ÙˆÙŠØ´ÙƒÙ„ Ø¯Ø±Ø¹Ø§Ù‹ ÙˆØ§Ù‚ÙŠØ§Ù‹ Ù…Ù† Ø§Ù„Ø£Ø´Ø¹Ø© ÙÙˆÙ‚ Ø§Ù„Ø¨Ù†ÙØ³Ø¬ÙŠØ©.',
        'Ultra-lightweight invisible gel cream with zero white cast. Controls shine, hydrates, and protects against UV rays.',
        'ÙÙ„Ø§ØªØ± Ø­Ù…Ø§ÙŠØ© Ø´Ù…Ø³ÙŠØ© Ù…ØªØ·ÙˆØ±Ø©ØŒ Ù…Ø³ØªØ®Ù„Øµ Ø§Ù„Ø´Ø§ÙŠ Ø§Ù„Ø£Ø®Ø¶Ø± Ø§Ù„Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø£ÙƒØ³Ø¯Ø©ØŒ Ø³ÙŠÙ†ØªÙŠÙ„Ø§ Ø£Ø³ÙŠØ§ØªÙŠÙƒØ§ (Ø³ÙŠÙƒØ§).',
        'ÙŠÙˆØ¶Ø¹ Ø¨Ø³Ø®Ø§Ø¡ Ø¹Ù„Ù‰ ÙƒØ§Ù…Ù„ Ø§Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø© Ù‚Ø¨Ù„ Ø§Ù„ØªØ¹Ø±Ø¶ Ù„Ù„Ø´Ù…Ø³ Ø¨Ù€ 15 Ø¯Ù‚ÙŠÙ‚Ø©.',
        'Ù…Ø«Ø§Ù„ÙŠ Ù„Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø¯Ù‡Ù†ÙŠØ© ÙˆØ§Ù„Ù…Ø®ØªÙ„Ø·Ø© ÙˆØ§Ù„Ù…Ø¹Ø±Ø¶Ø© Ù„Ù„Ø­Ø¨ÙˆØ¨',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222208',
        'silk-radiant-foundation',
        'ÙƒØ±ÙŠÙ… Ø£Ø³Ø§Ø³ Ø³Ø§Ø¦Ù„ Ø­Ø±ÙŠØ±ÙŠ Ø¨ØªØºØ·ÙŠØ© Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„Ø¨Ù†Ø§Ø¡',
        'Silk Radiant Flawless Liquid Foundation',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        420.00, 530.00, 4.7, 65,
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
        true, 'ØªØºØ·ÙŠØ© ØªØ¯ÙˆÙ… 24h', '24H Wear', 'bestseller',
        'ÙØ§ÙˆÙ†Ø¯ÙŠØ´Ù† Ù…Ø¨ØªÙƒØ± Ø¨ØªØºØ·ÙŠØ© Ù…ØªÙˆØ³Ø·Ø© Ø¥Ù„Ù‰ ÙƒØ§Ù…Ù„Ø© ÙŠÙ†Ø³Ø§Ø¨ ÙƒØ§Ù„Ø­Ø±ÙŠØ± Ù„ÙŠØ®ÙÙŠ Ø§Ù„Ù…Ø³Ø§Ù… ÙˆØ§Ù„Ø¹ÙŠÙˆØ¨ ØªÙ…Ø§Ù…Ø§Ù‹ Ù…Ø¹ Ù„Ù…Ø³Ø© Ù†Ù‡Ø§Ø¦ÙŠØ© Ø·Ø¨ÙŠØ¹ÙŠØ© ÙˆÙ…Ø´Ø±Ù‚Ø©.',
        'Breathable buildable foundation that blurs imperfections, evens tone, and gives a second-skin satin finish.',
        'Ù…Ø³ØªØ®Ù„Øµ Ø­Ø±ÙŠØ± Ø·Ø¨ÙŠØ¹ÙŠØŒ Ø¨Ø¨ØªÙŠØ¯Ø§Øª Ù…ÙƒØ§ÙØ­Ø© Ù„Ù„Ø´ÙŠØ®ÙˆØ®Ø©ØŒ Ø­Ù…Ø¶ Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒØŒ ÙÙŠØªØ§Ù…ÙŠÙ† E.',
        'Ø±Ø¬ÙŠ Ø§Ù„Ø¹Ø¨ÙˆØ© Ø¬ÙŠØ¯Ø§Ù‹ Ø«Ù… ÙˆØ²Ø¹ÙŠÙ‡Ø§ Ø¨ÙˆØ§Ø³Ø·Ø© Ø¥Ø³ÙÙ†Ø¬Ø© Ù…Ø¨Ù„Ù„Ø© Ø£Ùˆ ÙØ±Ø´Ø§Ø© Ø£Ø³Ø§Ø³.',
        'Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø©',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222209',
        'rose-gold-collagen-mask',
        'Ù…Ø§Ø³Ùƒ Ø§Ù„ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† ÙˆØ§Ù„Ø°Ù‡Ø¨ Ø§Ù„ÙˆØ±Ø¯ÙŠ Ù„Ù„ØªØ±Ø·ÙŠØ¨ Ø§Ù„Ù…ÙƒØ«Ù',
        'Rose Gold Collagen Hydrogel Face Mask',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        190.00, 240.00, 4.9, 84,
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø¬Ù„Ø³Ø© Ø³Ø¨Ø§ Ù…Ù†Ø²Ù„ÙŠØ©', 'Spa Experience', 'trending',
        'Ù…Ø§Ø³Ùƒ Ù‡ÙŠØ¯Ø±ÙˆØ¬ÙŠÙ„ ØºÙ†ÙŠ Ø¨Ø°Ù‡Ø¨ Ø¹ÙŠØ§Ø± 24 Ø¬Ø²ÙŠØ¦ÙŠ ÙˆØ§Ù„ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† Ø§Ù„Ø¨Ø­Ø±ÙŠ Ù„ØªØºØ°ÙŠØ© Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ´Ø¯ Ø§Ù„ØªØ±Ù‡Ù„Ø§Øª ÙˆÙ…Ù†Ø­Ùƒ Ù…Ø¸Ù‡Ø±Ø§Ù‹ Ø²Ø¬Ø§Ø¬ÙŠØ§Ù‹ Ù„Ø§Ù…Ø¹Ø§Ù‹.',
        'Hydrogel treatment infused with 24K nano-gold and marine collagen to firm, plump, and deeply hydrate.',
        'ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† Ø¨Ø­Ø±ÙŠ Ù…ØªØ­Ù„Ù„ØŒ Ø¬Ø²ÙŠØ¦Ø§Øª Ø§Ù„Ø°Ù‡Ø¨ Ø§Ù„Ø®Ø§Ù„ØµØŒ Ø®Ù„Ø§ØµØ© Ø§Ù„ÙˆØ±Ø¯ Ø§Ù„Ø¬ÙˆØ±ÙŠØŒ Ù…Ø³ØªØ®Ù„Øµ Ø¨Ø°ÙˆØ± Ø§Ù„Ø¹Ù†Ø¨.',
        'Ø¶Ø¹ÙŠ Ø§Ù„Ù…Ø§Ø³Ùƒ Ø¹Ù„Ù‰ ÙˆØ¬Ù‡ Ù†Ø¸ÙŠÙ Ù„Ù…Ø¯Ø© 20-30 Ø¯Ù‚ÙŠÙ‚Ø©.',
        'Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø©ØŒ Ø®Ø§ØµØ© Ø§Ù„Ù…ØªØ¹Ø¨Ø© ÙˆØ§Ù„Ø¬Ø§ÙØ©',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222210',
        'coffee-almond-body-polish',
        'Ù…Ù‚Ø´Ø± Ø§Ù„Ù‚Ù‡ÙˆØ© ÙˆØ²ÙŠØª Ø§Ù„Ù„ÙˆØ² Ù„ØªÙ‚Ø´ÙŠØ± ÙˆØªÙ†Ø¹ÙŠÙ… Ø§Ù„Ø¬Ø³Ù…',
        'Arabica Coffee & Sweet Almond Body Polish',
        'Rosavelle Bodycare',
        '11111111-1111-1111-1111-111111111104',
        310.00, 380.00, 4.8, 71,
        'https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80'],
        true, 'ØªÙ†Ø¹ÙŠÙ… ÙØ§Ø¦Ù‚', 'Ultra Soft', 'sale',
        'Ù…Ù‚Ø´Ø± Ø¹Ø¶ÙˆÙŠ ÙØ§Ø®Ø± Ø¨Ø­Ø¨ÙŠØ¨Ø§Øª Ø¨Ù† Ø£Ø±Ø§Ø¨ÙŠÙƒØ§ Ø§Ù„Ù…Ø·Ø­ÙˆÙ† ÙˆØ²ÙŠØª Ø§Ù„Ù„ÙˆØ² Ø§Ù„Ø­Ù„Ùˆ ÙˆØ²Ø¨Ø¯Ø© Ø§Ù„Ø´ÙŠØ§ØŒ ÙŠØ²ÙŠÙ„ Ø§Ù„Ø¬Ù„Ø¯ Ø§Ù„Ù…ÙŠØª ÙˆÙŠØ­Ø³Ù† Ù…Ø¸Ù‡Ø± Ø§Ù„Ø³ÙŠÙ„ÙˆÙ„ÙŠØª.',
        'Exfoliating body scrub packed with roasted Arabica coffee grounds and sweet almond oil.',
        'Ø­Ø¨ÙˆØ¨ Ù‚Ù‡ÙˆØ© Ø£Ø±Ø§Ø¨ÙŠÙƒØ§ØŒ Ø³ÙƒØ± Ù‚ØµØ¨ Ø¹Ø¶ÙˆÙŠØŒ Ø²ÙŠØª Ø§Ù„Ù„ÙˆØ² Ø§Ù„Ø­Ù„ÙˆØŒ Ù…Ù„Ø­ Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ù…ÙŠØª.',
        'Ø¯Ù„ÙƒÙŠ Ø¨Ø­Ø±ÙƒØ§Øª Ø¯Ø§Ø¦Ø±ÙŠØ© Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ù…Ø¨Ù„Ù„Ø© Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø§Ø³ØªØ­Ù…Ø§Ù… Ù…Ø¹ Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„Ø¬Ø§ÙØ©.',
        'Ù„ÙƒØ§ÙØ© Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¬Ø³Ù…',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222211',
        'pro-artist-brush-set',
        'Ù…Ø¬Ù…ÙˆØ¹Ø© ÙØ±Ø´ Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ Ø§Ù„Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© (12 Ù‚Ø·Ø¹Ø©)',
        'Pro Artist Luxury 12-Piece Brush Collection',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        590.00, 750.00, 4.9, 112,
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø´Ø§Ù…Ù„ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø© Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©', 'Includes Leather Pouch', 'bestseller',
        'Ø·Ù‚Ù… Ù…ØªÙƒØ§Ù…Ù„ Ù…ÙƒÙˆÙ† Ù…Ù† 12 ÙØ±Ø´Ø§Ø© Ù…ØµÙ†ÙˆØ¹Ø© Ù…Ù† Ø£Ù„ÙŠØ§Ù ØµÙ†Ø§Ø¹ÙŠØ© Ù†Ø§Ø¹Ù…Ø© ÙƒØ§Ù„Ø­Ø±ÙŠØ± ÙˆÙ…Ù‚Ø§ÙˆÙ…Ø© Ù„ØªØ³Ø§Ù‚Ø· Ø§Ù„Ø´Ø¹Ø± Ù…Ø¹ Ù…Ù‚Ø§Ø¨Ø¶ Ø¨Ù„ÙˆÙ† Ø§Ù„Ø°Ù‡Ø¨ Ø§Ù„ÙˆØ±Ø¯ÙŠ.',
        'Complete 12-piece ultra-soft synthetic brush set with rose gold ferrules and a chic travel case.',
        'Ø´Ø¹Ø± ØµÙ†Ø§Ø¹ÙŠ Ù†Ø§Ø¹Ù… Ù†Ø¨Ø§ØªÙŠ 100% (Cruelty-Free)ØŒ Ù…Ù‚Ø§Ø¨Ø¶ Ø®Ø´Ø¨ÙŠØ© Ù…ØµÙ‚ÙˆÙ„Ø©ØŒ Ø£Ù„ÙˆÙ…Ù†ÙŠÙˆÙ… Ø±ÙˆØ² Ø¬ÙˆÙ„Ø¯.',
        'ÙØ±Ø´ Ù…ØªØ®ØµØµØ© Ù„Ù„Ø¯Ù…Ø¬ØŒ ÙƒØ±ÙŠÙ… Ø§Ù„Ø£Ø³Ø§Ø³ØŒ Ø§Ù„Ø¨Ù„Ø§Ø´Ø±ØŒ Ø§Ù„ÙƒÙˆÙ†ØªÙˆØ±ØŒ ÙˆØ±Ø³Ù… Ø§Ù„Ø­ÙˆØ§Ø¬Ø¨ ÙˆØ§Ù„Ø¹ÙŠÙˆÙ†.',
        'Ù…Ø«Ø§Ù„ÙŠØ© Ù„Ù„Ù…Ø¨ØªØ¯Ø¦Ø§Øª ÙˆØ§Ù„Ù…Ø­ØªØ±ÙØ§Øª',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222212',
        'argan-shea-hair-mask',
        'Ù…Ø§Ø³Ùƒ Ø§Ù„Ø£Ø±Ø¬Ø§Ù† ÙˆØ§Ù„Ø´ÙŠØ§ Ù„Ù„ØªØ±Ø·ÙŠØ¨ Ø§Ù„Ø¹Ù…ÙŠÙ‚ Ù„Ù„Ø´Ø¹Ø± Ø§Ù„ØªØ§Ù„Ù',
        'Deep Moisture Argan & Shea Hair Mask',
        'Rosavelle Haircare',
        '11111111-1111-1111-1111-111111111103',
        380.00, 470.00, 4.8, 63,
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'],
        true, 'Ø¹Ù„Ø§Ø¬ Ù…ÙƒØ«Ù', 'Intensive Repair', 'sale',
        'Ø¹Ù„Ø§Ø¬ Ø­Ù…Ø§Ù… ÙƒØ±ÙŠÙ… ÙØ§Ø¦Ù‚ Ø§Ù„Ù‚ÙˆØ© ÙŠØ¹ÙŠØ¯ Ø¨Ù†Ø§Ø¡ Ø£Ù„ÙŠØ§Ù Ø§Ù„Ø´Ø¹Ø± Ø§Ù„Ø¶Ø¹ÙŠÙØ© ÙˆÙŠÙ…Ù†Ø­Ù‡Ø§ Ù…Ø±ÙˆÙ†Ø© ÙˆÙ„Ù…Ø¹Ø§Ù†Ø§Ù‹ Ù„Ø§ ÙŠÙ‚Ø§ÙˆÙ… Ø¨Ø¯ÙˆÙ† Ø³ÙŠÙ„ÙŠÙƒÙˆÙ† Ø£Ùˆ Ø¨Ø§Ø±Ø§Ø¨ÙŠÙ† Ø¶Ø§Ø±.',
        'Intensive hair butter mask formulated to repair compromised fibers and deliver touchable softness and shine.',
        'Ø²ÙŠØª Ø£Ø±Ø¬Ø§Ù† Ø¹Ø¶ÙˆÙŠØŒ Ø²Ø¨Ø¯Ø© Ø§Ù„Ø´ÙŠØ§ Ø§Ù„Ø¥ÙØ±ÙŠÙ‚ÙŠØ© Ø§Ù„Ø®Ø§Ù…ØŒ Ø¨Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù‚Ù…Ø­ØŒ ÙƒÙŠØ±Ø§ØªÙŠÙ† Ù†Ø¨Ø§ØªÙŠØŒ Ø²ÙŠØª Ø¬ÙˆØ² Ø§Ù„Ù‡Ù†Ø¯.',
        'Ø¨Ø¹Ø¯ ØºØ³Ù„ Ø§Ù„Ø´Ø¹Ø± Ø¨Ø§Ù„Ø´Ø§Ù…Ø¨ÙˆØŒ ÙˆØ²Ø¹ÙŠ ÙƒÙ…ÙŠØ© ÙƒØ§ÙÙŠØ© Ù…Ù† Ù…Ù†ØªØµÙ Ø§Ù„Ø´Ø¹Ø± Ø­ØªÙ‰ Ø§Ù„Ø£Ø·Ø±Ø§ÙØŒ Ø§ØªØ±ÙƒÙŠÙ‡ Ù„Ù…Ø¯Ø© 10 Ø¯Ù‚Ø§Ø¦Ù‚ Ø«Ù… Ø§Ø´Ø·ÙÙŠ Ø¬ÙŠØ¯Ø§Ù‹.',
        'Ù„Ù„Ø´Ø¹Ø± Ø§Ù„Ø¬Ø§Ù ÙˆØ§Ù„ØªØ§Ù„Ù ÙˆØ§Ù„Ù…Ø¬Ø¹Ø¯',
        false
    )
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    main_image = EXCLUDED.main_image,
    in_stock = EXCLUDED.in_stock,
    is_featured = EXCLUDED.is_featured;

-- 5. PRODUCT VARIANTS (Lipstick & Foundation Shades)
INSERT INTO public.product_variants (id, product_id, variant_type, name_ar, name_en, color_hex, display_order)
VALUES 
    -- Lipstick shades (p2)
    ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 'shade', 'Ø±ÙˆØ² ÙƒÙ„Ø§Ø³ÙŠÙƒ', 'Classic Rose', '#C46B72', 1),
    ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'shade', 'Ù†ÙˆØ¯ Ø¯Ø§ÙØ¦', 'Warm Nude', '#B87A68', 2),
    ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 'shade', 'Ø±ÙŠØ¯ ÙÙŠÙ„ÙÙŠØª', 'Red Velvet', '#941B26', 3),
    ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'shade', 'Ø¨ÙŠØ±ÙŠ ØºØ§Ù…Ù‚', 'Deep Berry', '#5C1D2C', 4),
    -- Foundation shades (p8)
    ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222208', 'shade', '01 Ø¨ÙˆØ±Ø³Ù„ÙŠÙ† ÙØ§ØªØ­', '01 Light Porcelain', '#F7E1D7', 1),
    ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222208', 'shade', '02 Ø¨ÙŠØ¬ Ø·Ø¨ÙŠØ¹ÙŠ', '02 Natural Beige', '#E8C8B5', 2),
    ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222208', 'shade', '03 Ø­Ù†Ø·ÙŠ Ø°Ù‡Ø¨ÙŠ', '03 Warm Honey', '#D6A785', 3),
    ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222208', 'shade', '04 ÙƒØ±Ø§Ù…ÙŠÙ„ ØºÙ†ÙŠ', '04 Rich Caramel', '#B87F56', 4)
ON CONFLICT (id) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    color_hex = EXCLUDED.color_hex;

-- 6. INVENTORY INITIALIZATION
INSERT INTO public.inventory (product_id, variant_id, quantity, low_stock_threshold)
VALUES 
    -- Product-level inventory
    ('22222222-2222-2222-2222-222222222201', NULL, 35, 5),
    ('22222222-2222-2222-2222-222222222203', NULL, 25, 5),
    ('22222222-2222-2222-2222-222222222204', NULL, 18, 3),
    ('22222222-2222-2222-2222-222222222205', NULL, 22, 5),
    ('22222222-2222-2222-2222-222222222206', NULL, 27, 5),
    ('22222222-2222-2222-2222-222222222207', NULL, 16, 5),
    ('22222222-2222-2222-2222-222222222209', NULL, 45, 10),
    ('22222222-2222-2222-2222-222222222210', NULL, 15, 5),
    ('22222222-2222-2222-2222-222222222211', NULL, 11, 3),
    ('22222222-2222-2222-2222-222222222212', NULL, 17, 5),
    -- Variant-level inventory for Lipstick (p2)
    ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333301', 10, 3),
    ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302', 12, 3),
    ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333303', 8, 3),
    ('22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333304', 10, 3),
    -- Variant-level inventory for Foundation (p8)
    ('22222222-2222-2222-2222-222222222208', '33333333-3333-3333-3333-333333333305', 5, 2),
    ('22222222-2222-2222-2222-222222222208', '33333333-3333-3333-3333-333333333306', 6, 2),
    ('22222222-2222-2222-2222-222222222208', '33333333-3333-3333-3333-333333333307', 4, 2),
    ('22222222-2222-2222-2222-222222222208', '33333333-3333-3333-3333-333333333308', 4, 2)
ON CONFLICT (product_id, variant_id) DO UPDATE SET
    quantity = EXCLUDED.quantity;


-- ==============================================================================
-- 05_storage.sql - Supabase Storage Bucket & Security Policies
-- ==============================================================================

-- 1. Create product-images bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
) ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880;

-- 2. Storage Policies

-- Anyone can view product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Admins can upload product images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
);

-- Admins can update product images
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
);

-- Admins can delete product images
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
);

-- ------------------------------------------------------------------------------
-- 3. ROLE PRIVILEGES & TABLE GRANTS (PostgREST API Access)
-- ------------------------------------------------------------------------------
-- Ensure schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Anonymous users (Guests / Visitors): Read-only access governed by RLS
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Authenticated users (Customers & Admins): Table-level access, strictly filtered by RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;

-- Service role: Full maintenance access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;



