-- ==============================================================================
-- ROSAVELLE COSMETICS - COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Run this script in your Supabase SQL Editor to set up everything in one step.
-- ==============================================================================

-- ==============================================================================
-- 01_schema.sql - Normalized PostgreSQL Schema for Rosavelle Cosmetics
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to handle updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
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


-- ==============================================================================
-- 02_security_and_rls.sql - Row Level Security (RLS) Policies
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
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view and manage all profiles
CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to invoke profile creation on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active categories
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true OR public.is_admin());

-- Admins can manage categories
CREATE POLICY "Admins have full access to categories"
ON public.categories FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active products
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true OR public.is_admin());

-- Admins can manage products
CREATE POLICY "Admins have full access to products"
ON public.products FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. PRODUCT_VARIANTS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view product variants
CREATE POLICY "Public can view product variants"
ON public.product_variants FOR SELECT
USING (true);

-- Admins can manage product variants
CREATE POLICY "Admins have full access to product variants"
ON public.product_variants FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. INVENTORY POLICIES
-- ------------------------------------------------------------------------------
-- Public can check inventory quantity (read-only)
CREATE POLICY "Public can read inventory"
ON public.inventory FOR SELECT
USING (true);

-- Admins can manage inventory
CREATE POLICY "Admins have full access to inventory"
ON public.inventory FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. STORE_SETTINGS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view store settings
CREATE POLICY "Public can view store settings"
ON public.store_settings FOR SELECT
USING (true);

-- Admins can update store settings
CREATE POLICY "Admins can update store settings"
ON public.store_settings FOR UPDATE
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. COUPONS POLICIES
-- ------------------------------------------------------------------------------
-- Public can check active, non-expired coupons
CREATE POLICY "Public can view active coupons"
ON public.coupons FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Admins can manage coupons
CREATE POLICY "Admins have full access to coupons"
ON public.coupons FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. ORDERS POLICIES
-- ------------------------------------------------------------------------------
-- Public/Guest can insert an order
CREATE POLICY "Anyone can create an order"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.is_admin()
);

-- Admins have full access to orders
CREATE POLICY "Admins have full access to orders"
ON public.orders FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. ORDER_ITEMS POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can insert order items when placing an order
CREATE POLICY "Anyone can create order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Users can view their own order items
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
CREATE POLICY "Admins have full access to order items"
ON public.order_items FOR ALL
USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. INVENTORY_MOVEMENTS POLICIES
-- ------------------------------------------------------------------------------
-- Only admins can view or manage inventory movements
CREATE POLICY "Admins only access to inventory movements"
ON public.inventory_movements FOR ALL
USING (public.is_admin());


-- ==============================================================================
-- 03_functions.sql - Secure Business Logic & Atomic RPC Functions
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
    p_items JSONB, -- Array of { product_id, variant_id, quantity, size_label }
    p_coupon_code TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_subtotal DECIMAL(10, 2) := 0.00;
    v_discount_amount DECIMAL(10, 2) := 0.00;
    v_shipping_cost DECIMAL(10, 2) := COALESCE(p_shipping_cost, 0.00);
    v_total DECIMAL(10, 2) := 0.00;
    v_item JSONB;
    v_product RECORD;
    v_variant RECORD;
    v_unit_price DECIMAL(10, 2);
    v_item_total DECIMAL(10, 2);
    v_coupon RECORD;
    v_free_shipping_threshold DECIMAL(10, 2) := 600.00;
    v_current_stock INT;
    v_new_stock INT;
BEGIN
    -- 1. Validate customer input
    IF TRIM(COALESCE(p_customer_name, '')) = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;
    IF TRIM(COALESCE(p_customer_phone, '')) = '' THEN
        RAISE EXCEPTION 'Customer phone is required';
    END IF;
    IF TRIM(COALESCE(p_address, '')) = '' THEN
        RAISE EXCEPTION 'Delivery address is required';
    END IF;
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- 2. Fetch free shipping threshold from store settings
    SELECT free_shipping_threshold INTO v_free_shipping_threshold
    FROM public.store_settings WHERE id = 1;

    -- 3. Calculate subtotal using trusted database prices
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Verify product exists and is active
        SELECT id, name_ar, name_en, price, is_active, main_image 
        INTO v_product
        FROM public.products
        WHERE id = (v_item->>'product_id')::UUID;

        IF NOT FOUND OR v_product.is_active = false THEN
            RAISE EXCEPTION 'Product with ID % is unavailable or discontinued', v_item->>'product_id';
        END IF;

        v_unit_price := v_product.price;

        -- Check variant if provided
        IF v_item->>'variant_id' IS NOT NULL AND (v_item->>'variant_id') != '' THEN
            SELECT id, name_ar, name_en, price_override
            INTO v_variant
            FROM public.product_variants
            WHERE id = (v_item->>'variant_id')::UUID AND product_id = v_product.id;

            IF FOUND AND v_variant.price_override IS NOT NULL THEN
                v_unit_price := v_variant.price_override;
            END IF;
        END IF;

        v_item_total := v_unit_price * (v_item->>'quantity')::INT;
        v_subtotal := v_subtotal + v_item_total;
    END LOOP;

    -- 4. Validate coupon code if supplied
    IF p_coupon_code IS NOT NULL AND TRIM(p_coupon_code) != '' THEN
        SELECT * INTO v_coupon
        FROM public.coupons
        WHERE UPPER(code) = UPPER(TRIM(p_coupon_code))
          AND is_active = true
          AND (expires_at IS NULL OR expires_at > NOW());

        IF FOUND THEN
            IF v_subtotal >= v_coupon.min_spend THEN
                v_discount_amount := ROUND((v_subtotal * v_coupon.discount_percent) / 100.0, 2);
                IF v_coupon.max_discount_amount IS NOT NULL AND v_discount_amount > v_coupon.max_discount_amount THEN
                    v_discount_amount := v_coupon.max_discount_amount;
                END IF;

                -- Update coupon usage
                UPDATE public.coupons
                SET times_used = times_used + 1
                WHERE id = v_coupon.id;
            END IF;
        END IF;
    END IF;

    -- 5. Calculate free shipping threshold
    IF v_subtotal >= v_free_shipping_threshold THEN
        v_shipping_cost := 0.00;
    END IF;

    -- 6. Compute grand total
    v_total := GREATEST(0.00, v_subtotal - v_discount_amount + v_shipping_cost);

    -- 7. Generate order number (LU-XXXXX)
    v_order_number := 'LU-' || FLOOR(10000 + RANDOM() * 90000)::TEXT;

    -- 8. Insert into public.orders
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
        auth.uid() -- Automatically associates if user is authenticated
    )
    RETURNING id INTO v_order_id;

    -- 9. Insert order items & update inventory
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT id, name_ar, name_en, price, main_image 
        INTO v_product
        FROM public.products
        WHERE id = (v_item->>'product_id')::UUID;

        v_unit_price := v_product.price;

        IF v_item->>'variant_id' IS NOT NULL AND (v_item->>'variant_id') != '' THEN
            SELECT id, name_ar, name_en, price_override
            INTO v_variant
            FROM public.product_variants
            WHERE id = (v_item->>'variant_id')::UUID;

            IF FOUND AND v_variant.price_override IS NOT NULL THEN
                v_unit_price := v_variant.price_override;
            END IF;
        END IF;

        v_item_total := v_unit_price * (v_item->>'quantity')::INT;

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
            CASE WHEN v_item->>'variant_id' != '' THEN (v_item->>'variant_id')::UUID ELSE NULL END,
            v_product.name_ar,
            v_product.name_en,
            v_item->>'shade_name_ar',
            v_item->>'size_label',
            v_unit_price,
            (v_item->>'quantity')::INT,
            v_item_total,
            v_product.main_image
        );

        -- Decrement inventory if record exists
        SELECT quantity INTO v_current_stock
        FROM public.inventory
        WHERE product_id = v_product.id
          AND (variant_id IS NULL OR variant_id = (v_item->>'variant_id')::UUID)
        LIMIT 1;

        IF FOUND THEN
            v_new_stock := GREATEST(0, v_current_stock - (v_item->>'quantity')::INT);
            
            UPDATE public.inventory
            SET quantity = v_new_stock, updated_at = NOW()
            WHERE product_id = v_product.id
              AND (variant_id IS NULL OR variant_id = (v_item->>'variant_id')::UUID);

            -- Log movement
            INSERT INTO public.inventory_movements (
                product_id,
                variant_id,
                change_amount,
                previous_quantity,
                new_quantity,
                reason,
                reference_id
            ) VALUES (
                v_product.id,
                CASE WHEN v_item->>'variant_id' != '' THEN (v_item->>'variant_id')::UUID ELSE NULL END,
                -((v_item->>'quantity')::INT),
                v_current_stock,
                v_new_stock,
                'order',
                v_order_number
            );
        END IF;
    END LOOP;

    -- 10. Return complete order JSON
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
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 04_seed.sql - Initial Seed Data for Rosavelle Cosmetics
-- ==============================================================================

-- 1. STORE SETTINGS
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
    store_name_en = EXCLUDED.store_name_en;

-- 2. COUPONS
INSERT INTO public.coupons (code, discount_percent, min_spend, label_ar, label_en, is_active)
VALUES 
    ('BEAUTY10', 10, 300.00, 'Ø®ØµÙ… 10% Ø¹Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø£ÙƒØ«Ø± Ù…Ù† 300 Ø¬.Ù…', '10% off orders over 300 EGP', true),
    ('GLAM20', 20, 700.00, 'Ø®ØµÙ… 20% Ø¹Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø£ÙƒØ«Ø± Ù…Ù† 700 Ø¬.Ù…', '20% off orders over 700 EGP', true),
    ('WELCOME', 15, 200.00, 'Ø®ØµÙ… 15% ØªØ±Ø­ÙŠØ¨ÙŠ Ù„Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø£ÙˆÙ„', '15% off your first order', true)
ON CONFLICT (code) DO NOTHING;

-- 3. CATEGORIES
INSERT INTO public.categories (id, slug, name_ar, name_en, icon, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'skincare', 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©', 'Skincare', 'Sparkles', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80', 1),
    ('11111111-1111-1111-1111-111111111102', 'makeup', 'Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„', 'Makeup', 'Heart', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80', 2),
    ('11111111-1111-1111-1111-111111111103', 'haircare', 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±', 'Haircare', 'Award', 'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=500&q=80', 3),
    ('11111111-1111-1111-1111-111111111104', 'fragrance', 'Ø§Ù„Ø¹Ø·ÙˆØ± ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„Ø¬Ø³Ù…', 'Fragrance & Body', 'Award', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. PRODUCTS
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
        true, 'Ø§Ù„Ø¹Ø·Ø± Ø§Ù„Ø£ÙƒØ«Ø± ØªÙ…ÙŠØ²Ø§Ù‹', 'Signature', 'bestseller',
        'ØªÙˆÙ„ÙŠÙØ© Ø³Ø§Ø­Ø±Ø© ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ù†ÙØ­Ø§Øª Ø§Ù„ÙØ§Ù†ÙŠÙ„ÙŠØ§ Ø§Ù„Ù…Ø¯ØºØ´Ù‚Ø±ÙŠØ© Ø§Ù„Ø¯Ø§ÙØ¦Ø© Ù…Ø¹ Ù„Ù…Ø³Ø§Øª Ù…Ù† Ø§Ù„Ù…Ø³Ùƒ Ø§Ù„Ø£Ø¨ÙŠØ¶ Ø§Ù„Ù†Ù‚ÙŠ ÙˆØ²Ù‡ÙˆØ± Ø§Ù„Ø£ÙˆØ±ÙƒÙŠØ¯ Ø§Ù„Ø¨Ø§Ø±ÙŠØ³ÙŠØ©.',
        'An enchanting composition blending warm Madagascan vanilla with pristine white musk and Parisian orchid.',
        'ÙƒØ­ÙˆÙ„ Ø¹Ø¶ÙˆÙŠ Ù†Ù‚ÙŠØŒ Ø²ÙŠÙˆØª Ø¹Ø·Ø±ÙŠØ© ÙØ±Ù†Ø³ÙŠØ©ØŒ Ø®Ù„Ø§ØµØ© Ø§Ù„ÙØ§Ù†ÙŠÙ„ÙŠØ§ ÙˆØ§Ù„Ù…Ø³Ùƒ ÙˆØ§Ù„ÙˆØ±Ø¯ Ø§Ù„Ø¬ÙˆØ±ÙŠ.',
        'ÙŠÙØ±Ø´ Ø¹Ù„Ù‰ Ù†Ù‚Ø§Ø· Ø§Ù„Ù†Ø¨Ø¶ (Ø§Ù„Ù…Ø¹ØµÙ…ÙŠÙ†ØŒ Ø®Ù„Ù Ø§Ù„Ø£Ø°Ù†ÙŠÙ†ØŒ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø©) Ù„Ø«Ø¨Ø§Øª ÙˆÙÙˆØ§Ø­Ø§Ù† ÙŠØ¯ÙˆÙ… Ø·ÙˆØ§Ù„ Ø§Ù„ÙŠÙˆÙ….',
        'Ù„Ø¬Ù…ÙŠØ¹ Ø¹Ø´Ø§Ù‚ Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ø´Ø±Ù‚ÙŠØ© Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©',
        true
    )
ON CONFLICT (slug) DO NOTHING;

-- 5. PRODUCT VARIANTS (e.g. Lipstick Shades)
INSERT INTO public.product_variants (product_id, variant_type, name_ar, name_en, color_hex, display_order)
VALUES 
    ('22222222-2222-2222-2222-222222222202', 'shade', 'Ø±ÙˆØ² ÙƒÙ„Ø§Ø³ÙŠÙƒ', 'Classic Rose', '#C46B72', 1),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'Ù†ÙˆØ¯ Ø¯Ø§ÙØ¦', 'Warm Nude', '#B87A68', 2),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'Ø±ÙŠØ¯ ÙÙŠÙ„ÙÙŠØª', 'Red Velvet', '#941B26', 3),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'Ø¨ÙŠØ±ÙŠ ØºØ§Ù…Ù‚', 'Deep Berry', '#5C1D2C', 4);

-- 6. INVENTORY
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
VALUES 
    ('22222222-2222-2222-2222-222222222201', 35, 5),
    ('22222222-2222-2222-2222-222222222202', 40, 5),
    ('22222222-2222-2222-2222-222222222203', 25, 5),
    ('22222222-2222-2222-2222-222222222204', 18, 3)
ON CONFLICT DO NOTHING;


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


