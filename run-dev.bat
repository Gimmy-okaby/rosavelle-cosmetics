@echo off
echo ========================================================
echo       Lueur Cosmetics - تشغيل المتجر في وضع التطوير
echo ========================================================
cd /d "%~dp0"
start http://localhost:3000
call npm run dev
pause
