# 🌐 Ngrok Deployment Guide - No Credit Card Required!

## What is Ngrok?
Ngrok creates a secure tunnel from the internet to your local backend, making it accessible online without deploying to a server.

**Pros:**
- ✅ Free (no credit card)
- ✅ Works with your local database
- ✅ Easy setup (10 minutes)
- ✅ Perfect for testing and demos

**Cons:**
- ❌ Requires your computer to be running
- ❌ URL changes each time you restart (free tier)
- ❌ Not suitable for 24/7 production

---

## Step 1: Download and Install Ngrok

### 1.1 Download Ngrok

1. **Go to:** https://ngrok.com/download
2. **Click "Sign up for free"** (no card required)
3. **Sign up with email or GitHub**
4. **Download ngrok for Windows**
5. **Extract the ZIP file**
6. **Move `ngrok.exe` to your project folder** (E:\New folder (2)\)

### 1.2 Get Your Auth Token

1. **After signing up, you'll see your dashboard**
2. **Go to:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Copy your authtoken** (looks like: `2abc123def456...`)
4. **Save it - you'll need it next!**

---

## Step 2: Configure Ngrok

Open your terminal in the project folder and run:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

Example:
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl
```

You should see:
```
Authtoken saved to configuration file: C:\Users\YourName\.ngrok2\ngrok.yml
```

---

## Step 3: Update Your .env File

Make sure your `.env` file in the root has:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="508f6169ddea6b612cfc437b55c238636899b65bc737418de4114aa51dedacec"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
CLIENT_URL="https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app"
PORT=5000
NODE_ENV=development
```

**Get your Stripe keys from:** https://dashboard.stripe.com/test/apikeys

---

## Step 4: Start Your Backend

Open a terminal and run:

```bash
npm run server
```

You should see:
```
🚀 Server running on port 5000
📱 API available at http://localhost:5000/api
```

**Keep this terminal open!** Don't close it.

---

## Step 5: Start Ngrok Tunnel

Open a **NEW terminal** (keep the first one running) and run:

```bash
ngrok http 5000
```

You'll see output like this:

```
ngrok                                                                           

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**IMPORTANT:** Copy the `Forwarding` URL (the https one)
Example: `https://abc123def456.ngrok-free.app`

**Keep this terminal open too!**

---

## Step 6: Test Your Backend

Open your browser and visit:
```
https://YOUR-NGROK-URL.ngrok-free.app/api/health
```

Replace `YOUR-NGROK-URL` with the URL from Step 5.

You should see:
```json
{
  "status": "healthy",
  "message": "Hotelogix API is running!",
  "timestamp": "2025-11-02T..."
}
```

**If you see this, your backend is live!** 🎉

---

## Step 7: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click your project:** hotelogix-management-system
3. **Click "Settings"**
4. **Click "Environment Variables"**
5. **Find `REACT_APP_API_URL`**
6. **Click "Edit"**
7. **Change value to:** `https://YOUR-NGROK-URL.ngrok-free.app`
8. **Click "Save"**

### Redeploy Frontend:

1. **Go to "Deployments" tab**
2. **Click "..." on the latest deployment**
3. **Click "Redeploy"**
4. **Wait 2 minutes for redeployment**

---

## Step 8: Configure Stripe Webhook

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/test/webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL:** `https://YOUR-NGROK-URL.ngrok-free.app/api/payment/webhook`
4. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. **Click "Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_`)
7. **Update your `.env` file:**
   ```
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"
   ```
8. **Restart your backend** (Ctrl+C in terminal, then `npm run server` again)

---

## Step 9: Test Everything! 🎉

### Test Complete Flow:

1. **Visit your Vercel URL:**
   https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app

2. **Register a new account**

3. **Browse rooms**

4. **Make a booking**

5. **Use Stripe test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

6. **Complete payment**

7. **Check "My Bookings"** - you should see your booking!

8. **Login as admin:**
   - Email: admin@stoneycreek.com
   - Password: admin123

9. **View dashboard** - see payments and bookings

10. **Test refund** - process a refund for a booking

---

## 🎯 Your Live System

**Frontend (Always Online):**
https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app

**Backend (When Your Computer is Running):**
https://YOUR-NGROK-URL.ngrok-free.app

**Admin Panel:**
https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app/admin

---

## 📝 Daily Usage

### Starting Your System:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Ngrok:**
```bash
ngrok http 5000
```

**That's it!** Your system is now live.

### Stopping Your System:

Press `Ctrl+C` in both terminals.

---

## ⚠️ Important Notes

### Free Ngrok Limitations:

1. **URL Changes:** Each time you restart ngrok, you get a new URL
   - You'll need to update Vercel environment variables
   - You'll need to update Stripe webhook URL

2. **Connection Limit:** 40 connections/minute (plenty for testing)

3. **Session Timeout:** Sessions last 2 hours, then reconnect automatically

### Upgrading Ngrok (Optional):

**Ngrok Paid Plan ($8/month):**
- Fixed URL (doesn't change)
- No connection limits
- Custom domains
- Better for long-term use

---

## 🔄 When Ngrok URL Changes

If you restart ngrok and get a new URL:

### Update Vercel:
1. Go to Vercel → Settings → Environment Variables
2. Update `REACT_APP_API_URL` with new ngrok URL
3. Redeploy

### Update Stripe:
1. Go to Stripe → Webhooks
2. Edit your endpoint
3. Update URL with new ngrok URL

### Update .env:
Update `CLIENT_URL` if needed (usually stays the same)

---

## 🐛 Troubleshooting

### "ngrok not found" error:
- Make sure `ngrok.exe` is in your project folder
- Or add ngrok to your PATH

### Backend not accessible:
- Check if backend is running (`npm run server`)
- Check if ngrok is running (`ngrok http 5000`)
- Verify the ngrok URL is correct

### Frontend can't connect:
- Check `REACT_APP_API_URL` in Vercel
- Make sure it matches your ngrok URL
- Redeploy frontend after changing

### Stripe webhook fails:
- Verify webhook URL matches ngrok URL
- Check `STRIPE_WEBHOOK_SECRET` in .env
- Restart backend after updating .env

### Ngrok shows "Tunnel not found":
- Your authtoken might be wrong
- Run: `ngrok config add-authtoken YOUR_TOKEN` again

---

## 💡 Pro Tips

1. **Keep terminals visible** - so you can see logs and errors

2. **Use ngrok web interface** - Visit http://localhost:4040 to see all requests

3. **Save your ngrok URL** - Write it down so you don't lose it

4. **Test locally first** - Make sure everything works on localhost:5000 before using ngrok

5. **Monitor Stripe dashboard** - Check for webhook delivery issues

---

## 🚀 Next Steps

### For Production (When Ready):

1. **Add card to Railway/Render** - Deploy backend permanently
2. **Use production database** - PostgreSQL instead of SQLite
3. **Switch to Stripe live mode** - Real payments
4. **Add custom domain** - Professional URL
5. **Set up monitoring** - Track errors and performance

### For Now:

**Your system is fully functional with Ngrok!** 

You can:
- Demo to clients
- Test all features
- Collect feedback
- Show off your work

Just remember to keep your computer running when you want the system to be accessible!

---

## ✅ Quick Start Checklist

- [ ] Downloaded and installed ngrok
- [ ] Added authtoken to ngrok
- [ ] Updated .env file
- [ ] Started backend (`npm run server`)
- [ ] Started ngrok (`ngrok http 5000`)
- [ ] Copied ngrok URL
- [ ] Updated Vercel environment variables
- [ ] Redeployed frontend
- [ ] Configured Stripe webhook
- [ ] Tested complete booking flow
- [ ] Tested admin dashboard
- [ ] Tested refund system

---

## 🎉 Congratulations!

Your hotel management system is now live and accessible to anyone on the internet!

**Share your Vercel URL with friends and start collecting bookings!** 🏨

---

Need help? Check the troubleshooting section or let me know! 🚀
