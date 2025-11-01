@echo off
echo Setting up full authentication...
echo.
echo Step 1: Generating Prisma Client...
call npx prisma generate
echo.
echo Step 2: Pushing schema changes to database...
call npx prisma db push --accept-data-loss
echo.
echo Step 3: Seeding database with users...
node prisma/seed.js
echo.
echo ========================================
echo Full authentication setup complete!
echo ========================================
echo.
echo Login credentials:
echo   Admin: admin@stoneycreek.com / admin123
echo   User:  john@example.com / user123
echo.
echo Please restart the backend server for changes to take effect.
pause
