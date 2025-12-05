# TODO - Čebelarstvo Tomaž

## Brevo Email Integration

- [ ] Create Brevo account at https://www.brevo.com/
- [ ] Get API key from SMTP & API → API Keys
- [ ] Create contact list "Website Subscribers" (note the List ID)
- [ ] (Optional) Create welcome email template with `{{ params.DISCOUNT_CODE }}`
- [ ] Deploy Cloudflare Worker (`cloudflare-worker-brevo.js`)
- [ ] Set environment variables in Cloudflare:
  - [ ] `BREVO_API_KEY` (encrypt it!)
  - [ ] `ALLOWED_ORIGINS` (e.g., `https://cebelarstvo-tomaz.si,http://localhost:5173`)
  - [ ] `BREVO_LIST_IDS` (optional, comma-separated)
  - [ ] `BREVO_WELCOME_TEMPLATE_ID` (optional)
- [ ] Update `WORKER_URL` in `components/EmailPopup.tsx` with actual worker URL
- [ ] Test the integration
- [ ] Set `TESTING = false` in `EmailPopup.tsx` when done

## Other

- [ ] Replace lorem ipsum blog content with real articles
- [ ] Add real product images
- [ ] Configure Stripe with real price IDs
