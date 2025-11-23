# Cloudflare Worker Setup for Stripe Checkout

This guide will help you set up a Cloudflare Worker to handle Stripe Checkout Sessions for your honey shop.

## Prerequisites

1. A Cloudflare account (free tier works!)
2. A Stripe account with products created
3. Your Stripe API keys

## Step 1: Create Stripe Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create products for each honey type:
   - **Cvetlični med** - 12.00 EUR
   - **Lipov med** - 12.00 EUR
   - **Hojev med** - 15.00 EUR
4. After creating each product, copy its **Price ID** (starts with `price_...`)
5. Update the `priceId` values in `/constants.ts` with your actual Price IDs

## Step 2: Create Cloudflare Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create Application** → **Create Worker**
3. Name it something like `honey-shop-backend`
4. Click **Deploy**

## Step 3: Configure the Worker Code

1. After deployment, click **Edit Code**
2. Replace the entire content with this code:

```javascript
export default {
  async fetch(request, env) {
    // 1. Handle CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Change to your domain in production!
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        // 2. Get cart items from request
        const { cartItems } = await request.json();

        if (!cartItems || cartItems.length === 0) {
          return new Response(
            JSON.stringify({ error: "Cart is empty" }), 
            { status: 400, headers: corsHeaders }
          );
        }

        // 3. Format data for Stripe API
        const body = new URLSearchParams();
        
        body.append('mode', 'payment');
        body.append('success_url', 'https://yourdomain.com/success'); // UPDATE THIS!
        body.append('cancel_url', 'https://yourdomain.com/');        // UPDATE THIS!

        // Add cart items
        cartItems.forEach((item, index) => {
          body.append(`line_items[${index}][price]`, item.priceId);
          body.append(`line_items[${index}][quantity]`, item.quantity);
        });

        // 4. Call Stripe API
        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body
        });

        if (!stripeResponse.ok) {
          const errorText = await stripeResponse.text();
          console.error('Stripe error:', errorText);
          throw new Error('Stripe API error');
        }

        const stripeData = await stripeResponse.json();

        // 5. Return session ID
        return new Response(JSON.stringify({ id: stripeData.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error('Worker error:', err);
        return new Response(
          JSON.stringify({ error: err.message || 'Internal server error' }), 
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  },
};
```

3. **IMPORTANT**: Update the `success_url` and `cancel_url` to match your actual domain
4. Click **Save and Deploy**

## Step 4: Add Stripe Secret Key to Worker

1. In your Worker settings, go to **Settings** → **Variables**
2. Under **Environment Variables**, click **Add variable**
3. Name: `STRIPE_SECRET_KEY`
4. Value: Your Stripe secret key (starts with `sk_test_...` or `sk_live_...`)
5. Click **Encrypt** (important for security!)
6. Click **Save**

## Step 5: Get Worker URL

1. In your Worker overview, you'll see a URL like:
   ```
   https://honey-shop-backend.YOUR_SUBDOMAIN.workers.dev
   ```
2. Copy this URL

## Step 6: Configure Your Frontend

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
   VITE_CLOUDFLARE_WORKER_URL=https://honey-shop-backend.YOUR_SUBDOMAIN.workers.dev
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Update `/constants.ts` with your actual Stripe Price IDs

## Step 7: Test the Integration

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Add items to cart and proceed to checkout
3. Fill in shipping information
4. Click "Nadaljuj na plačilo"
5. You should be redirected to Stripe Checkout page

## Production Checklist

Before going live:

- [ ] Update `success_url` and `cancel_url` in Worker to your production URLs
- [ ] Change Worker CORS `Access-Control-Allow-Origin` from `"*"` to your specific domain
- [ ] Use live Stripe keys (starting with `pk_live_` and `sk_live_`)
- [ ] Create live Stripe Products and update Price IDs
- [ ] Test with Stripe test cards first
- [ ] Set up Stripe webhooks for order confirmation

## Stripe Test Cards

Use these for testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## Troubleshooting

### "Stripe is not configured" error
- Make sure `.env` file exists and has the correct keys
- Restart your dev server after creating/updating `.env`

### "Failed to create checkout session" error
- Check Worker logs in Cloudflare Dashboard
- Verify STRIPE_SECRET_KEY is set correctly in Worker settings
- Ensure Price IDs in `/constants.ts` match your Stripe Dashboard

### CORS errors
- Check Worker CORS headers
- Make sure Worker URL in `.env` is correct

### Items without priceId error
- Update all products in `/constants.ts` with valid Stripe Price IDs
- Price IDs must start with `price_`

## Support

For more information:
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
