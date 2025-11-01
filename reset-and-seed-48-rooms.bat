@echo off
echo ========================================
echo  Resetting Database with 48 Rooms
echo ========================================
echo.

echo Step 1: Pushing schema to database...
echo ----------------------------------------
node node_modules\prisma\build\index.js db push --force-reset --skip-generate
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

echo Step 3: Seeding database with 48 rooms...
echo ----------------------------------------
node prisma\seed.js
if %errorlevel% neq 0 (
    echo ERROR: Database seeding failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo  Database Reset Complete!
echo ========================================
echo.
echo 48 rooms have been added to the database
echo (24 in Kansas City, 24 in Independence)
echo.
pause
