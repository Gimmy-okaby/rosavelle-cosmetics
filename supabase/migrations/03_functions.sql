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
