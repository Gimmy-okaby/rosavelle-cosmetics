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
    store_name_ar TEXT NOT NULL DEFAULT 'روزافيل كوزمتكس',
    store_name_en TEXT NOT NULL DEFAULT 'Rosavelle Cosmetics',
    store_tagline_ar TEXT DEFAULT 'سحر الورد والجمال الباريسي الفاخر',
    store_tagline_en TEXT DEFAULT 'Pure Rose Luxury & Radiant Beauty',
    whatsapp_number TEXT NOT NULL DEFAULT '+201012345678',
    instapay_account TEXT DEFAULT 'rosavelle.cosmetics@instapay',
    vodafone_cash_number TEXT DEFAULT '01012345678',
    free_shipping_threshold DECIMAL(10, 2) NOT NULL DEFAULT 600.00,
    announcement_ar TEXT DEFAULT '✨ شحن مجاني لجميع محافظات مصر للطلبات التي تزيد عن 600 ج.م + هدية حصرية من روزافيل مع كل طلب! كود الخصم: BEAUTY10',
    announcement_en TEXT DEFAULT '✨ Free express shipping on orders over 600 EGP + Free Rosavelle luxury gift with every order! Use code: BEAUTY10',
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
