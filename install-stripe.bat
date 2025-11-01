@echo off
echo Installing Stripe dependencies...
echo.

echo [1/2] Installing backend Stripe package...
call npm install stripe

echo.
echo [2/2] Installing frontend Stripe packages...
cd client
call npm install @stripe/stripe-js @stripe/react-stripe-js

echo.
echo ✅ Stripe packages installed successfully!
echo.
echo Next steps:
echo 1. Get your Stripe API keys from https://dashboard.stripe.com/apikeys
echo 2. Add to .env file:
echo    STRIPE_SECRET_KEY=sk_test_your_key_here
echo    STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
echo.
pause
