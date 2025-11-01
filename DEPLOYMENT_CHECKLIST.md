# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] Test frontend build locally: `cd client && npm run build`
- [ ] Verify all features work in development
- [ ] Have Stripe account ready (test mode first)
- [ ] Have GitHub account ready

---

## Step 1: Database (5 minutes)
- [ ] Sign up at [railway.app](https://railway.app) or [neon.tech](https://neon.tech)
- [ ] Create PostgreSQL database
- [ ] Copy `DATABASE_URL`
- [ ] Save it somewhere safe

---

## Step 2: Backend Deployment (10 minutes)
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select your repository
- [ ] Set Root Directory: `server`
- [ ] Add environment variables:
  ```
  DATABASE_URL=postgresql://...
  JWT_SECRET=<generate random string>
  STRIPE_SECRET_KEY=sk_test_...
  PORT=5000
  NODE_ENV=production
  ```
- [ ] Deploy and wait for completion
- [ ] Copy backend URL (e.g., `https://your-app.railway.app`)
- [ ] Run migrations in Railway terminal:
  ```bash
  npx prisma migrate deploy
  npx prisma db seed
  ```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Frontend Deployment (10 minutes)
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Click "Add New" → "Project"
- [ ] Import your repository
- [ ] Set Root Directory: `client`
- [ ] Framework: Create React App
- [ ] Add environment variables:
  ```
  REACT_APP_API_URL=https://your-backend.railway.app
  REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
  ```
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 4: Connect Frontend & Backend (2 minutes)
- [ ] Go back to Railway
- [ ] Add environment variable:
  ```
  CLIENT_URL=https://your-app.vercel.app
  ```
- [ ] Redeploy backend

---

## Step 5: Configure Stripe Webhook (5 minutes)
- [ ] Go to [dashboard.stripe.com](https://dashboard.stripe.com)
- [ ] Developers → Webhooks → "Add endpoint"
- [ ] Endpoint URL: `https://your-backend.railway.app/api/payment/webhook`
- [ ] Select events:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
- [ ] Copy webhook signing secret (`whsec_...`)
- [ ] Add to Railway:
  ```
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Redeploy backend

---

## Step 6: Test Everything (10 minutes)
- [ ] Visit your Vercel URL
- [ ] Register a new user
- [ ] Browse rooms
- [ ] Make a test booking
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Check "My Bookings"
- [ ] Login as admin (admin@stoneycreek.com / admin123)
- [ ] View payment in dashboard
- [ ] Test refund

---

## Step 7: Go Live (Optional)
When ready for real payments:
- [ ] Switch Stripe to Live mode
- [ ] Get live keys (pk_live_... and sk_live_...)
- [ ] Update environment variables in Vercel and Railway
- [ ] Update webhook endpoint in Stripe
- [ ] Test with real card (small amount)

---

## 🎉 You're Done!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Admin: `https://your-app.vercel.app/admin`

**Test Credentials:**
- Admin: admin@stoneycreek.com / admin123
- User: Create new account

**Stripe Test Card:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 📊 Monitor Your Deployment

**Railway:**
- View logs: Dashboard → Deployments → View Logs
- Check metrics: Dashboard → Metrics

**Vercel:**
- View logs: Project → Deployments → View Function Logs
- Check analytics: Project → Analytics

**Stripe:**
- View payments: Dashboard → Payments
- Check webhooks: Developers → Webhooks → View logs

---

## 🐛 Common Issues

**Frontend can't connect to backend:**
- Check `REACT_APP_API_URL` in Vercel
- Verify CORS `CLIENT_URL` in Railway
- Check browser console for errors

**Database connection fails:**
- Verify `DATABASE_URL` format
- Check if migrations ran: `npx prisma migrate deploy`

**Stripe payments fail:**
- Check webhook endpoint is accessible
- Verify webhook secret matches
- Check Stripe dashboard for errors

---

## 🔄 Redeploying

**Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

**Backend:**
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys
```

---

## 💡 Pro Tips

1. **Start with test mode** - Use Stripe test keys first
2. **Monitor logs** - Check Railway/Vercel logs after deployment
3. **Test thoroughly** - Complete full booking flow before sharing
4. **Backup database** - Railway does this automatically
5. **Use environment variables** - Never commit secrets

---

**Need help?** Check the full DEPLOYMENT_GUIDE.md for detailed instructions.

Good luck! 🚀
