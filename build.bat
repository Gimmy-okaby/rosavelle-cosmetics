@echo off
echo ========================================================
echo       Lueur Cosmetics - بناء الموقع للنشر (Production Build)
echo ========================================================
cd /d "%~dp0"
call npm run build
echo.
echo تم بناء الموقع بنجاح داخل مجلد dist !
echo يمكنك الآن رفع محتويات مجلد dist مباشرة إلى استضافتك أو ربطه بـ Vercel / Netlify.
pause
