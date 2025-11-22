t#!/usr/bin/env node

/**
 * Stripe Setup Verification Script
 * Run this to check if your Stripe integration is properly configured
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

console.log('\n🔍 Verifying Stripe Setup...\n');

let hasErrors = false;

// Check frontend publishable key
const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey || publishableKey.includes('your_') || publishableKey === 'pk_test_your_key_here') {
  console.log('❌ VITE_STRIPE_PUBLISHABLE_KEY is not configured');
  console.log('   Add your publishable key (starts with pk_test_ or pk_live_) to .env\n');
  hasErrors = true;
} else if (publishableKey.startsWith('pk_test_')) {
  console.log('✅ VITE_STRIPE_PUBLISHABLE_KEY is set (TEST MODE)');
  console.log(`   ${publishableKey.substring(0, 20)}...\n`);
} else if (publishableKey.startsWith('pk_live_')) {
  console.log('✅ VITE_STRIPE_PUBLISHABLE_KEY is set (LIVE MODE)');
  console.log(`   ${publishableKey.substring(0, 20)}...\n`);
} else {
  console.log('⚠️  VITE_STRIPE_PUBLISHABLE_KEY format looks unusual');
  console.log(`   ${publishableKey.substring(0, 20)}...\n`);
}

// Check backend secret key
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey || secretKey.includes('your_') || secretKey === 'sk_test_your_secret_key_here') {
  console.log('❌ STRIPE_SECRET_KEY is not configured');
  console.log('   Add your secret key (starts with sk_test_ or sk_live_) to .env\n');
  hasErrors = true;
} else if (secretKey.startsWith('sk_test_')) {
  console.log('✅ STRIPE_SECRET_KEY is set (TEST MODE)');
  console.log(`   ${secretKey.substring(0, 20)}...\n`);
} else if (secretKey.startsWith('sk_live_')) {
  console.log('✅ STRIPE_SECRET_KEY is set (LIVE MODE)');
  console.log(`   ${secretKey.substring(0, 20)}...\n`);
} else {
  console.log('⚠️  STRIPE_SECRET_KEY format looks unusual');
  console.log(`   ${secretKey.substring(0, 20)}...\n`);
}

// Check if keys match mode
if (publishableKey && secretKey) {
  const pubIsTest = publishableKey.startsWith('pk_test_');
  const secIsTest = secretKey.startsWith('sk_test_');
  
  if (pubIsTest !== secIsTest) {
    console.log('⚠️  WARNING: Your publishable key and secret key are in different modes!');
    console.log(`   Publishable: ${pubIsTest ? 'TEST' : 'LIVE'}`);
    console.log(`   Secret: ${secIsTest ? 'TEST' : 'LIVE'}`);
    console.log('   Make sure both keys are from the same Stripe account and mode.\n');
    hasErrors = true;
  }
}

console.log('─'.repeat(60));

if (hasErrors) {
  console.log('\n❌ Setup incomplete. Please:\n');
  console.log('1. Go to https://dashboard.stripe.com/apikeys');
  console.log('2. Copy your Publishable key and Secret key');
  console.log('3. Update your .env file with the actual keys');
  console.log('4. Restart your dev server (npm run dev)');
  console.log('5. Restart your backend server (node server-example.js)\n');
  process.exit(1);
} else {
  console.log('\n✅ All Stripe credentials are configured!\n');
  console.log('Next steps:');
  console.log('1. Make sure your backend is running: node server-example.js');
  console.log('2. Start your frontend: npm run dev');
  console.log('3. Test with card: 4242 4242 4242 4242\n');
  process.exit(0);
}
