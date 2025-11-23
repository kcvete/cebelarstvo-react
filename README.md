<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/2

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your API keys:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your API keys:
   - `VITE_GEMINI_API_KEY` - Your Gemini API key
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (optional, for payments)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (optional, for backend)

3. Run the app:
   ```bash
   npm run dev
   ```

## Stripe Payment Integration (Optional)

This app includes Stripe Checkout functionality via Cloudflare Workers. To enable payments:

1. **Set up Stripe Products**:
   - Go to https://dashboard.stripe.com/products
   - Create products for each honey type
   - Copy the Price IDs (start with `price_...`)
   - Update `constants.ts` with your Price IDs

2. **Deploy Cloudflare Worker**:
   - Follow the detailed guide in [CLOUDFLARE_WORKER_SETUP.md](CLOUDFLARE_WORKER_SETUP.md)
   - Copy code from `cloudflare-worker.js`
   - Set up your Stripe Secret Key as environment variable

3. **Configure your `.env`**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Test with Stripe test card**: `4242 4242 4242 4242`

For detailed setup instructions, see:
- [CLOUDFLARE_WORKER_SETUP.md](CLOUDFLARE_WORKER_SETUP.md) - Complete setup guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What changed and why
