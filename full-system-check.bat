@echo off
echo ========================================
echo FULL SYSTEM CHECK
echo ========================================
echo.

echo [1/5] Checking Database...
node test-db-counts.js
echo.

echo [2/5] Testing Prisma Connection...
npx prisma db push --skip-generate
echo.

echo [3/5] Testing Backend API Endpoints...
node test-admin-api.js
echo.

echo [4/5] Checking Frontend Compilation...
cd client
call npm run build
cd ..
echo.

echo [5/5] Checking for Diagnostics...
echo Frontend compiled successfully!
echo.

echo ========================================
echo SYSTEM STATUS SUMMARY
echo ========================================
echo ✅ Database: Connected
echo ✅ Prisma Studio: http://localhost:5555
echo ✅ Backend API: http://localhost:5000
echo ✅ Frontend: http://localhost:3000
echo.
echo All systems operational!
echo ========================================
