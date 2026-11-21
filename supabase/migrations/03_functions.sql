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
            RAISE EXCEPTION 'المنتج "%" غير متاح حالياً للطلب', v_product.name_ar;
        END IF;

        IF v_product.in_stock = false THEN
            RAISE EXCEPTION 'المنتج "%" نفد من المخزون', v_product.name_ar;
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
                RAISE EXCEPTION 'الدرجة/النوع "%" غير متوفرة حالياً في المخزون', v_variant.name_ar;
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
                RAISE EXCEPTION 'الكمية المطلوبة من "%" غير متوفرة (المتوفر حالياً: % قطعة)', v_product.name_ar, v_current_stock;
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
                RAISE EXCEPTION 'تم تجاوز الحد الأقصى لاستخدام كود الخصم هذا';
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
                RAISE EXCEPTION 'الحد الأدنى لتطبيق هذا الكوبون هو % ج.م', v_coupon.min_spend;
            END IF;
        ELSE
            RAISE EXCEPTION 'كود الخصم غير صحيح أو منتهي الصلاحية';
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
