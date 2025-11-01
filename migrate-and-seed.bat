@echo off
echo Migrating database with password field...
call npm run prisma:migrate
echo.
echo Seeding database with hashed passwords...
node prisma/seed.js
echo.
echo Done! Database updated with password authentication.
echo.
echo Login credentials:
echo Admin: admin@stoneycreek.com / admin123
echo User: john@example.com / user123
echo.
pause
