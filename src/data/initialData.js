export const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name_ar: "سيروم الهيالورونيك المركّز للترطيب الفوري",
    name_en: "Ultra Pure Hyaluronic Acid Hydrating Serum",
    brand: "Rosavelle",
    category: "skincare",
    price: 390,
    originalPrice: 490,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 18,
    badge_ar: "الأكثر مبيعاً",
    badge_en: "Bestseller",
    badgeType: "bestseller",
    sizes: ["30 ml", "50 ml"],
    description_ar: "تركيبة فرنسية متطورة تحتوي على حمض الهيالورونيك ثلاثي الأوزان الجزيئية لاختراق طبقات البشرة بعمق، يمنحك امتلاءً فورياً ونضارة تدوم 48 ساعة ويقلل من الخطوط التعبيرية.",
    description_en: "Advanced French formula featuring triple molecular weight Hyaluronic Acid to penetrate deep skin layers, providing instant plumping and 48-hour hydration.",
    ingredients_ar: "حمض هيالورونيك نقي 2%، فيتامين B5 (بانثينول)، مستخلص زهرة البابونج العضوي، جليسرين نباتي، ماء الورد النقي.",
    howToUse_ar: "ضعي 3-4 قطرات صباحاً ومساءً على بشرة نظيفة ورطبة قليلاً قبل كريم الترطيب. ربتي بلطف حتى الامتصاص التام.",
    skinType: "جميع أنواع البشرة / جافة وحساسة"
  },
  {
    id: "p2",
    name_ar: "أحمر شفاه مخملي مطفي - فيلفيت كيس",
    name_en: "Velvet Matte Luxe Lipstick",
    brand: "Rosavelle",
    category: "makeup",
    price: 280,
    originalPrice: 350,
    rating: 4.8,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599732434444-2f22b7a0f7e4?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 32,
    badge_ar: "تخفيض 20%",
    badge_en: "20% OFF",
    badgeType: "sale",
    shades: [
      { name_ar: "روز كلاسيك", name_en: "Classic Rose", hex: "#C46B72" },
      { name_ar: "نود دافئ", name_en: "Warm Nude", hex: "#B87A68" },
      { name_ar: "ريد فيلفيت", name_en: "Red Velvet", hex: "#941B26" },
      { name_ar: "بيري غامق", name_en: "Deep Berry", hex: "#5C1D2C" }
    ],
    description_ar: "لون غني ومكثف بلمسة نهائية مخملية مات غير جافة. معزز بزبدة الشيا وفيتامين E لترطيب الشفاه ومنع تشققها مع ثبات يدوم حتى 12 ساعة دون تلطخ.",
    description_en: "Rich saturated color with a non-drying velvety matte finish. Infused with Shea butter and Vitamin E for 12-hour comfortable wear.",
    ingredients_ar: "شمع النحل الطبيعي، زبدة الشيا النقية، زيت الجوجوبا، فيتامين E، أصباغ معدنية طبيعية فائقة النقاء.",
    howToUse_ar: "ابدئي بتحديد الشفاه من المنتصف ثم املئي الشفتين بالتساوي للحصول على تغطية مخملية ساحرة.",
    skinType: "لجميع أنواع الشفاه"
  },
  {
    id: "p3",
    name_ar: "كريم الإشراقة وتجديد خلايا البشرة بفيتامين C",
    name_en: "Radiance Boost C-Glow Moisturizer",
    brand: "Rosavelle Skincare",
    category: "skincare",
    price: 450,
    originalPrice: 560,
    rating: 4.7,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 14,
    badge_ar: "إشراقة فورية",
    badge_en: "Glow Boost",
    badgeType: "trending",
    sizes: ["50 ml"],
    description_ar: "كريم غني بفيتامين C المستقر والنياسيناميد لتوحيد لون البشرة والتخلص من التصبغات والبقع الداكنة، مع ترطيب عميق يمنح بشرتك توهجاً طبيعياً مفعماً بالحيوية.",
    description_en: "Infused with stabilized Vitamin C and Niacinamide to even skin tone, fade dark spots, and revive dull skin with a luminous glow.",
    ingredients_ar: "فيتامين C (أسكوربيل جلوكوزيد) 10%، نياسيناميد 4%، مستخلص قشر البرتقال العضوي، حمض الهيالورونيك، زبدة الكاكاو.",
    howToUse_ar: "يُوضع صباحاً بعد السيروم على الوجه والرقبة مع تدليك تصاعدي خفيف. يُنصح باستخدام واقي شمس نهاراً.",
    skinType: "البشرة الباهتة والمتصبغة"
  },
  {
    id: "p4",
    name_ar: "عطر ميس لورين - فانيلا مسك فاخر 100 مل",
    name_en: "Miss Lueur - Vanilla Musk Eau de Parfum",
    brand: "Rosavelle Parfums",
    category: "fragrance",
    price: 850,
    originalPrice: 1100,
    rating: 5.0,
    reviewsCount: 153,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 9,
    badge_ar: "الأعلى تقييماً",
    badge_en: "Top Rated",
    badgeType: "bestseller",
    sizes: ["100 ml", "50 ml"],
    description_ar: "عطر أنثوي جذاب يجمع بين دفء الفانيليا المدغشقرية، رقة المسك الأبيض ونفحات براعم الياسمين الملكي. فوحان استثنائي وثبات يدوم لأكثر من 24 ساعة.",
    description_en: "An intoxicating blend of Madagascar vanilla, white velvet musk, and royal jasmine blossom. Extreme longevity and trail.",
    ingredients_ar: "كحول عطري فاخر، زيوت عطرية فرنسية، خلاصة الفانيليا الطبيعية، أوركيد أبيض، مسك الحرير.",
    howToUse_ar: "يُرش على نقاط النبض (خلف الأذنين، المعصمين، وخلف الرقبة) للحصول على ثبات وفوحان رائع طوال اليوم.",
    skinType: "لجميع المناسبات"
  },
  {
    id: "p5",
    name_ar: "زيت الأرجان النقي المرمم والمكثف لأطراف الشعر",
    name_en: "Pure Moroccan Argan Hair Elixir",
    brand: "Rosavelle Haircare",
    category: "haircare",
    price: 340,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 22,
    badge_ar: "طبيعي 100%",
    badge_en: "100% Natural",
    badgeType: "bestseller",
    sizes: ["60 ml"],
    description_ar: "إكسير علاجي سحري للشعر التالف والجاف، يمنع الهيشان فورياً ويصلح الأطراف المتقصفة ويحمي الشعر من حرارة المكواة ومجفف الشعر حتى 230 درجة.",
    description_en: "Restorative hair elixir for frizzy and heat-damaged hair. Tames frizz instantly and repairs split ends while adding mirror shine.",
    ingredients_ar: "زيت أرجان مغربي معصور على البارد، زيت بذور الكاميليا، فيتامين E، زيت جوز الهند العضوي الخفيف.",
    howToUse_ar: "وزعي قطرتين إلى ثلاث قطرات على راحة اليدين ثم مرريها على أطراف الشعر الرطب أو الجاف قبل أو بعد التصفيف.",
    skinType: "للشعر الجاف والتالف والمعالج بالصبغة"
  },
  {
    id: "p6",
    name_ar: "ماسكارا الرموش الملكية لتكثيف وتطويل مضاعف",
    name_en: "Royal Lash Supreme Volumizing Mascara",
    brand: "Rosavelle",
    category: "makeup",
    price: 240,
    originalPrice: 310,
    rating: 4.9,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 27,
    badge_ar: "مقاومة للماء",
    badge_en: "Waterproof",
    badgeType: "trending",
    description_ar: "فرشاة سيليكون حلزونية مبتكرة تغلف كل رمش من الجذور حتى الأطراف لمنحك رموشاً كثيفة وطويلة كرموش الصالونات دون أي تكتل أو تلطيخ طوال اليوم.",
    description_en: "Innovative spiral silicone brush coats every single lash from root to tip, delivering dramatic volume and fluttery length.",
    ingredients_ar: "شمع الكارنوبا، كولاجين نباتي، زيت الخروع لتقوية الرموش، أصباغ سوداء كربونية فائقة السواد.",
    howToUse_ar: "مرري الفرشاة بحركة زجزاجية من منبت الرموش باتجاه الأعلى. ضعي طبقة ثانية لكثافة فائقة وجريئة.",
    skinType: "مناسبة للعيون الحساسة ومستخدمي العدسات"
  },
  {
    id: "p7",
    name_ar: "واقي الشمس المخملي غير اللامع SPF 50+",
    name_en: "Invisible Velvet Touch Sunscreen SPF 50+",
    brand: "Rosavelle Skincare",
    category: "skincare",
    price: 360,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 97,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 16,
    badge_ar: "حماية قصوى",
    badge_en: "SPF 50+",
    badgeType: "sale",
    sizes: ["50 ml"],
    description_ar: "جل كريمي شفاف خفيف الوزن سريع الامتصاص، لا يترك أي أثر أبيض أو ملمس دهني، ويشكل درعاً واقياً من الأشعة فوق البنفسجية UVA/UVB والضوء الأزرق.",
    description_en: "Ultra-lightweight invisible gel cream with zero white cast. Controls shine, hydrates, and protects against UVA/UVB rays and blue light.",
    ingredients_ar: "فلاتر حماية شمسية متطورة، مستخلص الشاي الأخضر المضاد للأكسدة، سينتيلا أسياتيكا (سيكا)، زنك جلوكونات.",
    howToUse_ar: "يوضع بسخاء على كامل الوجه والرقبة قبل التعرض للشمس بـ 15 دقيقة. يُعاد تطبيقه كل ساعتين.",
    skinType: "مثالي للبشرة الدهنية والمختلطة والمعرضة للحبوب"
  },
  {
    id: "p8",
    name_ar: "كريم أساس سائل حريري بتغطية قابلة للبناء",
    name_en: "Silk Radiant Flawless Liquid Foundation",
    brand: "Rosavelle",
    category: "makeup",
    price: 420,
    originalPrice: 530,
    rating: 4.7,
    reviewsCount: 65,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 19,
    badge_ar: "تغطية تدوم 24h",
    badge_en: "24H Wear",
    badgeType: "bestseller",
    shades: [
      { name_ar: "01 بورسلين فاتح", name_en: "01 Light Porcelain", hex: "#F7E1D7" },
      { name_ar: "02 بيج طبيعي", name_en: "02 Natural Beige", hex: "#E8C8B5" },
      { name_ar: "03 حنطي ذهبي", name_en: "03 Warm Honey", hex: "#D6A785" },
      { name_ar: "04 كراميل غني", name_en: "04 Rich Caramel", hex: "#B87F56" }
    ],
    description_ar: "فاونديشن مبتكر بتغطية متوسطة إلى كاملة ينساب كالحرير ليخفي المسام والعيوب تماماً مع لمسة نهائية طبيعية ومشرقة كبشرة ثانية خالية من الشوائب.",
    description_en: "Breathable buildable foundation that blurs imperfections, evens tone, and gives a second-skin satin finish for up to 24 hours.",
    ingredients_ar: "مستخلص حرير طبيعي، ببتيدات مكافحة للشيخوخة، حمض هيالورونيك، فيتامين E، أصباغ عاكسة للضوء.",
    howToUse_ar: "رجي العبوة جيداً ثم ضعي ضخة أو ضختين على ظهر اليد، ووزعيها بواسطة إسفنجة مبللة أو فرشاة أساس.",
    skinType: "لجميع أنواع البشرة"
  },
  {
    id: "p9",
    name_ar: "ماسك الكولاجين والذهب الوردي للترطيب المكثف",
    name_en: "Rose Gold Collagen Hydrogel Face Mask",
    brand: "Rosavelle Skincare",
    category: "skincare",
    price: 190,
    originalPrice: 240,
    rating: 4.9,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 45,
    badge_ar: "جلسة سبا منزلية",
    badge_en: "Spa Experience",
    badgeType: "trending",
    description_ar: "ماسك هيدروجيل غني بذهب عيار 24 جزيئي والكولاجين البحري لتغذية البشرة وشد الترهلات ومنحك مظهر زجاجي لامع ومشدود خلال 20 دقيقة فقط.",
    description_en: "Hydrogel treatment infused with 24K nano-gold and marine collagen to firm, plump, and deeply hydrate tired skin.",
    ingredients_ar: "كولاجين بحري متحلل، جزيئات الذهب الخالص، خلاصة الورد الجوري، مستخلص بذور العنب.",
    howToUse_ar: "ضعي الماسك على وجه نظيف لمدة 20-30 دقيقة، ثم أزيليه ودلكي السيروم المتبقي حتى تمتصه البشرة.",
    skinType: "لجميع أنواع البشرة، خاصة المتعبة والجافة"
  },
  {
    id: "p10",
    name_ar: "مقشر القهوة وزيت اللوز لتقشير وتنعيم الجسم",
    name_en: "Arabica Coffee & Sweet Almond Body Polish",
    brand: "Rosavelle Bodycare",
    category: "fragrance",
    price: 310,
    originalPrice: 380,
    rating: 4.8,
    reviewsCount: 71,
    image: "https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1567928815117-6a848c263595?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 15,
    badge_ar: "تنعيم فائق",
    badge_en: "Ultra Soft",
    badgeType: "sale",
    sizes: ["250 g"],
    description_ar: "مقشر عضوي فاخر بحبيبات بن أرابيكا المطحون وزيت اللوز الحلو وزبدة الشيا، يزيل الجلد الميت ويحسن مظهر السيلوليت ويترك جسمك حريرياً برائحة ساحرة.",
    description_en: "Exfoliating body scrub packed with roasted Arabica coffee grounds and sweet almond oil to polish away roughness and leave skin baby-soft.",
    ingredients_ar: "حبوب قهوة أرابيكا، سكر قصب عضوي، زيت اللوز الحلو، ملح البحر الميت، زيت النعناع العطري.",
    howToUse_ar: "دلكي بحركات دائرية على بشرة مبللة أثناء الاستحمام مع التركيز على المناطق الجافة، ثم اشطفي بالماء الفاتر.",
    skinType: "لكافة أنواع الجسم"
  },
  {
    id: "p11",
    name_ar: "مجموعة فرش المكياج الاحترافية الفاخرة (12 قطعة)",
    name_en: "Pro Artist Luxury 12-Piece Brush Collection",
    brand: "Rosavelle",
    category: "makeup",
    price: 590,
    originalPrice: 750,
    rating: 4.9,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 11,
    badge_ar: "شامل الحقيبة الجلدية",
    badge_en: "Includes Leather Pouch",
    badgeType: "bestseller",
    description_ar: "طقم متكامل مكون من 12 فرشاة مصنوعة من ألياف صناعية ناعمة كالحرير ومقاومة لتساقط الشعر مع مقابض بلون الذهب الوردي وحقيبة جلدية أنيقة للسفر والتخزين.",
    description_en: "Complete 12-piece ultra-soft synthetic brush set with rose gold ferrules and a chic travel case.",
    ingredients_ar: "شعر صناعي ناعم نباتي 100% (Cruelty-Free)، مقابض خشبية مصقولة، ألومنيوم روز جولد مضاد للصدأ.",
    howToUse_ar: "فرش متخصصة للدمج، كريم الأساس، البلاشر، الكونتور، ورسم الحواجب والعيون بدقة المحترفين.",
    skinType: "مثالية للمبتدئات والمحترفات"
  },
  {
    id: "p12",
    name_ar: "ماسك الأرجان والشيا للترطيب العميق للشعر التالف",
    name_en: "Deep Moisture Argan & Shea Hair Mask",
    brand: "Rosavelle Haircare",
    category: "haircare",
    price: 380,
    originalPrice: 470,
    rating: 4.8,
    reviewsCount: 63,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 17,
    badge_ar: "علاج مكثف",
    badge_en: "Intensive Repair",
    badgeType: "sale",
    sizes: ["300 ml"],
    description_ar: "علاج حمام كريم فائق القوة يعيد بناء ألياف الشعر الضعيفة ويمنحها مرونة ولمعاناً لا يقاوم بدون سيليكون أو بارابين ضار.",
    description_en: "Intensive hair butter mask formulated to repair compromised fibers and deliver touchable softness and shine.",
    ingredients_ar: "زيت أرجان عضوي، زبدة الشيا الإفريقية الخام، بروتين القمح، كيراتين نباتي، زيت جوز الهند.",
    howToUse_ar: "بعد غسل الشعر بالشامبو، وزعي كمية كافية من منتصف الشعر حتى الأطراف، اتركيه لمدة 10 دقائق ثم اشطفي جيداً.",
    skinType: "للشعر الجاف والتالف والمجعد"
  }
];

export const CATEGORIES = [
  { id: "all", name_ar: "جميع المنتجات", name_en: "All Products", icon: "Sparkles" },
  { id: "skincare", name_ar: "العناية بالبشرة", name_en: "Skincare", icon: "Sparkles", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80" },
  { id: "makeup", name_ar: "المكياج ومستحضرات التجميل", name_en: "Makeup", icon: "Heart", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80" },
  { id: "haircare", name_ar: "العناية بالشعر", name_en: "Haircare", icon: "Award", image: "https://images.unsplash.com/photo-1608248597359-0a86617a1a09?auto=format&fit=crop&w=500&q=80" },
  { id: "fragrance", name_ar: "العطور ومستحضرات الجسم", name_en: "Fragrance & Body", icon: "Award", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80" }
];

export const GOVERNORATES = [
  { id: "cairo", name_ar: "القاهرة", name_en: "Cairo", shippingCost: 45 },
  { id: "giza", name_ar: "الجيزة", name_en: "Giza", shippingCost: 45 },
  { id: "alex", name_ar: "الإسكندرية", name_en: "Alexandria", shippingCost: 55 },
  { id: "delta", name_ar: "الدلتا (المنصورة، طنطا، الزقازيق)", name_en: "Delta Region", shippingCost: 60 },
  { id: "canal", name_ar: "مدن القناة (بورسعيد، الإسماعيلية، السويس)", name_en: "Canal Cities", shippingCost: 60 },
  { id: "upper_egypt", name_ar: "الصعيد (الفيوم، أسيوط، سوهاج، قنا، الأقصر، أسوان)", name_en: "Upper Egypt", shippingCost: 75 },
  { id: "red_sea", name_ar: "البحر الأحمر وسيناء (الغردقة، شرم الشيخ)", name_en: "Red Sea & Sinai", shippingCost: 85 }
];

export const COUPONS = {
  "BEAUTY10": { discountPercent: 10, minSpend: 300, label_ar: "خصم 10% على الطلبات الأكثر من 300 ج.م" },
  "GLAM20": { discountPercent: 20, minSpend: 700, label_ar: "خصم 20% على الطلبات الأكثر من 700 ج.م" },
  "WELCOME": { discountPercent: 15, minSpend: 200, label_ar: "خصم 15% ترحيبي لطلبك الأول" }
};

export const INITIAL_ORDERS = [
  {
    id: "LU-10928",
    createdAt: "2026-11-10T14:20:00Z",
    customer: {
      name: "سارة أحمد محمود",
      phone: "01098765432",
      governorate: "cairo",
      address: "مدينة نصر - الحي السابع - عمارة 14"
    },
    items: [
      { id: "p1", name: "سيروم الهيالورونيك المركّز للترطيب الفوري", quantity: 1, price: 390 },
      { id: "p2", name: "أحمر شفاه مخملي مطفي - فيلفيت كيس", quantity: 2, price: 280, shade: "ريد فيلفيت" }
    ],
    subtotal: 950,
    shippingCost: 45,
    discountAmount: 95,
    total: 900,
    paymentMethod: "cod",
    status: "delivered" // pending, processing, shipped, delivered, cancelled
  },
  {
    id: "LU-10929",
    createdAt: "2026-11-11T09:45:00Z",
    customer: {
      name: "مي كمال زكي",
      phone: "01123456789",
      governorate: "alex",
      address: "سموحة - شارع فوزي معاذ"
    },
    items: [
      { id: "p4", name: "عطر ميس لورين - فانيلا مسك فاخر 100 مل", quantity: 1, price: 850 }
    ],
    subtotal: 850,
    shippingCost: 55,
    discountAmount: 0,
    total: 905,
    paymentMethod: "instapay",
    status: "processing"
  }
];

export const INITIAL_STORE_SETTINGS = {
  storeName_ar: "روزافيل كوزمتكس",
  storeName_en: "Rosavelle Cosmetics",
  storeTagline_ar: "سحر الورد والجمال الباريسي الفاخر",
  storeTagline_en: "Pure Rose Luxury & Radiant Beauty",
  whatsappNumber: "+201012345678", // Clean WhatsApp phone for order confirmations
  instaPayAccount: "rosavelle.cosmetics@instapay",
  vodafoneCashNumber: "01012345678",
  freeShippingThreshold: 600, // Free shipping if subtotal >= 600 EGP
  announcement_ar: "✨ شحن مجاني لجميع محافظات مصر للطلبات التي تزيد عن 600 ج.م + هدية حصرية من روزافيل مع كل طلب! كود الخصم: BEAUTY10",
  announcement_en: "✨ Free express shipping on orders over 600 EGP + Free Rosavelle luxury gift with every order! Use code: BEAUTY10"
};
