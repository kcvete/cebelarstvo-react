import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ||
  import.meta.env.VITE_ORDER_NOTIFICATION_EMAIL ||
  'info@cebelarstvo-tomaz.si';
const BREVO_SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'info@cebelarstvo-tomaz.si';
const BREVO_SENDER_NAME = import.meta.env.VITE_BREVO_SENDER_NAME || 'Čebelarstvo Tomaž';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

export const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Prosimo, izpolnite vsa obvezna polja (ime, e-pošta, sporočilo).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('idle');

    if (!validate()) return;

    if (!BREVO_API_KEY) {
      setError('Kontaktni obrazec trenutno ni na voljo. Pišite nam neposredno na info@cebelarstvo-tomaz.si.');
      return;
    }

    setIsSubmitting(true);

    const emailBody = `Nova kontaktna poizvedba z websitea\n\nIme: ${form.name}\nE-pošta: ${form.email}\nTelefon: ${form.phone || 'Ni naveden'}\n\nSporočilo:\n${form.message}`;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            email: BREVO_SENDER_EMAIL,
            name: BREVO_SENDER_NAME
          },
          replyTo: {
            email: form.email,
            name: form.name
          },
          to: [{ email: CONTACT_EMAIL }],
          subject: `[Spletni obrazec] Nova poizvedba - ${form.name}`,
          textContent: emailBody
        })
      });

      if (!response.ok) {
        const details = await response.text();
        console.error('Failed to send contact email', details);
        throw new Error('Pošiljanje ni uspelo. Poskusite znova.');
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prišlo je do napake. Poskusite znova malo kasneje.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gold-600 uppercase tracking-wider">Kontakt</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-3">
            Tu smo za vaša vprašanja
          </h1>
          <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
            Pokličite nas, pišite e-pošto ali izpolnite obrazec. Z veseljem vam pomagamo izbrati pravi med, pripravimo ponudbo
            za poslovna darila ali vas povabimo na obisk na Banjško planoto.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8">
              <div className="flex items-center gap-3 text-gold-600 text-sm font-semibold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-5 h-5" />
                Preverjen lokalni čebelar
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-stone-400 tracking-wide">Telefon</p>
                    <p className="text-lg font-semibold text-stone-900">+386 41 123 456 (Tomaž)</p>
                    <p className="text-stone-500 text-sm">Dosegljivi vsak dan med 9. in 18. uro.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-stone-400 tracking-wide">E-pošta</p>
                    <p className="text-lg font-semibold text-stone-900">info@cebelarstvo-tomaz.si</p>
                    <p className="text-stone-500 text-sm">Odgovorimo v roku 24 ur.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-stone-400 tracking-wide">Lokacija</p>
                    <p className="text-lg font-semibold text-stone-900">Banjška planota & Vipavska dolina</p>
                    <p className="text-stone-500 text-sm">Možen prevzem po dogovoru.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase text-stone-400 tracking-wide">Delovni čas</p>
                    <p className="text-lg font-semibold text-stone-900">Pon – Sob: 9.00 – 18.00</p>
                    <p className="text-stone-500 text-sm">Nedelje in prazniki po predhodnem dogovoru.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 text-white rounded-3xl p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gold-200 mb-4">Čebelarska tradicija</p>
              <h2 className="text-2xl font-serif font-bold mb-4">60 družin čebel, ena skupna zgodba</h2>
              <p className="text-stone-200 text-sm leading-relaxed">
                Na Banjški planoti in v Vipavski dolini skrbimo za več kot 60 čebeljih družin. Vsako leto pripravimo omejene serije
                cvetličnega, lipovega in hojevega medu ter izdelujemo satje. Če bi želeli obisk ali degustacijo, nam pišite – z veseljem
                odpremo vrata našega medenega sveta.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Pišite nam</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-stone-600">Ime in priimek *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  placeholder="Vaše ime"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-semibold text-stone-600">E-pošta *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  placeholder="ime@primer.si"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-stone-600">Telefon</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  placeholder="Neobvezno"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-semibold text-stone-600">Sporočilo *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-900 focus:border-gold-500 focus:bg-white focus:outline-none"
                  placeholder="Povejte nam, kaj vas zanima..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {status === 'success' && (
                <p className="text-sm text-green-600">Hvala! Sporočilo je bilo poslano. Odgovorimo vam v najkrajšem možnem času.</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-3.5 text-white font-semibold hover:bg-gold-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Pošiljam...' : 'Pošlji sporočilo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
