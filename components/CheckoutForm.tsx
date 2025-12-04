import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CreditCard, Zap } from 'lucide-react';
import { CartItem } from '../types';

// Stripe publishable key and Cloudflare Worker URL from environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';
const CLOUDFLARE_WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || 'https://honey-shop-backend.YOUR_SUBDOMAIN.workers.dev';

// Brevo (Sendinblue) configuration
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const ORDER_NOTIFICATION_EMAIL = import.meta.env.VITE_ORDER_NOTIFICATION_EMAIL || 'info@cebelarstvo-tomaz.si';
const BREVO_SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'aneja.fu@gmail.com';
const BREVO_SENDER_NAME = import.meta.env.VITE_BREVO_SENDER_NAME || 'Čebelarstvo Tomaž';

// Check if we're in test/dev mode (Stripe test key starts with pk_test_)
const IS_TEST_MODE = STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_') || import.meta.env.DEV;

// Test price ID for test mode - use this for all products when testing
const TEST_PRICE_ID = 'price_1SYuSEIVhqY1p0l8HVT98w3x';

// Test data for prefilling the form
const TEST_DATA: ShippingInfo = {
  firstName: 'Janez',
  lastName: 'Novak',
  email: 'janez.test@example.com',
  phone: '+386 40 123 456',
  address: 'Testna ulica 42',
  city: 'Ljubljana',
  postalCode: '1000',
  country: 'Slovenija'
};

interface CheckoutFormProps {
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
  onBack: () => void;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

declare global {
  interface Window {
    Stripe: any;
  }
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, total, onSuccess, onBack }) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [stripe, setStripe] = useState<any>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Slovenija'
  });

  // Check if Stripe and Worker are configured
  const isConfigured = 
    STRIPE_PUBLISHABLE_KEY && 
    !STRIPE_PUBLISHABLE_KEY.includes('your_key_here') &&
    CLOUDFLARE_WORKER_URL &&
    !CLOUDFLARE_WORKER_URL.includes('YOUR_SUBDOMAIN');

  // Send order notification email via Brevo
  const sendOrderNotificationEmail = async () => {
    if (!BREVO_API_KEY) {
      console.warn('Brevo API key not configured, skipping email notification');
      return;
    }

    const orderItems = cart.map(item => 
      `• ${item.name} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)} €`
    ).join('\n');

    const emailContent = `
Nova naročilnica - Čebelarstvo Tomaž

PODATKI ZA DOSTAVO:
-------------------
Ime: ${shippingInfo.firstName} ${shippingInfo.lastName}
E-pošta: ${shippingInfo.email}
Telefon: ${shippingInfo.phone}
Naslov: ${shippingInfo.address}
Mesto: ${shippingInfo.postalCode} ${shippingInfo.city}
Država: ${shippingInfo.country}

NAROČENI IZDELKI:
-----------------
${orderItems}

SKUPAJ: ${total.toFixed(2)} €

---
Naročilo oddano: ${new Date().toLocaleString('sl-SI')}
${IS_TEST_MODE ? '⚠️ TESTNO NAROČILO' : ''}
    `.trim();

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL
          },
          to: [{ email: ORDER_NOTIFICATION_EMAIL }],
          subject: `${IS_TEST_MODE ? '[TEST] ' : ''}Nova naročilnica - ${shippingInfo.firstName} ${shippingInfo.lastName}`,
          textContent: emailContent
        })
      });

      if (!response.ok) {
        console.error('Failed to send email notification:', await response.text());
      } else {
        console.log('Order notification email sent successfully');
      }
    } catch (err) {
      console.error('Error sending email notification:', err);
      // Don't block the checkout flow if email fails
    }
  };

  // Initialize Stripe
  useEffect(() => {
    if (!isConfigured) {
      setError('⚠️ Stripe is not configured. Please add your API keys and Cloudflare Worker URL to the .env file.');
      return;
    }

    if (window.Stripe && !stripe) {
      const stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      setStripe(stripeInstance);
    }
  }, [isConfigured, stripe]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate shipping info
    const requiredFields: (keyof ShippingInfo)[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      setError('Prosimo, izpolnite vsa obvezna polja.');
      return;
    }
    
    // Move to payment step
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe) {
      setError('Stripe se še ni naložil. Prosimo, poskusite ponovno.');
      return;
    }

    // Validate that all cart items have price IDs (skip in test mode since we use test price)
    if (!IS_TEST_MODE) {
      const itemsWithoutPriceId = cart.filter(item => !item.priceId);
      if (itemsWithoutPriceId.length > 0) {
        setError('Nekateri izdelki še nimajo nastavljenih cen v Stripe. Prosimo, kontaktirajte podporo.');
        console.error('Items without priceId:', itemsWithoutPriceId);
        return;
      }
    }

    setIsProcessing(true);
    setError('');

    try {
      // Prepare cart items in the format expected by Cloudflare Worker
      // In test mode, use the test price ID for all items
      const cartItems = cart.map(item => ({
        priceId: IS_TEST_MODE ? TEST_PRICE_ID : item.priceId!,
        quantity: item.quantity
      }));

      console.log('Test mode:', IS_TEST_MODE);
      console.log('Calling Cloudflare Worker:', CLOUDFLARE_WORKER_URL);
      console.log('Cart items:', cartItems);

      // Call Cloudflare Worker to create Stripe Checkout Session
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Worker error:', errorText);
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const session = await response.json();
      console.log('Session created:', session);

      if (session.id) {
        // Send order notification email before redirecting to Stripe
        await sendOrderNotificationEmail();
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        
        if (error) {
          setError(error.message || 'Prišlo je do napake pri preusmeritvi na plačilo.');
        }
        // If redirect is successful, user will leave the page
      } else {
        console.error('No session ID returned:', session);
        setError('Ni bilo mogoče ustvariti plačilne seje. Prosimo, poskusite ponovno.');
      }
    } catch (err) {
      setError('Prišlo je do nepričakovane napake. Prosimo, poskusite ponovno.');
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-6 flex items-center text-stone-500 hover:text-stone-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Nazaj na košarico
      </button>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-gold-600' : 'text-stone-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 'shipping' ? 'bg-gold-600 text-white' : 'bg-stone-200'
          }`}>1</div>
          <span className="font-medium">Dostava</span>
        </div>
        <div className="h-px w-12 bg-stone-300" />
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-gold-600' : 'text-stone-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 'payment' ? 'bg-gold-600 text-white' : 'bg-stone-200'
          }`}>2</div>
          <span className="font-medium">Plačilo</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
        <div className="bg-stone-900 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {step === 'shipping' ? <Lock className="w-5 h-5 text-green-400" /> : <CreditCard className="w-5 h-5 text-green-400" />}
            {step === 'shipping' ? 'Podatki za dostavo' : 'Varno plačilo'}
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            {step === 'shipping' ? 'Korak 1 od 2' : 'Powered by Stripe'}
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8 pb-6 border-b border-stone-100">
            <p className="text-sm text-stone-500 uppercase tracking-wide font-bold">Skupaj za plačilo</p>
            <p className="text-4xl font-bold text-gold-600 mt-2">{total.toFixed(2)} €</p>
          </div>

          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              {/* Test Mode Prefill Button */}
              {IS_TEST_MODE && (
                <button
                  type="button"
                  onClick={() => setShippingInfo(TEST_DATA)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-amber-100 text-amber-800 font-medium text-sm border border-amber-300 hover:bg-amber-200 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Izpolni testne podatke (DEV)
                </button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Ime *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.firstName}
                    onChange={(e) => updateShippingInfo('firstName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="Janez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Priimek *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.lastName}
                    onChange={(e) => updateShippingInfo('lastName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="Novak"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">E-pošta *</label>
                <input
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={(e) => updateShippingInfo('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                  placeholder="janez.novak@primer.si"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) => updateShippingInfo('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                  placeholder="+386 40 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Naslov *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => updateShippingInfo('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ulica 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Mesto *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => updateShippingInfo('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ljubljana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Poštna številka *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.postalCode}
                    onChange={(e) => updateShippingInfo('postalCode', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Država *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.country}
                  onChange={(e) => updateShippingInfo('country', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all bg-stone-50"
                  placeholder="Slovenija"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] bg-stone-900 hover:bg-stone-800"
              >
                Naprej na plačilo
              </button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-stone-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-stone-700 mb-2">Dostava na:</p>
                <p className="text-stone-900 font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p className="text-stone-600 text-sm">{shippingInfo.address}</p>
                <p className="text-stone-600 text-sm">{shippingInfo.postalCode} {shippingInfo.city}</p>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-gold-600 text-sm font-medium hover:underline mt-2"
                >
                  Uredi podatke
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-stone-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-medium text-stone-700 mb-3">Vaše naročilo:</p>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-stone-600">{item.name} × {item.quantity}</span>
                      <span className="text-stone-900 font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Ko kliknete "Nadaljuj na plačilo", boste preusmerjeni na varno Stripe plačilno stran.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !stripe}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
                  isProcessing ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'
                }`}
              >
                {isProcessing ? 'Preusmerjanje...' : `Nadaljuj na plačilo (${total.toFixed(2)} €)`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};