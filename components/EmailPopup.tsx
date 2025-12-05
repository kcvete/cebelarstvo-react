import React, { useState, useEffect } from 'react';
import { X, Mail, Gift, Copy, Check } from 'lucide-react';

const COOKIE_NAME = 'goldendrop_email_popup';
const COOKIE_DAYS = 365;

// TODO: Replace with your actual Cloudflare Worker URL
const WORKER_URL = 'YOUR_CLOUDFLARE_WORKER_URL_HERE';

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

export const EmailPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    // TESTING MODE: Always show popup (remove this line for production)
    const TESTING = true;
    
    // Check cookie status
    const popupStatus = getCookie(COOKIE_NAME);
    
    // Only show if not permanently dismissed (subscribed or declined)
    if (TESTING || (popupStatus !== 'subscribed' && popupStatus !== 'no_discount')) {
      // Show popup after 3 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // X button - just close, will show again next visit
  const handleClose = () => {
    setIsVisible(false);
    // No cookie set - will show again on next visit
  };

  // "I don't want a discount" - permanently dismiss
  const handleDecline = () => {
    setIsVisible(false);
    setCookie(COOKIE_NAME, 'no_discount', COOKIE_DAYS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Vnesite veljaven e-naslov');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to Cloudflare Worker -> Brevo
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prišlo je do napake');
      }

      // Also store locally as backup
      const subscribers = JSON.parse(localStorage.getItem('goldendrop_subscribers') || '[]');
      subscribers.push({ email, date: new Date().toISOString() });
      localStorage.setItem('goldendrop_subscribers', JSON.stringify(subscribers));

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Set cookie so popup doesn't show again
      setCookie(COOKIE_NAME, 'subscribed', COOKIE_DAYS);

      // Show jar animation, then reveal code
      setTimeout(() => {
        setShowCode(true);
      }, 3500);

    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'Prišlo je do napake. Poskusite znova.');
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText('MED10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fadeIn"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto animate-slideUp relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors z-10"
            aria-label="Zapri"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <>
              {/* Header Image/Gradient */}
              <div className="relative h-32 bg-gradient-to-br from-amber-400 via-gold-500 to-amber-600 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 text-6xl">🍯</div>
                  <div className="absolute bottom-4 right-8 text-4xl">🐝</div>
                </div>
                <div className="relative bg-white rounded-full p-4 shadow-lg">
                  <Gift className="w-10 h-10 text-gold-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <div className="inline-block bg-gold-100 text-gold-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                  EKSKLUZIVNA PONUDBA
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 mb-3">
                  Prejmite 10% popust
                </h2>
                
                <p className="text-stone-600 mb-6">
                  Pridružite se naši medeni družini in prejmite 10% popust na vaše prvo naročilo ter ekskluzivne novice o novih produktih.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Vaš e-naslov"
                      className="w-full pl-12 pr-4 py-3.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-stone-900 placeholder:text-stone-400"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Pošiljam...
                      </>
                    ) : (
                      'Pridobi 10% popust'
                    )}
                  </button>
                </form>

                <p className="text-xs text-stone-400 mt-4">
                  S prijavo se strinjate s prejemanjem občasnih novic. Odjava je možna kadarkoli.
                </p>

                {/* Decline link - less visible */}
                <button
                  onClick={handleDecline}
                  className="mt-4 text-xs text-stone-400 hover:text-stone-500 underline underline-offset-2 transition-colors"
                >
                  Ne želim popusta
                </button>
              </div>
            </>
          ) : (
            /* Success State with Honey Jar Animation */
            <div className="p-8 text-center relative overflow-hidden">
              {/* Close button for success state */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 transition-colors z-10"
                aria-label="Zapri"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Flying Bees */}
              <div className="bee bee-1">🐝</div>
              <div className="bee bee-2">🐝</div>
              <div className="bee bee-3">🐝</div>
              <div className="bee bee-4">🐝</div>
              <div className="bee bee-5">🐝</div>

              {/* Honey Jar Animation */}
              <div className="relative h-48 flex items-center justify-center mb-6">
                {/* Jar */}
                <div className="honey-jar relative">
                  {/* Lid */}
                  <div className={`jar-lid absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-lg transition-all duration-700 ${showCode ? 'lid-open' : ''}`}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-amber-900 rounded-sm"></div>
                  </div>
                  
                  {/* Jar Body */}
                  <div className="w-24 h-28 bg-gradient-to-b from-amber-200/80 to-amber-400/80 rounded-b-3xl rounded-t-lg border-4 border-amber-300/50 relative overflow-hidden shadow-lg">
                    {/* Honey inside */}
                    <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 rounded-b-2xl">
                      {/* Honey shine */}
                      <div className="absolute top-2 left-2 w-3 h-8 bg-amber-200/50 rounded-full rotate-12"></div>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-cream-100 rounded border border-amber-600/30 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-amber-800">MED</span>
                    </div>
                  </div>

                  {/* Magic sparkles when opening */}
                  {showCode && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                      <div className="sparkle sparkle-1">✨</div>
                      <div className="sparkle sparkle-2">⭐</div>
                      <div className="sparkle sparkle-3">✨</div>
                      <div className="sparkle sparkle-4">🍯</div>
                      <div className="sparkle sparkle-5">⭐</div>
                    </div>
                  )}
                </div>

                {/* Code floating out of jar */}
                {showCode && (
                  <div className="code-reveal absolute top-0 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-400 rounded-xl py-2 px-4 shadow-lg">
                      <span className="text-lg font-bold text-amber-700">MED10</span>
                    </div>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold font-serif text-stone-900 mb-3">
                {showCode ? 'Vaš popust je pripravljen!' : 'Pripravljamo vaš popust...'}
              </h2>
              
              {showCode ? (
                <>
                  <p className="text-stone-600 mb-4">
                    Vaša ekskluzivna koda za 10% popust:
                  </p>
                  
                  <div className="bg-amber-50 border-2 border-dashed border-gold-400 rounded-xl py-4 px-6 mb-6 flex items-center justify-center gap-3">
                    <code className="text-2xl font-bold text-gold-700 tracking-wider">MED10</code>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-amber-100 rounded-lg transition-colors group"
                      title="Kopiraj kodo"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-amber-600 group-hover:text-amber-800" />
                      )}
                    </button>
                  </div>
                  
                  {copied && (
                    <p className="text-green-600 text-sm mb-4 animate-fadeIn">
                      ✓ Koda kopirana!
                    </p>
                  )}
                  
                  <p className="text-sm text-stone-500">
                    Uporabite kodo ob zaključku nakupa.
                  </p>
                </>
              ) : (
                <p className="text-stone-500">
                  Odpiramo kozarec medu...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        /* Honey Jar Animations */
        .honey-jar {
          animation: jarWiggle 1s ease-in-out 0.5s, jarFloat 2s ease-in-out infinite 1.5s;
        }
        
        @keyframes jarWiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          60% { transform: rotate(-5deg); }
          80% { transform: rotate(5deg); }
        }

        @keyframes jarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .jar-lid {
          transform-origin: left bottom;
          transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .lid-open {
          transform: translateX(-50%) rotate(-60deg) translateY(-20px);
        }

        /* Flying Bees */
        .bee {
          position: absolute;
          font-size: 24px;
          z-index: 5;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .bee-1 {
          top: 20%;
          animation: beeFly1 4s ease-in-out infinite;
        }
        .bee-2 {
          top: 40%;
          animation: beeFly2 5s ease-in-out infinite 0.5s;
        }
        .bee-3 {
          top: 60%;
          animation: beeFly3 4.5s ease-in-out infinite 1s;
        }
        .bee-4 {
          top: 30%;
          animation: beeFly4 6s ease-in-out infinite 0.3s;
        }
        .bee-5 {
          top: 70%;
          animation: beeFly5 5.5s ease-in-out infinite 1.5s;
        }

        @keyframes beeFly1 {
          0% { left: -30px; transform: translateY(0) scaleX(1); }
          45% { transform: translateY(-15px) scaleX(1); }
          50% { left: calc(100% + 30px); transform: translateY(-10px) scaleX(1); }
          51% { transform: scaleX(-1); }
          95% { transform: translateY(10px) scaleX(-1); }
          100% { left: -30px; transform: translateY(0) scaleX(-1); }
        }

        @keyframes beeFly2 {
          0% { right: -30px; left: auto; transform: translateY(0) scaleX(-1); }
          45% { transform: translateY(20px) scaleX(-1); }
          50% { right: calc(100% + 30px); transform: translateY(15px) scaleX(-1); }
          51% { transform: scaleX(1); }
          95% { transform: translateY(-15px) scaleX(1); }
          100% { right: -30px; transform: translateY(0) scaleX(1); }
        }

        @keyframes beeFly3 {
          0% { left: -30px; transform: translateY(0) scaleX(1) rotate(-5deg); }
          25% { transform: translateY(-25px) scaleX(1) rotate(5deg); }
          50% { left: calc(100% + 30px); transform: translateY(-10px) scaleX(1) rotate(-5deg); }
          51% { transform: scaleX(-1) rotate(5deg); }
          75% { transform: translateY(20px) scaleX(-1) rotate(-5deg); }
          100% { left: -30px; transform: translateY(0) scaleX(-1) rotate(5deg); }
        }

        @keyframes beeFly4 {
          0%, 100% { left: 20%; top: 25%; }
          25% { left: 70%; top: 35%; }
          50% { left: 80%; top: 55%; }
          75% { left: 30%; top: 45%; }
        }

        @keyframes beeFly5 {
          0%, 100% { right: 10%; top: 65%; transform: scaleX(-1); }
          33% { right: 60%; top: 75%; }
          66% { right: 80%; top: 50%; }
        }

        /* Sparkles */
        .sparkle {
          position: absolute;
          font-size: 24px;
          animation: sparkleFloat 2s ease-out forwards;
        }

        .sparkle-1 { left: -30px; animation-delay: 0s; }
        .sparkle-2 { left: -10px; animation-delay: 0.2s; }
        .sparkle-3 { left: 10px; animation-delay: 0.1s; }
        .sparkle-4 { left: 30px; animation-delay: 0.3s; }
        .sparkle-5 { left: 0px; animation-delay: 0.4s; }

        @keyframes sparkleFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.5) rotate(360deg);
          }
        }

        /* Code reveal animation */
        .code-reveal {
          animation: codeFloat 1.2s ease-out forwards;
        }

        @keyframes codeFloat {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(60px) scale(0.3);
          }
          40% {
            opacity: 1;
            transform: translateX(-50%) translateY(-20px) scale(1.15);
          }
          70% {
            transform: translateX(-50%) translateY(5px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};
