@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     STONEY CREEK RESORT - ALL SERVICES STATUS CHECK       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Checking Frontend...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend: Running on http://localhost:3000
) else (
    echo ❌ Frontend: Not running
)

echo.
echo [2/5] Checking Backend API...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API: Running on http://localhost:5000
) else (
    echo ❌ Backend API: Not running
)

echo.
echo [3/5] Checking Prisma Studio...
curl -s http://localhost:5555 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Prisma Studio: Running on http://localhost:5555
) else (
    echo ❌ Prisma Studio: Not running
)

echo.
echo [4/5] Checking Database...
node test-db-counts.js

echo.
echo [5/5] Testing API Endpoints...
node test-admin-api.js

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    QUICK ACCESS LINKS                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Frontend:        http://localhost:3000
echo 🔧 Admin Dashboard: http://localhost:3000/admin
echo 📡 API Root:        http://localhost:5000/api
echo 🗄️  Prisma Studio:  http://localhost:5555
echo.
echo 🔐 Admin Login:
echo    Email: admin@hotelogix.com
echo    Password: admin123
echo.
pause
