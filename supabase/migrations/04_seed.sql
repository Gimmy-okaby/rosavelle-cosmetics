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
    store_name_en = EXCLUDED.store_name_en,
    free_shipping_threshold = EXCLUDED.free_shipping_threshold;

-- 2. COUPONS
INSERT INTO public.coupons (code, discount_percent, min_spend, label_ar, label_en, is_active, usage_limit)
VALUES 
    ('BEAUTY10', 10, 300.00, 'خصم 10% على الطلبات أكثر من 300 ج.م', '10% off orders over 300 EGP', true, 5000),
    ('GLAM20', 20, 700.00, 'خصم 20% على الطلبات أكثر من 700 ج.م', '20% off orders over 700 EGP', true, 2000),
    ('WELCOME', 15, 200.00, 'خصم 15% ترحيبي لطلبك الأول', '15% off your first order', true, 10000)
ON CONFLICT (code) DO UPDATE SET
    discount_percent = EXCLUDED.discount_percent,
    min_spend = EXCLUDED.min_spend,
    is_active = EXCLUDED.is_active;

-- 3. CATEGORIES
INSERT INTO public.categories (id, slug, name_ar, name_en, icon, image_url, display_order)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'skincare', 'العناية بالبشرة', 'Skincare', 'Sparkles', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80', 1),
    ('11111111-1111-1111-1111-111111111102', 'makeup', 'المكياج ومستحضرات التجميل', 'Makeup', 'Heart', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80', 2),
    ('11111111-1111-1111-1111-111111111103', 'haircare', 'العناية بالشعر', 'Haircare', 'Award', 'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=500&q=80', 3),
    ('11111111-1111-1111-1111-111111111104', 'fragrance', 'العطور ومستحضرات الجسم', 'Fragrance & Body', 'Award', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80', 4)
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
        true, 'الأعلى تقييماً', 'Top Rated', 'bestseller',
        'توليفة ساحرة تجمع بين نفحات الفانيليا المدغشقرية الدافئة مع لمسات من المسك الأبيض النقي وزهور الأوركيد الباريسية.',
        'An enchanting composition blending warm Madagascan vanilla with pristine white musk and Parisian orchid.',
        'كحول عضوي نقي، زيوت عطرية فرنسية، خلاصة الفانيليا والمسك والورد الجوري.',
        'يُرش على نقاط النبض (المعصمين، خلف الأذنين، والرقبة) لثبات وفواحان يدوم طوال اليوم.',
        'لجميع عشاق العطور الشرقية الفرنسية',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222205',
        'argan-hair-elixir',
        'زيت الأرجان النقي المرمم والمكثف لأطراف الشعر',
        'Pure Moroccan Argan Hair Elixir',
        'Rosavelle Haircare',
        '11111111-1111-1111-1111-111111111103',
        340.00, 420.00, 4.8, 88,
        'https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80'],
        true, 'طبيعي 100%', '100% Natural', 'bestseller',
        'إكسير علاجي سحري للشعر التالف والجاف، يمنع الهيشان فورياً ويصلح الأطراف المتقصفة ويحمي الشعر من حرارة المكواة.',
        'Restorative hair elixir for frizzy and heat-damaged hair. Tames frizz instantly and repairs split ends.',
        'زيت أرجان مغربي معصور على البارد، زيت بذور الكاميليا، فيتامين E، زيت جوز الهند.',
        'وزعي قطرتين إلى ثلاث قطرات على راحة اليدين ثم مرريها على أطراف الشعر الرطب أو الجاف.',
        'للشعر الجاف والتالف والمعالج بالصبغة',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222206',
        'royal-lash-mascara',
        'ماسكارا الرموش الملكية لتكثيف وتطويل مضاعف',
        'Royal Lash Supreme Volumizing Mascara',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        240.00, 310.00, 4.9, 110,
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'],
        true, 'مقاومة للماء', 'Waterproof', 'trending',
        'فرشاة سيليكون حلزونية مبتكرة تغلف كل رمش من الجذور حتى الأطراف لمنحك رموشاً كثيفة وطويلة.',
        'Innovative spiral silicone brush coats every single lash from root to tip, delivering dramatic volume.',
        'شمع الكارنوبا، كولاجين نباتي، زيت الخروع لتقوية الرموش، أصباغ سوداء كربونية.',
        'مرري الفرشاة بحركة زجزاجية من منبت الرموش باتجاه الأعلى.',
        'مناسبة للعيون الحساسة ومستخدمي العدسات',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222207',
        'velvet-touch-sunscreen',
        'واقي الشمس المخملي غير اللامع SPF 50+',
        'Invisible Velvet Touch Sunscreen SPF 50+',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        360.00, 450.00, 4.8, 97,
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'],
        true, 'حماية قصوى', 'SPF 50+', 'sale',
        'جل كريمي شفاف خفيف الوزن سريع الامتصاص، لا يترك أي أثر أبيض أو ملمس دهني، ويشكل درعاً واقياً من الأشعة فوق البنفسجية.',
        'Ultra-lightweight invisible gel cream with zero white cast. Controls shine, hydrates, and protects against UV rays.',
        'فلاتر حماية شمسية متطورة، مستخلص الشاي الأخضر المضاد للأكسدة، سينتيلا أسياتيكا (سيكا).',
        'يوضع بسخاء على كامل الوجه والرقبة قبل التعرض للشمس بـ 15 دقيقة.',
        'مثالي للبشرة الدهنية والمختلطة والمعرضة للحبوب',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222208',
        'silk-radiant-foundation',
        'كريم أساس سائل حريري بتغطية قابلة للبناء',
        'Silk Radiant Flawless Liquid Foundation',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        420.00, 530.00, 4.7, 65,
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
        true, 'تغطية تدوم 24h', '24H Wear', 'bestseller',
        'فاونديشن مبتكر بتغطية متوسطة إلى كاملة ينساب كالحرير ليخفي المسام والعيوب تماماً مع لمسة نهائية طبيعية ومشرقة.',
        'Breathable buildable foundation that blurs imperfections, evens tone, and gives a second-skin satin finish.',
        'مستخلص حرير طبيعي، ببتيدات مكافحة للشيخوخة، حمض هيالورونيك، فيتامين E.',
        'رجي العبوة جيداً ثم وزعيها بواسطة إسفنجة مبللة أو فرشاة أساس.',
        'لجميع أنواع البشرة',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222209',
        'rose-gold-collagen-mask',
        'ماسك الكولاجين والذهب الوردي للترطيب المكثف',
        'Rose Gold Collagen Hydrogel Face Mask',
        'Rosavelle Skincare',
        '11111111-1111-1111-1111-111111111101',
        190.00, 240.00, 4.9, 84,
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'],
        true, 'جلسة سبا منزلية', 'Spa Experience', 'trending',
        'ماسك هيدروجيل غني بذهب عيار 24 جزيئي والكولاجين البحري لتغذية البشرة وشد الترهلات ومنحك مظهراً زجاجياً لامعاً.',
        'Hydrogel treatment infused with 24K nano-gold and marine collagen to firm, plump, and deeply hydrate.',
        'كولاجين بحري متحلل، جزيئات الذهب الخالص، خلاصة الورد الجوري، مستخلص بذور العنب.',
        'ضعي الماسك على وجه نظيف لمدة 20-30 دقيقة.',
        'لجميع أنواع البشرة، خاصة المتعبة والجافة',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222210',
        'coffee-almond-body-polish',
        'مقشر القهوة وزيت اللوز لتقشير وتنعيم الجسم',
        'Arabica Coffee & Sweet Almond Body Polish',
        'Rosavelle Bodycare',
        '11111111-1111-1111-1111-111111111104',
        310.00, 380.00, 4.8, 71,
        'https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80'],
        true, 'تنعيم فائق', 'Ultra Soft', 'sale',
        'مقشر عضوي فاخر بحبيبات بن أرابيكا المطحون وزيت اللوز الحلو وزبدة الشيا، يزيل الجلد الميت ويحسن مظهر السيلوليت.',
        'Exfoliating body scrub packed with roasted Arabica coffee grounds and sweet almond oil.',
        'حبوب قهوة أرابيكا، سكر قصب عضوي، زيت اللوز الحلو، ملح البحر الميت.',
        'دلكي بحركات دائرية على بشرة مبللة أثناء الاستحمام مع التركيز على المناطق الجافة.',
        'لكافة أنواع الجسم',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222211',
        'pro-artist-brush-set',
        'مجموعة فرش المكياج الاحترافية الفاخرة (12 قطعة)',
        'Pro Artist Luxury 12-Piece Brush Collection',
        'Rosavelle',
        '11111111-1111-1111-1111-111111111102',
        590.00, 750.00, 4.9, 112,
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'],
        true, 'شامل الحقيبة الجلدية', 'Includes Leather Pouch', 'bestseller',
        'طقم متكامل مكون من 12 فرشاة مصنوعة من ألياف صناعية ناعمة كالحرير ومقاومة لتساقط الشعر مع مقابض بلون الذهب الوردي.',
        'Complete 12-piece ultra-soft synthetic brush set with rose gold ferrules and a chic travel case.',
        'شعر صناعي ناعم نباتي 100% (Cruelty-Free)، مقابض خشبية مصقولة، ألومنيوم روز جولد.',
        'فرش متخصصة للدمج، كريم الأساس، البلاشر، الكونتور، ورسم الحواجب والعيون.',
        'مثالية للمبتدئات والمحترفات',
        false
    ),
    (
        '22222222-2222-2222-2222-222222222212',
        'argan-shea-hair-mask',
        'ماسك الأرجان والشيا للترطيب العميق للشعر التالف',
        'Deep Moisture Argan & Shea Hair Mask',
        'Rosavelle Haircare',
        '11111111-1111-1111-1111-111111111103',
        380.00, 470.00, 4.8, 63,
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
        ARRAY['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'],
        true, 'علاج مكثف', 'Intensive Repair', 'sale',
        'علاج حمام كريم فائق القوة يعيد بناء ألياف الشعر الضعيفة ويمنحها مرونة ولمعاناً لا يقاوم بدون سيليكون أو بارابين ضار.',
        'Intensive hair butter mask formulated to repair compromised fibers and deliver touchable softness and shine.',
        'زيت أرجان عضوي، زبدة الشيا الإفريقية الخام، بروتين القمح، كيراتين نباتي، زيت جوز الهند.',
        'بعد غسل الشعر بالشامبو، وزعي كمية كافية من منتصف الشعر حتى الأطراف، اتركيه لمدة 10 دقائق ثم اشطفي جيداً.',
        'للشعر الجاف والتالف والمجعد',
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
    ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 'shade', 'روز كلاسيك', 'Classic Rose', '#C46B72', 1),
    ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'shade', 'نود دافئ', 'Warm Nude', '#B87A68', 2),
    ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 'shade', 'ريد فيلفيت', 'Red Velvet', '#941B26', 3),
    ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'shade', 'بيري غامق', 'Deep Berry', '#5C1D2C', 4),
    -- Foundation shades (p8)
    ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222208', 'shade', '01 بورسلين فاتح', '01 Light Porcelain', '#F7E1D7', 1),
    ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222208', 'shade', '02 بيج طبيعي', '02 Natural Beige', '#E8C8B5', 2),
    ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222208', 'shade', '03 حنطي ذهبي', '03 Warm Honey', '#D6A785', 3),
    ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222208', 'shade', '04 كراميل غني', '04 Rich Caramel', '#B87F56', 4)
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
