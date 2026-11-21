# 🚀 دليل إعداد وربط منصة Supabase مع متجر روزافيل كوزمتكس
## Rosavelle Cosmetics - Supabase Backend Setup Guide

تم تجهيز وهندسة قاعدة البيانات بالكامل وفق أعلى معايير أمان قواعد البيانات العلائقية (Normalized PostgreSQL)، وتأمين الصلاحيات عبر سياسات **Row Level Security (RLS)** مع دوال برمجية آمنة (RPC) لحساب وتأكيد الطلبات في السيرفر.

---

### الخطوة 1: إنشاء مشروع Supabase مجاني (خلال دقيقة واحدة)
1. ادخل إلى موقع: [https://supabase.com](https://supabase.com)
2. سجّل الدخول (أو أنشئ حساباً مجانياً عبر GitHub أو البريد).
3. اضغط على **"New Project"**.
4. أدخل اسم المشروع (مثلاً: `rosavelle-cosmetics`).
5. اختر كلمة مرور قوية لقاعدة البيانات واحفظها لديك.
6. اختر أقرب منطقة جغرافية لجمهورك (مثال: `Frankfurt - eu-central-1` أو `London`).
7. اضغط على **"Create new project"**.

---

### الخطوة 2: تشغيل سكريبت بناء الجداول والسياسات دفعة واحدة
1. من القائمة الجانبية اليسرى في لوحة تحكم Supabase، اضغط على **"SQL Editor"** (أيقونة `>_`).
2. اضغط على **"New query"**.
3. افتح الملف الجاهز في مشروعك:
   📄 **[`supabase/complete_setup.sql`](file:///C:/Users/Abdo%20Gamal/.gemini/antigravity/scratch/lueur-cosmetics/supabase/complete_setup.sql)**
4. انسخ كامل محتواه والصقه في محرر الـ SQL.
5. اضغط على زر **"Run"** (أو `Ctrl + Enter`).
6. ستحصل فوراً على:
   * ✅ إنشاء الـ 10 جداول العلائقية (`profiles`, `categories`, `products`, `product_variants`, `inventory`, `orders`, `order_items`, `store_settings`, `coupons`, `inventory_movements`).
   * ✅ تفعيل حماية RLS على جميع الجداول مع سياسات القراءة العامة للعملاء والصلاحية الحصرية للمسؤول.
   * ✅ دالة تأكيد الطلبات الآمنة `place_guest_order`.
   * ✅ سلة التخزين السحابي للصور `product-images` مع تصاريح الرفع والعرض.
   * ✅ حقن البيانات الأولية والمنتجات الراقية الافتراضية.

---

### الخطوة 3: الحصول على مفاتيح الربط (API Keys)
1. في لوحة تحكم Supabase، اذهب إلى:
   **Project Settings** (أيقونة الترس ⚙️ في الأسفل) ➔ **API**.
2. انسخ القيمتين التاليتين:
   * **Project URL**: يبدأ بـ `https://xxxx.supabase.co`
   * **Project API Anon Key**: المفتاح العام المكتوب تحته `public` (أو `anon`).

---

### الخطوة 4: وضع المفاتيح في المتجر محلياً وعلى Vercel

#### أ) محلياً على جهازك:
أنشئ ملفاً باسم `.env.local` داخل مجلد المشروع وضع فيه:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
*(الملف محمي ومستبعد تلقائياً في `.gitignore` ولا يتم رفعه للإنترنت).*

#### ب) على Vercel عند الرفع للإنترنت:
في لوحة تحكم Vercel:
1. اذهب إلى مشروعك ➔ **Settings** ➔ **Environment Variables**.
2. أضف نفس المفتاحين:
   * اسم المتغير: `VITE_SUPABASE_URL` | القيمة: رابط مشروعك
   * اسم المتغير: `VITE_SUPABASE_ANON_KEY` | القيمة: المفتاح العام

---

### الخطوة 5: إنشاء حساب مسؤول المتجر (Admin User)
1. في لوحة تحكم Supabase، اذهب إلى **Authentication** ➔ **Users**.
2. اضغط **"Add user"** ➔ **"Create user"**.
3. أدخل البريد الإلكتروني الخاص بك وكلمة مرور قوية لمسؤول المتجر.
4. فعّل خيار `Auto Confirm User?` واضغط **"Create user"**.
5. لمنح هذا الحساب صلاحية الإدارة (Admin)، اذهب إلى **SQL Editor** ونفّذ السطر التالي (استبدل البريد ببريدك):
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```
6. الآن يمكنك تسجيل الدخول إلى لوحة إدارة المتجر في الموقع باستخدام هذا البريد وكلمة المرور! 🎉

---

### 🛡️ ميزة الحماية والتشغيل التلقائي (Hybrid Fallback Mode):
* تم تطوير كود المتجر ليدعم **الوضع الهجين**: إذا لم تكن المفاتيح مضافة، يعمل المتجر بكامل ميزاته وسرعته عبر الذاكرة المحلية دون أي توقف أو أخطاء.
* بمجرد وضع مفاتيح Supabase، يتحول المتجر تلقائياً للاتصال بالسحابة المركزية ويتم تحديث المنتجات وتخزين الطلبات سحابياً.
