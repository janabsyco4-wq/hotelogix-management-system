@echo off
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          COMPLETE DATABASE RESET AND SEED                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Resetting database...
node reset-to-correct-data.js

echo.
echo [2/3] Seeding base data (rooms, users, bookings, attractions)...
node prisma/seed.js

echo.
echo [3/3] Seeding additional data (restaurants, deals, packages)...
node seed-complete.js

echo.
echo [4/4] Verifying final counts...
node test-db-counts.js

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    SEED COMPLETE!                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ Check Prisma Studio: http://localhost:5555
echo.
pause
