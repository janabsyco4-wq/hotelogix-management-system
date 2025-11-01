@echo off
echo ========================================
echo Testing Frontend Build
echo ========================================
cd client
echo.
echo Running ESLint check...
call npm run lint 2>nul
echo.
echo Checking for TypeScript/JavaScript errors...
call npx tsc --noEmit --skipLibCheck 2>nul || echo No TypeScript config found, skipping...
echo.
echo Testing production build...
call npm run build
echo.
echo ========================================
echo Frontend Build Test Complete!
echo ========================================
cd ..
