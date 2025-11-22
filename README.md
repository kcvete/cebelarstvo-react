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

This app includes Stripe checkout functionality. To enable payments:

1. **Get Stripe API keys** from https://dashboard.stripe.com/apikeys
2. **Add keys to `.env`** (see step 2 above)
3. **Verify setup**:
   ```bash
   node verify-stripe-setup.js
   ```
4. **Install backend dependencies**:
   ```bash
   npm install express stripe cors dotenv
   ```
5. **Start the payment server** (in a new terminal):
   ```bash
   node server-example.js
   ```
6. **Test with Stripe test card**: `4242 4242 4242 4242`

For detailed Stripe setup instructions, see [STRIPE_SETUP.md](STRIPE_SETUP.md).
