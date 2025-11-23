# ✅ Quick Start Checklist

Follow these steps in order to get your checkout working:

## Step 1: Stripe Products Setup (5 min)

- [ ] Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
- [ ] Click "Add Product" for each honey type:
  - [ ] **Cvetlični med** - Set price to €12.00
  - [ ] **Lipov med** - Set price to €12.00  
  - [ ] **Hojev med** - Set price to €15.00
- [ ] Copy each **Price ID** (looks like `price_1ABC...`)
- [ ] Open `constants.ts` and replace the placeholder Price IDs:
  ```typescript
  priceId: 'price_YOUR_ACTUAL_STRIPE_PRICE_ID'
  ```

## Step 2: Cloudflare Worker Setup (10 min)

- [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
- [ ] Navigate to **Workers & Pages** → **Create Application**
- [ ] Click **Create Worker**
- [ ] Name it: `honey-shop-backend`
- [ ] Click **Deploy**
- [ ] Click **Edit Code**
- [ ] Copy entire content from `cloudflare-worker.js` file
- [ ] Paste into Worker editor
- [ ] Update these two lines in the Worker code:
  ```javascript
  body.append('success_url', 'https://YOUR-DOMAIN.com/success');
  body.append('cancel_url', 'https://YOUR-DOMAIN.com/');
  ```
- [ ] Click **Save and Deploy**
- [ ] Go to **Settings** → **Variables**
- [ ] Click **Add variable**
  - Name: `STRIPE_SECRET_KEY`
  - Value: Your Stripe secret key (`sk_test_...` or `sk_live_...`)
  - [ ] Click **Encrypt** ⚠️ Important!
- [ ] Click **Save**
- [ ] Copy your Worker URL (looks like: `https://honey-shop-backend.YOUR-NAME.workers.dev`)

## Step 3: Frontend Configuration (2 min)

- [ ] Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- [ ] Open `.env` and fill in:
  ```env
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
  VITE_CLOUDFLARE_WORKER_URL=https://honey-shop-backend.YOUR-NAME.workers.dev
  VITE_GEMINI_API_KEY=your_gemini_key_here
  ```

## Step 4: Test It! (5 min)

- [ ] Start dev server:
  ```bash
  npm run dev
  ```
- [ ] Open browser to `http://localhost:5173`
- [ ] Add a honey product to cart
- [ ] Click "Zaključi nakup"
- [ ] Fill in shipping information
- [ ] Click "Naprej na plačilo"
- [ ] Click "Nadaljuj na plačilo"
- [ ] You should be redirected to Stripe Checkout page! 🎉
- [ ] Use test card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits
- [ ] Complete payment
- [ ] You should return to success page ✅

## Troubleshooting

### ⚠️ "Stripe is not configured" error
- Check that `.env` file exists in project root
- Verify keys in `.env` don't contain placeholder text
- Restart dev server: `Ctrl+C` then `npm run dev`

### ⚠️ "Items without priceId" error
- Make sure you updated ALL products in `constants.ts`
- Price IDs must start with `price_`
- Match Price IDs exactly from Stripe Dashboard

### ⚠️ "Failed to create checkout session" error
- Check Cloudflare Worker logs in dashboard
- Verify `STRIPE_SECRET_KEY` is set in Worker settings
- Make sure secret key starts with `sk_test_` or `sk_live_`

### ⚠️ CORS error
- Check Worker URL in `.env` is correct
- Ensure Worker has CORS headers (already in `cloudflare-worker.js`)

### ⚠️ Success/Cancel URLs not working
- Update URLs in Worker code to match your domain
- For local testing, use: `http://localhost:5173/success`

## Going to Production

When you're ready to go live:

- [ ] Create live Stripe Products (not test mode)
- [ ] Update `constants.ts` with **live** Price IDs
- [ ] Change Stripe keys to **live** keys in:
  - [ ] `.env` → `pk_live_...`
  - [ ] Cloudflare Worker → `sk_live_...`
- [ ] Update Worker success/cancel URLs to production domain
- [ ] Change Worker CORS from `"*"` to your domain
- [ ] Test with real card (small amount first!)
- [ ] Set up Stripe webhooks for order confirmation

## Need Help?

📖 **Read the detailed guides:**
- `CLOUDFLARE_WORKER_SETUP.md` - Complete setup instructions
- `IMPLEMENTATION_SUMMARY.md` - What changed and why
- `DESIGN_COMPARISON.md` - Design before vs after

💡 **Common Resources:**
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

**You're all set!** Your honey shop now has professional checkout powered by Stripe and Cloudflare! 🍯✨
