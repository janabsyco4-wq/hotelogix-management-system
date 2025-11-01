@echo off
echo Regenerating Prisma client...
call node_modules\.bin\prisma generate
echo Done!
