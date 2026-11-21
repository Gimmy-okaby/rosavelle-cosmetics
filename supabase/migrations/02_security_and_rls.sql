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
