@echo off
echo Full system restart...
echo.
echo Step 1: Regenerating Prisma Client...
call npx prisma generate
echo.
echo Step 2: Starting Backend...
start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak >nul
echo.
echo Step 3: Starting Frontend...
start "Frontend Server" cmd /k "cd client && npm start"
echo.
echo All services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Prisma Studio: Run run-prisma-studio.bat separately
echo.
echo Login Credentials:
echo   Admin: admin@stoneycreek.com / admin123
echo   User: john@example.com / user123
pause
