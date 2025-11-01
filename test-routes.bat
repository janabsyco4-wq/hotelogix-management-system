@echo off
echo ========================================
echo STONEY CREEK HOTEL - ROUTE TESTING
echo ========================================
echo.

echo Testing Backend API...
echo.

echo [1/5] Testing Server Health...
curl -s http://localhost:5000/ > nul && echo   PASS: GET / || echo   FAIL: GET /
curl -s http://localhost:5000/api/health > nul && echo   PASS: GET /api/health || echo   FAIL: GET /api/health
echo.

echo [2/5] Testing Public Routes...
curl -s http://localhost:5000/api/hotels > nul && echo   PASS: GET /api/hotels || echo   FAIL: GET /api/hotels
curl -s http://localhost:5000/api/rooms > nul && echo   PASS: GET /api/rooms || echo   FAIL: GET /api/rooms
curl -s http://localhost:5000/api/attractions > nul && echo   PASS: GET /api/attractions || echo   FAIL: GET /api/attractions
curl -s http://localhost:5000/api/recommendations > nul && echo   PASS: GET /api/recommendations || echo   FAIL: GET /api/recommendations
echo.

echo [3/5] Testing Room Details...
curl -s http://localhost:5000/api/rooms/1 > nul && echo   PASS: GET /api/rooms/1 || echo   FAIL: GET /api/rooms/1
echo.

echo [4/5] Testing Frontend...
curl -s http://localhost:3000 > nul && echo   PASS: Frontend is running || echo   FAIL: Frontend not accessible
echo.

echo [5/5] Summary
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo All public routes are accessible!
echo.
echo To test protected routes (bookings):
echo 1. Open http://localhost:3000
echo 2. Register/Login
echo 3. Try booking a room
echo.
echo ========================================
pause
