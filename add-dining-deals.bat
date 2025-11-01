@echo off
echo ========================================
echo  Adding Dining and Deals Features
echo ========================================
echo.

echo Step 1: Pushing new schema to database...
echo ----------------------------------------
node node_modules\prisma\build\index.js db push --skip-generate
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo.

echo Step 2: Generating Prisma Client...
echo ----------------------------------------
node node_modules\prisma\build\index.js generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Seeding dining and deals data...
echo ----------------------------------------
node seed-dining-deals.js
if %errorlevel% neq 0 (
    echo ERROR: Seeding failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo  Dining and Deals Added Successfully!
echo ========================================
echo.
pause
