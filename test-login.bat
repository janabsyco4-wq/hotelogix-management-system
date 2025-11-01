@echo off
echo Installing node-fetch...
call npm install node-fetch@2
echo.
echo Testing login...
node test-login.js
pause
