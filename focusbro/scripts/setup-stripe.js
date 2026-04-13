#!/usr/bin/env node
/**
 * Brainfog — Stripe setup script
 * Run this ONCE locally after cloning the repo:
 *   node scripts/setup-stripe.js
 *
 * It will create the product, prices, and payment links in your Stripe account,
 * then print the .env lines to paste in.
 *
 * Requires: STRIPE_SECRET_KEY in your environment or hardcoded below.
 */

const SK = process.env.STRIPE_SECRET_KEY;
if (!SK) {
  console.error('❌  Set STRIPE_SECRET_KEY in your environment first:');
  console.error('   export STRIPE_SECRET_KEY=sk_live_...');
  process.exit(1);
}

// Update this to your deployed URL once you have a domain
const SUCCESS_URL = 'https://getbrainfog.com?subscribed=1';
const CANCEL_URL  = 'https://getbrainfog.com?cancelled=1';

async function stripe(path, body) {
  const params = new URLSearchParams(body);
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SK}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Stripe error: ${data.error.message}`);
  return data;
}

async function main() {
  console.log('🧌 Setting up Brainfog Stripe products...\n');

  // 1. Create product
  const product = await stripe('/products', {
    name: 'Brainfog Premium',
    description: 'ADHD focus timer — unlock your goblin, clear the fog.',
  });
  console.log(`✅ Product created: ${product.id}`);

  // 2. Create prices
  const [yearly, monthly, weekly] = await Promise.all([
    stripe('/prices', {
      product: product.id,
      unit_amount: 3999,       // £39.99
      currency: 'gbp',
      'recurring[interval]': 'year',
      nickname: 'Yearly',
    }),
    stripe('/prices', {
      product: product.id,
      unit_amount: 1299,       // £12.99
      currency: 'gbp',
      'recurring[interval]': 'month',
      nickname: 'Monthly',
    }),
    stripe('/prices', {
      product: product.id,
      unit_amount: 499,        // £4.99
      currency: 'gbp',
      'recurring[interval]': 'week',
      nickname: 'Weekly',
    }),
  ]);
  console.log(`✅ Prices created: yearly=${yearly.id} monthly=${monthly.id} weekly=${weekly.id}`);

  // 3. Create payment links with 3-day trial on yearly plan
  const [linkYearly, linkMonthly, linkWeekly] = await Promise.all([
    stripe('/payment_links', {
      'line_items[0][price]': yearly.id,
      'line_items[0][quantity]': 1,
      'subscription_data[trial_period_days]': 3,
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': SUCCESS_URL,
    }),
    stripe('/payment_links', {
      'line_items[0][price]': monthly.id,
      'line_items[0][quantity]': 1,
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': SUCCESS_URL,
    }),
    stripe('/payment_links', {
      'line_items[0][price]': weekly.id,
      'line_items[0][quantity]': 1,
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': SUCCESS_URL,
    }),
  ]);
  console.log(`✅ Payment links created`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Copy these lines into your .env file:\n');
  console.log(`VITE_STRIPE_LINK_YEARLY=${linkYearly.url}`);
  console.log(`VITE_STRIPE_LINK_MONTHLY=${linkMonthly.url}`);
  console.log(`VITE_STRIPE_LINK_WEEKLY=${linkWeekly.url}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('After updating .env, run: npm run build');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
