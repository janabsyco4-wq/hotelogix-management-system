# 🚂 Complete Railway Deployment Guide

## ✅ What You've Done So Far
- Frontend deployed on Vercel ✅
- GitHub repository created ✅
- Railway account created ✅

---

## 📋 What You Need
- Credit/Debit card (for verification only - won't be charged)
- Your Railway account
- 20 minutes

---

## Step 1: Add Payment Method to Railway

### Why Railway Needs a Card:
- To prevent abuse of free tier
- They give you $5 free credit per month
- You won't be charged unless you exceed free tier
- Free tier includes: 500 hours, 512MB RAM, 1GB storage

### How to Add Card:

1. **Go to Railway:** https://railway.app
2. **Click your profile icon** (top right)
3. **Click "Account Settings"** or "Billing"
4. **Click "Add Payment Method"**
5. **Enter your card details:**
   - Card number
   - Expiry date
   - CVC
   - Billing address
6. **Click "Add Card"**

**Note:** Railway will do a small authorization (like $1) to verify the card, but won't charge you.

---

## Step 2: Create PostgreSQL Database

1. **Go to Railway Dashboard:** https://railway.app/dashboard
2. **Click "New Project"**
3. **Select "Provision PostgreSQL"**
4. **Wait 30 seconds** for database to be created
5. **Click on the PostgreSQL service** (the box that appears)
6. **Click "Variables" tab**
7. **Find and copy `DATABASE_URL`** (starts with `postgresql://`)
8. **Save it in notepad** - you'll need it!

Example:
```
postgresql://postgres:PASSWORD@containers-us-west-123.railway.app:7654/railway
```

---

## Step 3: Deploy Backend from GitHub

1. **In your Railway project, click "+ New"** (top right or in project)
2. **Select "GitHub Repo"**
3. **If you don't see your repo:**
   - Click "Configure GitHub App"
   - Authorize Railway to access your repositories
   - Select "hotelogix-management-system"
   - Go back to Railway and try again
4. **Select "hotelogix-management-system"**
5. **Railway will start deploying** - WAIT, we need to configure it!

---

## Step 4: Configure Backend Settings

### 4.1 Set Root Directory

1. **Click on your backend service** (the new box that appeared)
2. **Click "Settings" tab**
3. **Scroll to "Root Directory"**
4. **Click "Edit"**
5. **Type:** `server`
6. **Click "Update"**

### 4.2 Add Environment Variables

1. **Click "Variables" tab**
2. **Click "New Variable"** for each of these:

**Variable 1: DATABASE_URL**
```
DATABASE_URL
```
Value: (paste the PostgreSQL URL you copied in Step 2)

**Variable 2: JWT_SECRET**
```
JWT_SECRET
```
Value:
```
508f6169ddea6b612cfc437b55c238636899b65bc737418de4114aa51dedacec
```

**Variable 3: STRIPE_SECRET_KEY**
```
STRIPE_SECRET_KEY
```
Value: Get from https://dashboard.stripe.com/test/apikeys
(Copy the "Secret key" - starts with `sk_test_`)

**Variable 4: PORT**
```
PORT
```
Value:
```
5000
```

**Variable 5: NODE_ENV**
```
NODE_ENV
```
Value:
```
production
```

**Variable 6: CLIENT_URL**
```
CLIENT_URL
```
Value:
```
https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app
```

3. **Click "Deploy"** or wait for auto-redeploy

---

## Step 5: Wait for Deployment

1. **Click "Deployments" tab**
2. **Watch the build logs**
3. **Wait 2-3 minutes** for deployment to complete
4. **Look for "Success" or "Deployed"**

---

## Step 6: Get Your Backend URL

1. **Click "Settings" tab**
2. **Scroll to "Domains"**
3. **Click "Generate Domain"**
4. **Copy the URL** (e.g., `https://your-app.up.railway.app`)
5. **Save it!**

---

## Step 7: Run Database Migrations

1. **Click on your backend service**
2. **Click "Settings" tab**
3. **Scroll to "Deploy"**
4. **Look for "Custom Start Command"** or go to Variables
5. **We need to run migrations manually**

### Option A: Using Railway CLI (Recommended)

Install Railway CLI:
```bash
npm i -g @railway/cli
```

Login:
```bash
railway login
```

Link to your project:
```bash
railway link
```

Run migrations:
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### Option B: Using Railway Dashboard

1. **Click "Settings" tab**
2. **Scroll to "Custom Start Command"**
3. **Temporarily change to:**
```
npx prisma migrate deploy && npx prisma db seed && npm start
```
4. **Save and redeploy**
5. **After first successful deploy, change back to:** `npm start`

---

## Step 8: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click your project:** hotelogix-management-system
3. **Click "Settings"**
4. **Click "Environment Variables"**
5. **Find `REACT_APP_API_URL`**
6. **Click "Edit"**
7. **Change value to your Railway backend URL** (from Step 6)
8. **Click "Save"**
9. **Go to "Deployments" tab**
10. **Click "..." on latest deployment → "Redeploy"**

---

## Step 9: Configure Stripe Webhook

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/test/webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL:** `https://your-railway-url.up.railway.app/api/payment/webhook`
4. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. **Click "Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_`)
7. **Go back to Railway**
8. **Add new variable:**
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: (paste the signing secret)
9. **Redeploy**

---

## Step 10: Test Your Deployment! 🎉

### Test Backend:
Visit: `https://your-railway-url.up.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "message": "Hotelogix API is running!"
}
```

### Test Frontend:
1. Visit: https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app
2. Click "Register" and create account
3. Browse rooms
4. Make a test booking
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete payment
7. Check "My Bookings"

### Test Admin:
1. Login as admin:
   - Email: admin@stoneycreek.com
   - Password: admin123
2. View dashboard
3. See payments and bookings
4. Test refund

---

## 🎯 Your Live URLs

**Frontend:** https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app

**Backend:** https://your-app.up.railway.app (you'll get this in Step 6)

**Admin:** https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app/admin

---

## 💳 Railway Pricing (Free Tier)

**What's Free:**
- $5 credit per month
- 500 execution hours
- 512MB RAM
- 1GB storage
- Shared CPU

**Your Usage:**
- Backend: ~$3-4/month (within free tier)
- Database: ~$1-2/month (within free tier)
- **Total: FREE** (under $5/month)

**You won't be charged** unless you:
- Exceed 500 hours (running 24/7 for a month)
- Use more than 512MB RAM
- Add more services

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Railway
- Verify `server/package.json` exists
- Ensure root directory is set to `server`

### Database Connection Error:
- Verify `DATABASE_URL` is correct
- Check if migrations ran successfully
- Ensure PostgreSQL service is running

### Frontend Can't Connect:
- Verify `REACT_APP_API_URL` in Vercel
- Check `CLIENT_URL` in Railway
- Ensure backend is deployed and running

### Stripe Payments Fail:
- Verify webhook endpoint URL
- Check `STRIPE_WEBHOOK_SECRET` matches
- Ensure webhook events are selected

---

## 📊 Monitoring

### Railway Dashboard:
- View logs: Click service → "Logs" tab
- Check metrics: Click service → "Metrics" tab
- Monitor usage: Account → "Usage"

### Vercel Dashboard:
- View deployments: Project → "Deployments"
- Check logs: Deployment → "View Function Logs"
- Monitor performance: Project → "Analytics"

---

## 🔄 Redeploying

**Backend (Railway):**
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys
```

**Frontend (Vercel):**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

---

## ✅ Checklist

- [ ] Added payment method to Railway
- [ ] Created PostgreSQL database
- [ ] Deployed backend from GitHub
- [ ] Set root directory to `server`
- [ ] Added all 6 environment variables
- [ ] Generated domain for backend
- [ ] Ran database migrations
- [ ] Updated Vercel environment variables
- [ ] Configured Stripe webhook
- [ ] Tested complete booking flow
- [ ] Tested admin dashboard
- [ ] Tested refund system

---

## 🎉 You're Done!

Your hotel management system is now fully deployed and live!

**Share your URL with friends and start collecting bookings!** 🏨

---

## 📝 Next Steps (Optional)

1. **Custom Domain:**
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel and Railway
   - Update DNS records

2. **Go Live with Stripe:**
   - Switch to live mode in Stripe
   - Update keys in Railway and Vercel
   - Test with real card (small amount)

3. **Add Features:**
   - Email notifications
   - User profiles
   - Reviews and ratings
   - More payment options

4. **Monitor & Optimize:**
   - Check Railway usage
   - Monitor Vercel analytics
   - Review Stripe dashboard
   - Fix any errors

---

Good luck! 🚀
