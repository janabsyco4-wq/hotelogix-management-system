# Setup Ngrok - Quick Steps

## ✅ Ngrok is Installed!

Now you need to:

1. **Sign up for ngrok (free):**
   - Go to: https://ngrok.com/signup
   - Sign up with email or GitHub
   - No credit card needed!

2. **Get your auth token:**
   - After signup, you'll see your dashboard
   - Or go to: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy the token (looks like: 2abc123def456...)

3. **Configure ngrok with your token:**
   Run this command (replace YOUR_TOKEN with the token you copied):
   ```
   ngrok config add-authtoken YOUR_TOKEN
   ```

4. **Start your backend:**
   ```
   npm run server
   ```

5. **Start ngrok (in a NEW terminal):**
   ```
   ngrok http 5000
   ```

6. **Copy the https URL** that ngrok shows you

7. **Update Vercel** with that URL

---

**Go to https://ngrok.com/signup now and get your token!**
