/**
 * Cloudflare Worker for Stripe Checkout Sessions
 * 
 * Setup Instructions:
 * 1. Create a new Worker in Cloudflare Dashboard
 * 2. Copy this entire file into the Worker editor
 * 3. Update success_url and cancel_url to match your domain
 * 4. Add STRIPE_SECRET_KEY environment variable in Worker settings
 * 5. Deploy!
 * 
 * See CLOUDFLARE_WORKER_SETUP.md for detailed instructions
 */

export default {
  async fetch(request, env) {
    // 1. Handle CORS (Allow your website to talk to this worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // ⚠️ CHANGE TO YOUR DOMAIN IN PRODUCTION! e.g., "https://goldendrop-honey.com"
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle the "Preflight" check (Browsers do this automatically)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        // 2. Get the cart items sent from your website
        const { cartItems } = await request.json();

        // Validate cart
        if (!cartItems || cartItems.length === 0) {
          return new Response(
            JSON.stringify({ error: "Cart is empty" }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Validate cart items have required fields
        for (const item of cartItems) {
          if (!item.priceId || !item.quantity) {
            return new Response(
              JSON.stringify({ error: "Invalid cart item format" }), 
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // 3. Format data for Stripe API (x-www-form-urlencoded)
        // We have to manually build the body string because we aren't using the Stripe Library
        const body = new URLSearchParams();
        
        body.append('mode', 'payment');
        // ⚠️ UPDATE THESE URLs TO MATCH YOUR ACTUAL DOMAIN!
        body.append('success_url', 'https://yourdomain.com/success'); // Where to redirect after successful payment
        body.append('cancel_url', 'https://yourdomain.com/');        // Where to redirect if user cancels

        // Loop through items and add them to the body string
        cartItems.forEach((item, index) => {
          body.append(`line_items[${index}][price]`, item.priceId);
          body.append(`line_items[${index}][quantity]`, item.quantity);
        });

        // 4. Call Stripe API directly
        const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body
        });

        // Check if Stripe request was successful
        if (!stripeResponse.ok) {
          const errorText = await stripeResponse.text();
          console.error('Stripe API error:', errorText);
          
          return new Response(
            JSON.stringify({ error: "Failed to create checkout session" }), 
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const stripeData = await stripeResponse.json();

        // 5. Send the Session ID back to your website
        return new Response(JSON.stringify({ id: stripeData.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error('Worker error:', err);
        return new Response(
          JSON.stringify({ error: err.message || "Internal server error" }), 
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  },
};
