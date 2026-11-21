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
    'روزافيل كوزمتكس',
    'Rosavelle Cosmetics',
    'سحر الورد والجمال الباريسي الفاخر',
    'Pure Rose Luxury & Radiant Beauty',
    '+201012345678',
    'rosavelle.cosmetics@instapay',
    '01012345678',
    600.00,
    '✨ شحن مجاني لجميع محافظات مصر للطلبات التي تزيد عن 600 ج.م + هدية حصرية من روزافيل مع كل طلب! كود الخصم: BEAUTY10',
    '✨ Free express shipping on orders over 600 EGP + Free Rosavelle luxury gift with every order! Use code: BEAUTY10',
    'EGP'
) ON CONFLICT (id) DO UPDATE SET
    store_name_ar = EXCLUDED.store_name_ar,
    store_name_en = EXCLUDED.store_name_en;

-- 2. COUPONS
INSERT INTO public.coupons (code, discount_percent, min_spend, label_ar, label_en, is_active)
VALUES 
    ('BEAUTY10', 10, 300.00, 'خصم 10% على الطلبات أكثر من 300 ج.م', '10% off orders over 300 EGP', true),
    ('GLAM20', 20, 700.00, 'خصم 20% على الطلبات أكثر من 700 ج.م', '20% off orders over 700 EGP', true),
    ('WELCOME', 15, 200.00, 'خصم 15% ترحيبي لطلبك الأول', '15% off your first order', true)
ON CONFLICT (code) DO NOTHING;

-- 3. CATEGORIES
INSERT INTO public.categories (id, slug, name_ar, name_en, icon, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'skincare', 'العناية بالبشرة', 'Skincare', 'Sparkles', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80', 1),
    ('11111111-1111-1111-1111-111111111102', 'makeup', 'المكياج ومستحضرات التجميل', 'Makeup', 'Heart', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80', 2),
    ('11111111-1111-1111-1111-111111111103', 'haircare', 'العناية بالشعر', 'Haircare', 'Award', 'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=500&q=80', 3),
    ('11111111-1111-1111-1111-111111111104', 'fragrance', 'العطور ومستحضرات الجسم', 'Fragrance & Body', 'Award', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80', 4)
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
        'سيروم الهيالورونيك المركّز للترطيب الفوري',
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
        true, 'الأكثر مبيعاً', 'Bestseller', 'bestseller',
        'تركيبة فرنسية متطورة تحتوي على حمض الهيالورونيك ثلاثي الأوزان الجزيئية لاختراق طبقات البشرة بعمق، يمنحك امتلاءً فورياً ونضارة تدوم 48 ساعة ويقلل من الخطوط التعبيرية.',
        'Advanced French formula featuring triple molecular weight Hyaluronic Acid to penetrate deep skin layers, providing instant plumping and 48-hour hydration.',
        'حمض هيالورونيك نقي 2%، فيتامين B5 (بانثينول)، مستخلص زهرة البابونج العضوي، جليسرين نباتي، ماء الورد النقي.',
        'ضعي 3-4 قطرات صباحاً ومساءً على بشرة نظيفة ورطبة قليلاً قبل كريم الترطيب. ربتي بلطف حتى الامتصاص التام.',
        'جميع أنواع البشرة / جافة وحساسة',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        'velvet-matte-lipstick',
        'أحمر شفاه مخملي مطفي - فيلفيت كيس',
        'Velvet Matte Luxe Lipstick',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        280.00, 350.00, 4.8, 94,
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        ARRAY[
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1599732434444-2f22b7a0f7e4?auto=format&fit=crop&w=800&q=80'
        ],
        true, 'تخفيض 20%', '20% OFF', 'sale',
        'لون غني ومكثف بلمسة نهائية مخملية مات غير جافة. معزز بزبدة الشيا وفيتامين E لترطيب الشفاه ومنع تشققها مع ثبات يدوم حتى 12 ساعة دون تلطخ.',
        'Rich saturated color with a non-drying velvety matte finish. Infused with Shea butter and Vitamin E for 12-hour comfortable wear.',
        'شمع النحل الطبيعي، زبدة الشيا النقية، زيت الجوجوبا، فيتامين E، أصباغ معدنية طبيعية فائقة النقاء.',
        'ابدئي بتحديد الشفاه من المنتصف ثم املئي الشفتين بالتساوي للحصول على تغطية مخملية ساحرة.',
        'لجميع أنواع الشفاه',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222203',
        'radiance-boost-moisturizer',
        'كريم الإشراقة وتجديد خلايا البشرة بفيتامين C',
        'Radiance Boost C-Glow Moisturizer',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        450.00, 560.00, 4.7, 76,
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'],
        true, 'إشراقة فورية', 'Glow Boost', 'trending',
        'كريم غني بفيتامين C المستقر والنياسيناميد لتوحيد لون البشرة والتخلص من التصبغات والبقع الداكنة.',
        'Infused with stabilized Vitamin C and Niacinamide to even skin tone, fade dark spots, and revive dull skin.',
        'فيتامين C 10%، نياسيناميد 4%، مستخلص قشر البرتقال العضوي، حمض الهيالورونيك.',
        'يُوضع صباحاً بعد السيروم على الوجه والرقبة مع تدليك تصاعدي خفيف.',
        'البشرة الباهتة والمتصبغة',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222204',
        'miss-lueur-perfume',
        'عطر ميس لورين - فانيلا مسك فاخر 100 مل',
        'Miss Lueur - Vanilla Musk Eau de Parfum',
        'Rosavelle Parfums',
        '11111111-1111-1111-1111-111111111104',
        850.00, 1100.00, 5.0, 153,
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'],
        true, 'العطر الأكثر تميزاً', 'Signature', 'bestseller',
        'توليفة ساحرة تجمع بين نفحات الفانيليا المدغشقرية الدافئة مع لمسات من المسك الأبيض النقي وزهور الأوركيد الباريسية.',
        'An enchanting composition blending warm Madagascan vanilla with pristine white musk and Parisian orchid.',
        'كحول عضوي نقي، زيوت عطرية فرنسية، خلاصة الفانيليا والمسك والورد الجوري.',
        'يُرش على نقاط النبض (المعصمين، خلف الأذنين، والرقبة) لثبات وفواحان يدوم طوال اليوم.',
        'لجميع عشاق العطور الشرقية الفرنسية',
        true
    )
ON CONFLICT (slug) DO NOTHING;

-- 5. PRODUCT VARIANTS (e.g. Lipstick Shades)
INSERT INTO public.product_variants (product_id, variant_type, name_ar, name_en, color_hex, display_order)
VALUES 
    ('22222222-2222-2222-2222-222222222202', 'shade', 'روز كلاسيك', 'Classic Rose', '#C46B72', 1),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'نود دافئ', 'Warm Nude', '#B87A68', 2),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'ريد فيلفيت', 'Red Velvet', '#941B26', 3),
    ('22222222-2222-2222-2222-222222222202', 'shade', 'بيري غامق', 'Deep Berry', '#5C1D2C', 4);

-- 6. INVENTORY
INSERT INTO public.inventory (product_id, quantity, low_stock_threshold)
VALUES 
    ('22222222-2222-2222-2222-222222222201', 35, 5),
    ('22222222-2222-2222-2222-222222222202', 40, 5),
    ('22222222-2222-2222-2222-222222222203', 25, 5),
    ('22222222-2222-2222-2222-222222222204', 18, 3)
ON CONFLICT DO NOTHING;
