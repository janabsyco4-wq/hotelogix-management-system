@echo off
echo ============================================================
echo Testing API Endpoints
echo ============================================================
echo.

echo [1/8] Testing Restaurant List...
curl -s http://localhost:5000/api/restaurants | findstr "id" >nul && echo SUCCESS: Restaurant list working || echo FAILED: Restaurant list
echo.

echo [2/8] Testing Single Restaurant...
curl -s http://localhost:5000/api/restaurants/1 | findstr "name" >nul && echo SUCCESS: Single restaurant working || echo FAILED: Single restaurant
echo.

echo [3/8] Testing Deal List...
curl -s http://localhost:5000/api/deals | findstr "id" >nul && echo SUCCESS: Deal list working || echo FAILED: Deal list
echo.

echo [4/8] Testing Single Deal...
curl -s http://localhost:5000/api/deals/1 | findstr "title" >nul && echo SUCCESS: Single deal working || echo FAILED: Single deal
echo.

echo [5/8] Testing Package List...
curl -s http://localhost:5000/api/packages | findstr "id" >nul && echo SUCCESS: Package list working || echo FAILED: Package list
echo.

echo [6/8] Testing Single Package...
curl -s http://localhost:5000/api/packages/1 | findstr "name" >nul && echo SUCCESS: Single package working || echo FAILED: Single package
echo.

echo [7/8] Testing Room List...
curl -s http://localhost:5000/api/rooms | findstr "id" >nul && echo SUCCESS: Room list working || echo FAILED: Room list
echo.

echo [8/8] Testing Health Check...
curl -s http://localhost:5000/api/health | findstr "running" >nul && echo SUCCESS: Health check working || echo FAILED: Health check
echo.

echo ============================================================
echo API Endpoint Testing Complete!
echo ============================================================
pause
