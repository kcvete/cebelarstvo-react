# Stripe Integration Setup Guide

This guide will help you set up Stripe checkout for the GoldenDrop Honey application.

## Quick Start

**Already have Stripe keys?** Follow these steps:

1. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Stripe keys to `.env`**:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

3. **Install backend dependencies**:
   ```bash
   npm install express stripe cors dotenv
   ```

4. **Start the backend server** (in a new terminal):
   ```bash
   node server-example.js
   ```

5. **Start the frontend** (if not already running):
   ```bash
   npm run dev
   ```

6. **Test with Stripe test card**: `4242 4242 4242 4242`

---

## Overview

This implementation uses **Stripe.js v3** loaded via CDN (already included in `index.html`) and vanilla JavaScript integration to avoid React version conflicts. This approach is simpler and works perfectly with the existing CDN-based React setup.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js installed (for running the backend server)
3. A backend server to handle payment processing

## Setup Steps

### 1. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

⚠️ **Important**: Never expose your Secret key in your frontend code!

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and update it with your actual Stripe keys:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51abc...your_actual_key
   STRIPE_SECRET_KEY=sk_test_51xyz...your_actual_key
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   ⚠️ Replace the placeholder values with your actual keys from the Stripe Dashboard

3. Restart your dev server to load the new environment variables:
   ```bash
   npm run dev
   ```

### 3. Set Up the Backend Server

You need a backend server to create payment intents securely. We've provided an example in `server-example.js`.

#### Option A: Use the Example Node.js Server

1. Install backend dependencies:
   ```bash
   npm install express stripe cors dotenv
   ```

4. **Start the backend server** (in a new terminal):
   ```bash
   node server-example.js
   ```

   The server will run on `http://localhost:3001`
   
   > **Note**: The frontend dev server runs on port 3000, and the backend runs on port 3001. Vite's proxy automatically forwards `/api` requests to the backend.

#### Option B: Use Your Own Backend

If you have an existing backend, create an endpoint that:
- Accepts a POST request with the amount to charge
- Creates a Stripe PaymentIntent
- Returns the `client_secret` to the frontend

Example endpoint logic:
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: 'usd',
  automatic_payment_methods: { enabled: true },
});

return { clientSecret: paymentIntent.client_secret };
```

### 4. Update Frontend API Endpoint

If your backend is not running on `http://localhost:3000`, update the API endpoint in `components/CheckoutForm.tsx`:

```typescript
const response = await fetch('YOUR_BACKEND_URL/api/create-payment-intent', {
  // ...
});
```

### 5. Test the Integration

#### Using Stripe Test Cards

Stripe provides test card numbers for testing:

- **Successful payment**: `4242 4242 4242 4242`
- **Payment requires authentication**: `4000 0025 0000 3155`
- **Payment is declined**: `4000 0000 0000 9995`

For all test cards:
- Use any future expiration date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any ZIP code

### 6. Go Live

When ready for production:

1. Switch to live mode in your Stripe Dashboard
2. Get your live API keys (starts with `pk_live_` and `sk_live_`)
3. Update your environment variables with live keys
4. Set up webhook endpoints for production
5. Complete Stripe account verification

## Security Best Practices

✅ **Do:**
- Store API keys in environment variables
- Use HTTPS in production
- Validate amounts on the backend
- Handle webhook events to fulfill orders
- Implement proper error handling

❌ **Don't:**
- Commit API keys to version control
- Use secret keys in frontend code
- Trust payment amounts from the frontend
- Skip webhook signature verification

## Troubleshooting

### "Invalid hook call" Error
- Ensure React versions match between dependencies
- Check that `Elements` wrapper is properly set up
- Verify that hooks are called inside functional components

### Payment Intent Creation Fails
- Verify your backend server is running
- Check that your Stripe secret key is correct
- Ensure the API endpoint URL is correct
- Check browser console and server logs for errors

### CSP (Content Security Policy) Errors
- Ensure your CSP allows scripts from `https://js.stripe.com`
- Add `https://m.stripe.network` to your script-src directive

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Accept a payment guide](https://stripe.com/docs/payments/accept-a-payment)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Webhook Events](https://stripe.com/docs/webhooks)

## Support

For Stripe-specific issues, contact [Stripe Support](https://support.stripe.com)
