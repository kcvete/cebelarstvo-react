# Brevo Email Subscription - Cloudflare Worker Setup

This guide explains how to deploy the Cloudflare Worker that handles email subscriptions and saves them to Brevo (formerly Sendinblue).

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. A [Brevo account](https://www.brevo.com/) with API access

## Step 1: Get Your Brevo API Key

1. Log in to your Brevo account
2. Go to **SMTP & API** → **API Keys**
3. Click **Generate a new API key**
4. Copy the API key (you won't see it again!)

## Step 2: Create a Contact List in Brevo (Optional)

1. Go to **Contacts** → **Lists**
2. Click **Create a list**
3. Name it something like "Website Subscribers" or "Discount Popup"
4. Note the **List ID** (visible in the URL or list details)

## Step 3: Create Welcome Email Template (Optional)

1. Go to **Campaigns** → **Templates**
2. Create a transactional email template
3. Include `{{ params.DISCOUNT_CODE }}` where you want the code to appear
4. Note the **Template ID**

## Step 4: Deploy the Cloudflare Worker

### Option A: Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Workers & Pages** → **Create application** → **Create Worker**
3. Name it `brevo-subscription` (or any name)
4. Click **Deploy**
5. Click **Edit code**
6. Replace the code with contents of `cloudflare-worker-brevo.js`
7. Click **Save and deploy**

### Option B: Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create wrangler.toml in project root
cat > wrangler.toml << EOF
name = "brevo-subscription"
main = "cloudflare-worker-brevo.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "https://yourdomain.com,http://localhost:5173"
EOF

# Deploy
wrangler deploy
```

## Step 5: Configure Environment Variables

In your Cloudflare Worker settings:

1. Go to your Worker → **Settings** → **Variables**
2. Add the following **Environment Variables**:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `BREVO_API_KEY` | Your Brevo API key | ✅ Yes |
| `ALLOWED_ORIGINS` | `https://yourdomain.com,http://localhost:5173` | ✅ Yes |
| `BREVO_LIST_IDS` | `2,3` (comma-separated list IDs) | ❌ Optional |
| `BREVO_WELCOME_TEMPLATE_ID` | `1` (your template ID) | ❌ Optional |

⚠️ **Important**: For `BREVO_API_KEY`, use **Encrypt** to keep it secure!

## Step 6: Update Frontend Code

In `components/EmailPopup.tsx`, replace the placeholder URL:

```typescript
// TODO: Replace with your actual Cloudflare Worker URL
const WORKER_URL = 'https://brevo-subscription.YOUR-SUBDOMAIN.workers.dev';
```

Your worker URL will be something like:
- `https://brevo-subscription.your-account.workers.dev`

## Step 7: Test the Integration

1. Open your website (dev or production)
2. Wait for the popup to appear
3. Enter a test email
4. Check your Brevo dashboard → **Contacts** to see the new contact

## API Reference

### Request

```
POST https://your-worker.workers.dev/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Successfully subscribed!",
  "discountCode": "MED10",
  "emailSent": true
}
```

### Error Response

```json
{
  "error": "Valid email is required",
  "code": "VALIDATION_ERROR"
}
```

## Contact Attributes in Brevo

The worker automatically sets these contact attributes:

| Attribute | Value |
|-----------|-------|
| `DISCOUNT_CODE` | `MED10` |
| `SIGNUP_DATE` | Today's date (YYYY-MM-DD) |
| `SOURCE` | `website_popup` |

You may need to create these attributes in Brevo first:
1. Go to **Contacts** → **Settings** → **Contact attributes**
2. Create the attributes with appropriate types

## Troubleshooting

### "CORS error"
- Make sure `ALLOWED_ORIGINS` includes your domain
- Include both `http://localhost:5173` for dev and your production URL

### "401 Unauthorized" from Brevo
- Check your API key is correct
- Make sure the API key has permission to create contacts

### Contact not appearing in list
- Verify `BREVO_LIST_IDS` is set correctly
- Make sure the list exists and the ID is correct

## Security Notes

1. Never expose your Brevo API key in frontend code
2. Always use HTTPS in production
3. Set specific `ALLOWED_ORIGINS` (avoid using `*` in production)
4. The worker validates email format before sending to Brevo
