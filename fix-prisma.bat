@echo off
echo Fixing Prisma setup...
echo.
echo Removing old Prisma client...
rmdir /s /q node_modules\.prisma 2>nul
rmdir /s /q node_modules\@prisma\engines 2>nul
echo.
echo Reinstalling Prisma...
call npm install @prisma/client prisma --force
echo.
echo Generating Prisma client...
call npx prisma generate
echo.
echo Pushing database schema...
call npx prisma db push --accept-data-loss
echo.
echo Seeding database...
node prisma/seed.js
echo.
echo Done!
pause
