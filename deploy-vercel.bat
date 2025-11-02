@echo off
echo Deploying Frontend to Vercel...
cd client
npx vercel --prod
