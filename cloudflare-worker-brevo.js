/**
 * Cloudflare Worker for Brevo (formerly Sendinblue) Email Subscription
 * 
 * This worker handles:
 * 1. Receiving email subscription requests from the frontend
 * 2. Creating/updating contacts in Brevo
 * 3. Optionally sending a welcome email with the discount code
 * 
 * Environment Variables Required (set in Cloudflare Dashboard):
 * - BREVO_API_KEY: Your Brevo API key
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins (e.g., "https://yourdomain.com,http://localhost:5173")
 */

const BREVO_API_URL = 'https://api.brevo.com/v3';

// CORS headers
function getCorsHeaders(origin, allowedOrigins) {
  const origins = allowedOrigins.split(',').map(o => o.trim());
  const isAllowed = origins.includes(origin) || origins.includes('*');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : origins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle preflight requests
function handleOptions(request, env) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin, env.ALLOWED_ORIGINS || '*'),
  });
}

// Create or update contact in Brevo
async function createBrevoContact(email, apiKey, listIds = []) {
  // First, try to create the contact
  const createResponse = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email: email,
      listIds: listIds.length > 0 ? listIds : undefined,
      attributes: {
        DISCOUNT_CODE: 'MED10',
        SIGNUP_DATE: new Date().toISOString().split('T')[0],
        SOURCE: 'website_popup'
      },
      updateEnabled: true, // Update if contact already exists
    }),
  });

  const responseData = await createResponse.json().catch(() => ({}));

  if (createResponse.ok || createResponse.status === 201) {
    return { success: true, data: responseData, isNew: true };
  }

  // Contact might already exist
  if (createResponse.status === 400 && responseData.code === 'duplicate_parameter') {
    return { success: true, data: responseData, isNew: false, message: 'Contact already exists' };
  }

  return { 
    success: false, 
    error: responseData.message || 'Failed to create contact',
    status: createResponse.status 
  };
}

// Optionally send welcome email with discount code
async function sendWelcomeEmail(email, apiKey, templateId) {
  if (!templateId) return { success: true, skipped: true };

  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      templateId: parseInt(templateId),
      to: [{ email: email }],
      params: {
        DISCOUNT_CODE: 'MED10',
      },
    }),
  });

  if (response.ok) {
    return { success: true };
  }

  const errorData = await response.json().catch(() => ({}));
  return { success: false, error: errorData.message || 'Failed to send email' };
}

// Main handler
async function handleRequest(request, env) {
  const origin = request.headers.get('Origin') || '';
  const corsHeaders = getCorsHeaders(origin, env.ALLOWED_ORIGINS || '*');

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { email } = body;

  // Validate email
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check for API key
  if (!env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Create contact in Brevo
    // You can specify list IDs here, e.g., [2, 3] for specific lists
    const listIds = env.BREVO_LIST_IDS ? env.BREVO_LIST_IDS.split(',').map(id => parseInt(id.trim())) : [];
    const contactResult = await createBrevoContact(email, env.BREVO_API_KEY, listIds);

    if (!contactResult.success) {
      return new Response(JSON.stringify({ 
        error: contactResult.error,
        code: 'BREVO_ERROR' 
      }), {
        status: contactResult.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send welcome email if template ID is configured
    let emailResult = { skipped: true };
    if (env.BREVO_WELCOME_TEMPLATE_ID) {
      emailResult = await sendWelcomeEmail(email, env.BREVO_API_KEY, env.BREVO_WELCOME_TEMPLATE_ID);
    }

    return new Response(JSON.stringify({
      success: true,
      message: contactResult.isNew ? 'Successfully subscribed!' : 'Contact updated!',
      discountCode: 'MED10',
      emailSent: !emailResult.skipped && emailResult.success,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }
    
    return handleRequest(request, env);
  },
};
