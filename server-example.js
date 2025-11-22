/**
 * Example backend server for Stripe payment processing
 * This is a Node.js/Express example. You can adapt this to any backend framework.
 * 
 * To use this:
 * 1. Install dependencies: npm install express stripe cors dotenv
 * 2. Create a .env file with your STRIPE_SECRET_KEY
 * 3. Run: node server-example.js
 */

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('\n❌ Error: STRIPE_SECRET_KEY is not set in your .env file');
  console.log('\n📝 To fix this:');
  console.log('1. Copy .env.example to .env:');
  console.log('   cp .env.example .env');
  console.log('\n2. Add your Stripe secret key to .env:');
  console.log('   STRIPE_SECRET_KEY=sk_test_your_secret_key_here');
  console.log('\n3. Get your key from: https://dashboard.stripe.com/apikeys\n');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:5173', 'https://ai.studio', /\.ai\.studio$/],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    console.log(`💳 Payment intent request received: $${(amount / 100).toFixed(2)}`);

    // Validate amount
    if (!amount || amount < 50) { // Stripe minimum is $0.50 USD
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ Payment intent created:', paymentIntent.id);
    
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('❌ Error creating payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events (optional but recommended)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Fulfill the order here (e.g., send confirmation email, update database)
      break;
    }
    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      console.error('Payment failed:', failedPayment.id);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Stripe Payment Server Running`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Endpoint: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`\n📝 Make sure your frontend dev server is also running (npm run dev)\n`);
});
