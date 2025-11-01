# 🚀 Deployment Guide - Hotel Management System

## Overview
This guide will walk you through deploying your complete hotel management system to production.

**Stack:**
- Frontend: Vercel (React)
- Backend: Railway or Render (Node.js + Express)
- Database: Railway PostgreSQL or Neon
- Payments: Stripe (Live Mode)

---

## 📋 Pre-Deployment Checklist

### 1. Test Frontend Build
```bash
cd client
npm run build
```
This ensures your React app builds without errors.

### 2. Prepare Environment Variables
You'll need these for production:

**Backend (.env):**
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secure-random-string"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLIENT_URL="https://your-frontend.vercel.app"
PORT=5000
NODE_ENV=production
```

**Frontend (.env):**
```
REACT_APP_API_URL="https://your-backend.railway.app"
REACT_APP_STRIPE_PUBLIC_KEY="pk_live_..."
```

---

## 🎯 Step 1: Deploy Database

### Option A: Railway PostgreSQL (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the `DATABASE_URL` from the Connect tab
5. Save it for backend deployment

### Option B: Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project
3. Copy the connection string
4. Save it for backend deployment

---

## 🔧 Step 2: Deploy Backend to Railway

### 2.1 Prepare Backend for Deployment
1. Make sure `server/package.json` has start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create `server/.npmrc` (if using Railway):
```
engine-strict=false
```

### 2.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables in Railway:
   - `DATABASE_URL` (from Step 1)
   - `JWT_SECRET` (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `STRIPE_SECRET_KEY` (from Stripe dashboard)
   - `CLIENT_URL` (will add after frontend deployment)
   - `PORT` = `5000`
   - `NODE_ENV` = `production`

6. Deploy and wait for build to complete
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

### 2.3 Run Database Migrations
In Railway terminal or locally with production DATABASE_URL:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Update `client/package.json` build settings:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

2. Create `client/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Add Environment Variables:
   - `REACT_APP_API_URL` = Your Railway backend URL
   - `REACT_APP_STRIPE_PUBLIC_KEY` = Your Stripe publishable key (pk_live_...)

7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### 3.3 Update Backend CORS
Go back to Railway and update:
- `CLIENT_URL` = Your Vercel frontend URL

Redeploy backend for changes to take effect.

---

## 💳 Step 4: Configure Stripe for Production

### 4.1 Switch to Live Mode
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Toggle from "Test mode" to "Live mode" (top right)
3. Get your live keys:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### 4.2 Set Up Webhook
1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend.railway.app/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret (`whsec_...`)
6. Add to Railway environment variables as `STRIPE_WEBHOOK_SECRET`

### 4.3 Update Environment Variables
Update both Railway and Vercel with live Stripe keys.

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Frontend
Visit your Vercel URL and check:
- [ ] Home page loads
- [ ] Can view rooms
- [ ] Can search rooms
- [ ] Navigation works
- [ ] Images load

### 5.2 Test Backend
```bash
curl https://your-backend.railway.app/api/rooms
```
Should return room data.

### 5.3 Test Complete Flow
1. Register new user
2. Browse rooms
3. Make a booking
4. Complete payment (use real card in live mode!)
5. View booking in My Bookings
6. Login as admin
7. View payment in dashboard
8. Test refund (if needed)

---

## 🔒 Step 6: Security & Final Touches

### 6.1 Environment Variables Checklist
- [ ] All secrets are in environment variables (not hardcoded)
- [ ] JWT_SECRET is strong and random
- [ ] Stripe keys are in live mode
- [ ] DATABASE_URL is secure
- [ ] CORS is configured correctly

### 6.2 Database Security
- [ ] Database has strong password
- [ ] Only backend can access database
- [ ] Regular backups enabled (Railway does this automatically)

### 6.3 Optional: Custom Domain
**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Railway:**
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in Vercel
- Verify CORS settings in backend
- Check browser console for errors

### Database connection fails
- Verify `DATABASE_URL` format
- Check if database is running
- Ensure migrations ran successfully

### Stripe payments fail
- Verify webhook endpoint is accessible
- Check Stripe dashboard for errors
- Ensure live keys are correct

### Build fails
- Check build logs in Vercel/Railway
- Test build locally first
- Verify all dependencies are in package.json

---

## 📊 Post-Deployment Monitoring

### Railway Dashboard
- Monitor backend logs
- Check resource usage
- View deployment history

### Vercel Dashboard
- Monitor frontend performance
- Check build logs
- View analytics

### Stripe Dashboard
- Monitor payments
- Check for failed transactions
- Review refunds

---

## 🎉 You're Live!

Your hotel management system is now deployed and ready for real users!

**Next Steps:**
1. Share your URL with friends/testers
2. Monitor for any issues
3. Collect user feedback
4. Plan next features

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Admin: `https://your-app.vercel.app/admin`

---

## 📝 Quick Commands Reference

**Redeploy Frontend:**
```bash
git push origin main
# Vercel auto-deploys on push
```

**Redeploy Backend:**
```bash
git push origin main
# Railway auto-deploys on push
```

**View Backend Logs:**
```bash
# In Railway dashboard → Deployments → View Logs
```

**Run Migrations:**
```bash
# In Railway terminal
npx prisma migrate deploy
```

**Seed Database:**
```bash
# In Railway terminal
npx prisma db seed
```

---

## 💡 Tips

1. **Start with test payments** - Use Stripe test mode first, then switch to live
2. **Monitor logs** - Check Railway/Vercel logs regularly for errors
3. **Backup database** - Railway does this automatically, but verify
4. **Use environment variables** - Never commit secrets to Git
5. **Test thoroughly** - Complete a full booking flow before announcing

---

Good luck with your deployment! 🚀
