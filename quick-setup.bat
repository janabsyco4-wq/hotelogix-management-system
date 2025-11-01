@echo off
echo Installing sqlite3...
call npm install sqlite3
echo.
echo Updating database...
node update-db-direct.js
echo.
echo Regenerating Prisma client...
call npx prisma generate
echo.
echo Setup complete! Restart the backend server.
pause
