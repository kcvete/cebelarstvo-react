# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core commands

All commands assume the project root (`goldendrop-honey`). Node 18+ is recommended.

- Install dependencies:
  - `npm install`
- Run the Vite dev server (frontend only):
  - `npm run dev`
  - Serves on `http://localhost:5173`.
- Build the production bundle:
  - `npm run build`
  - Outputs to `dist/`.
- Preview a production build locally:
  - `npm run preview`
- Example backend server for Stripe Payment Intents (optional, used with the Vite dev server proxy):
  - `node server-example.js`
  - Expects `STRIPE_SECRET_KEY` in `.env`; listens on `http://localhost:3001` and is proxied from the Vite dev server for `/api/*` requests.
- Stripe configuration sanity check script (for `.env` keys):
  - `node verify-stripe-setup.js`

There are currently **no npm scripts for tests or linting**. If you need a type check, you can run:

- `npx tsc --noEmit`

## Environment & configuration

- Copy `.env.example` to `.env` and set:
  - `VITE_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key used in the browser.
  - `STRIPE_SECRET_KEY` – Stripe secret key used by either `server-example.js` or the Cloudflare Worker.
  - `VITE_CLOUDFLARE_WORKER_URL` – URL of the Cloudflare Worker that creates Stripe Checkout Sessions.
  - `VITE_GEMINI_API_KEY` – Gemini API key (used via `vite.config.ts` defines).
- Additional frontend env vars read in `components/CheckoutForm.tsx` for Brevo order notifications (not shown in `.env.example`):
  - `VITE_BREVO_API_KEY`
  - `VITE_ORDER_NOTIFICATION_EMAIL`
  - `VITE_BREVO_SENDER_EMAIL`
  - `VITE_BREVO_SENDER_NAME`
- Vite config (`vite.config.ts`):
  - Dev server on port `5173`.
  - Proxies `/api` to `http://localhost:3001` (used when running `server-example.js`).
  - Defines `process.env.GEMINI_API_KEY` and alias `@` → project root.
- TypeScript config (`tsconfig.json`) uses `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `noEmit: true`, with a path alias `@/*` → `./*`.

## High-level architecture

### Overall structure

This is a single-page React + TypeScript app built with Vite. There is no React Router; navigation is handled via local state in `App.tsx` and limited URL inspection for Stripe redirects.

Key entry points and data modules:

- `index.tsx`
  - Standard React 18 entry: creates a root on `#root` and renders `<App />` inside `React.StrictMode`.
- `App.tsx`
  - Central orchestrator of the UI and business logic.
  - Holds global UI state:
    - `view: ViewState` – pseudo-routing between `home`, `story`, `blog`, `blogPost`, `checkout`, `success`.
    - `cart: CartItem[]` – cart contents, persisted to `localStorage` under `goldenDropCart`.
    - `isCartOpen` – cart drawer visibility.
    - `selectedTags` – active product filter tags.
    - `selectedBlogPost` – currently open blog post.
  - On mount, inspects `window.location.pathname` for `/success` and `/cancel` to handle Stripe Checkout redirects and clear the cart, then normalizes the URL back to `/` via `history.replaceState`.
  - Computes derived data with `useMemo`:
    - `allTags` from `PRODUCTS`.
    - `filteredProducts` based on `selectedTags`.
  - Defines callback props and passes them into child components:
    - `<Hero scrollToShop={scrollToProducts} />`
    - `<ProductCard product={...} onAdd={addToCart} />`
    - `<CheckoutForm cart={cart} total={cartTotal} onSuccess={handleCheckoutSuccess} ... />`
    - `<OurStory onShopClick={...} />`
    - `<BlogList onSelectPost={...} />` / `<BlogPostView post={...} onBack={...} />`
    - `<EmailPopup />`
  - Provides the global layout (header, footer, cart drawer) and wraps the content area where each "view" is conditionally rendered.
- `types.ts`
  - Core domain types:
    - `Product` (optionally `soldOut`, `previousPrice`, `priceId` for Stripe).
    - `CartItem` extends `Product` with `quantity`.
    - `BlogPost` shape.
    - `ViewState` union used by `App`.
- `constants.ts`
  - Static data backing the UI:
    - `SITE_NAME`.
    - `PRODUCTS: Product[]` – three honey SKUs, including `priceId` fields that must be synchronized with Stripe Price IDs.
    - `TESTIMONIALS` – customer quotes for social proof.
    - `BLOG_POSTS` – HTML-content blog posts rendered with `dangerouslySetInnerHTML` in `BlogPostView`.
- `metadata.json`
  - High-level description/name of the app used by external tooling, not referenced in runtime code.

### UI composition (components)

Located in `components/` and all written in React + TSX with Tailwind-style utility classes:

- `Hero.tsx`
  - Landing hero for the home page, emphasizing Slovenian honey.
  - Stateless; receives `scrollToShop` callback from `App` to scroll to the product grid.
- `ProductCard.tsx`
  - Renders a product tile using a `Product` object.
  - Handles visual states such as discounts (`previousPrice`) and sold-out (`soldOut` disables the CTA and applies grayscale/opacity).
  - Emits `onAdd(product)` to let `App` update the global cart.
- `CheckoutForm.tsx`
  - Two-step checkout UI (shipping → payment) that orchestrates Stripe Checkout and Brevo email notifications.
  - Props: `cart`, `total`, `onSuccess`, `onBack`.
  - Step 1 (shipping): collects shipping info, supports a test-data autofill button when running in Stripe test mode / Vite dev.
  - Step 2 (payment):
    - Shows a read-only summary of shipping info and cart contents.
    - On submit, builds a `cartItems` payload and POSTs to `VITE_CLOUDFLARE_WORKER_URL`.
    - Expects the worker to respond with a Checkout Session `id` and then calls `stripe.redirectToCheckout({ sessionId })` using the global `window.Stripe` object.
    - Before redirecting, optionally sends an order-notification email via Brevo (see below).
  - Configuration checks:
    - Validates that Stripe publishable key and Cloudflare Worker URL are non-placeholder values.
    - In non-test mode, enforces that all cart items have a `priceId` set.
- `EmailPopup.tsx`
  - Modal email-capture / discount popup providing a `MED10` discount code.
  - Controls visibility via cookies (`goldendrop_email_popup`) and a `TESTING` flag (currently `true` in code to force display for development).
  - On submit, POSTs `email` to `WORKER_URL` (a Cloudflare Worker endpoint running `cloudflare-worker-brevo.js`).
  - Also records a backup list of subscribers to `localStorage` (`goldendrop_subscribers`).
  - Success state plays an animation and then reveals the `MED10` code with copy-to-clipboard support.
- `OurStory.tsx`
  - Static "about" page with story, values, and imagery; receives `onShopClick` to navigate back to the shop.
- `Blog.tsx`
  - `BlogList` renders a grid of blog cards from `BLOG_POSTS` and emits `onSelectPost(post)`.
  - `BlogPostView` displays a full article page and uses `dangerouslySetInnerHTML` to render the HTML content from constants.

### Stripe checkout architecture

The current recommended Stripe flow is **Checkout Sessions via a Cloudflare Worker**; an Express backend is also provided as an alternative.

**Frontend (CheckoutForm.tsx):**

- Reads `VITE_STRIPE_PUBLISHABLE_KEY` and `VITE_CLOUDFLARE_WORKER_URL` from `import.meta.env`.
- Determines `IS_TEST_MODE` from the key prefix and dev mode and uses a shared `TEST_PRICE_ID` during test runs.
- For each cart item, sends a minimal payload to the worker:
  - `{ priceId, quantity }` (using either the real product `priceId` or the test one).
- Expects a JSON response `{ id: string }` where `id` is the Checkout Session ID.
- Redirects to Stripe via `window.Stripe(STRIPE_PUBLISHABLE_KEY).redirectToCheckout({ sessionId: id })`.
- After successful payment, Stripe redirects the browser back to `/success` (configured on the worker), which `App.tsx` detects on mount to show the success view and clear the cart.

**Cloudflare Worker for Stripe (`cloudflare-worker.js` & `CLOUDFLARE_WORKER_SETUP.md`):**

- Deployed separately in Cloudflare; this repo contains the worker source and setup docs.
- Expects env var `STRIPE_SECRET_KEY`.
- Handles CORS and POST requests containing `{ cartItems }`.
- Validates each item has `priceId` and `quantity`, constructs a `x-www-form-urlencoded` payload for `https://api.stripe.com/v1/checkout/sessions`, and returns `{ id: stripeSession.id }` to the frontend.
- `success_url` and `cancel_url` must be updated to the real domain; for local testing the docs recommend URLs like `http://localhost:5173/success`.

**Express example backend (`server-example.js` & `STRIPE_SETUP.md`):**

- Alternate integration path if you prefer a Node server over Cloudflare Workers.
- Provides `/api/create-payment-intent` and `/api/webhook` endpoints.
- Works with the Vite dev server proxy (`/api` → `localhost:3001`).
- `STRIPE_SETUP.md` explains how to wire this up and which env vars are required.

### Brevo email architecture

There are two distinct Brevo-related flows:

1. **Marketing subscription popup**
   - Frontend: `components/EmailPopup.tsx`.
   - Backend: `cloudflare-worker-brevo.js` deployed as a Cloudflare Worker.
   - Worker expects env vars (`BREVO_API_KEY`, `ALLOWED_ORIGINS`, `BREVO_LIST_IDS`, `BREVO_WELCOME_TEMPLATE_ID`) and:
     - Creates/updates a Brevo contact with attributes like `DISCOUNT_CODE`, `SIGNUP_DATE`, `SOURCE`.
     - Optionally sends a templated welcome email containing the discount code.
   - `BREVO_WORKER_SETUP.md` and `TODO.md` document the required Cloudflare config and remaining integration tasks.

2. **Order notification email (optional)**
   - Implemented directly in `CheckoutForm.tsx` as `sendOrderNotificationEmail`.
   - If `VITE_BREVO_API_KEY` is present, it POSTs to `https://api.brevo.com/v3/smtp/email` with a plain-text summary of the order and shipping info.
   - Intended to notify the shop owner at `VITE_ORDER_NOTIFICATION_EMAIL` using the configured sender identity.
   - Failures in this path are logged but do **not** block the Stripe checkout redirect.

### Pseudo-routing and state management

- There is no client-side router; navigation is entirely handled via the `view` state in `App.tsx` and explicit callbacks.
- "Routes" and their views:
  - `home` – main landing page with `Hero`, product grid, testimonials, email popup, and cart drawer.
  - `story` – `OurStory` page.
  - `blog` – `BlogList` view.
  - `blogPost` – single post view `BlogPostView` driven by `selectedBlogPost`.
  - `checkout` – `CheckoutForm`.
  - `success` – post-checkout confirmation page.
- URL integration is intentionally minimal: only `/success` and `/cancel` are recognized on initial load to show the appropriate post-Stripe state.

## Where to look for deeper details

- `QUICK_START.md` – concise checklist to get Stripe products, Cloudflare Worker, and `.env` configured end-to-end.
- `CLOUDFLARE_WORKER_SETUP.md` – detailed instructions and troubleshooting for the Stripe Checkout Worker.
- `STRIPE_SETUP.md` – alternative Stripe integration that uses the Express backend instead of the Worker.
- `BREVO_WORKER_SETUP.md` – how to deploy and configure the Brevo email subscription worker.
- `IMPLEMENTATION_SUMMARY.md` and `DESIGN_COMPARISON.md` – background on why the current checkout architecture uses Stripe Checkout Sessions + Cloudflare Workers and how it differs from the prior Payment Intents flow without changing the visible UI.
- `TODO.md` – outstanding integration and content tasks (Brevo setup, real blog content, product images, Stripe price IDs).