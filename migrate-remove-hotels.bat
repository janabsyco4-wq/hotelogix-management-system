@echo off
echo ========================================
echo REMOVING HOTELS FROM DATABASE
echo ========================================
echo.
echo This will:
echo 1. Delete the old database
echo 2. Create new schema without hotels
echo 3. Seed with updated data
echo.
pause

echo.
echo [1/4] Deleting old database...
del prisma\dev.db 2>nul
echo   Done!

echo.
echo [2/4] Generating Prisma client...
call npx prisma generate
echo   Done!

echo.
echo [3/4] Creating new database schema...
call npx prisma db push
echo   Done!

echo.
echo [4/4] Seeding database...
call npx prisma db seed
echo   Done!

echo.
echo ========================================
echo DATABASE MIGRATION COMPLETE!
echo ========================================
echo.
echo Hotels have been removed from the system.
echo Rooms now have direct location information.
echo.
pause
