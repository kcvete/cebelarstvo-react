import React from 'react';
import { Cookie, Info, ShieldCheck } from 'lucide-react';

const cookiePolicies = [
  {
    icon: Info,
    title: 'Kaj so piškotki?',
    body: `Ta politika piškotkov pojasnjuje, kaj so piškotki in kako jih uporabljamo, vrste piškotkov, ki jih uporabljamo,
    tj. informacije, ki jih zbiramo s piškotki, kako te informacije uporabljamo in kako upravljati nastavitve piškotkov.

Piškotki so majhne besedilne datoteke, ki se uporabljajo za shranjevanje majhnih delov informacij. Shranjeni so na vaši napravi,
ko se spletno mesto naloži v vašem brskalniku. Ti piškotki nam pomagajo, da spletna stran deluje pravilno, da je bolj varna,
da zagotavlja boljšo uporabniško izkušnjo in da razumemo, kako spletno mesto deluje ter kje so potrebne izboljšave.`
  },
  {
    icon: ShieldCheck,
    title: 'Kako uporabljamo piškotke?',
    body: `Tako kot večina spletnih storitev naše spletno mesto uporablja lastne in piškotke tretjih oseb za različne namene.
Lastni piškotki so večinoma potrebni za pravilno delovanje spletnega mesta in ne zbirajo nobenih vaših osebno prepoznavnih podatkov.

Piškotki tretjih oseb, ki jih uporabljamo na našem spletnem mestu, so predvsem za razumevanje, kako spletno mesto deluje,
kako komunicirate z našim spletnim mestom, za zagotavljanje varnosti naših storitev, za prikazovanje oglasov, ki so za vas relevantni,
ter za zagotavljanje boljše in izboljšane uporabniške izkušnje ter hitrejše interakcije z našim spletnim mestom v prihodnosti.`
  }
];

const firstPartyCookies = [
  {
    name: 'goldendrop_email_popup',
    purpose: 'Shrani odločitev obiskovalca glede pop-upa za newsletter (prijava ali zavrnitev), da se okno ne prikazuje pri vsakem obisku.',
    duration: '365 dni',
    type: 'Funkcionalni / obvezni'
  }
];

export const Cookies: React.FC = () => {
  return (
    <div className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-4 py-1 text-sm font-semibold">
            <Cookie className="w-4 h-4" />
            Piškotki
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-stone-900">Politika piškotkov</h1>
          <p className="mt-4 text-stone-600 max-w-3xl mx-auto">
            Ta stran opisuje, katere piškotke uporabljamo na spletni strani Čebelarstvo Tomaž ter kako lahko upravljate svoje nastavitve.
          </p>
        </div>

        <div className="space-y-10">
          {cookiePolicies.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
              </div>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">Katere piškotke uporabljamo?</h3>
          <p className="text-stone-600 mb-6">
            Trenutno uporabljamo minimalno število piškotkov. Spodnja tabela opisuje vsak piškotek, njegov namen in dobo shranjevanja.
          </p>

          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-100 text-stone-600 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3">Ime piškotka</th>
                  <th className="px-6 py-3">Namen</th>
                  <th className="px-6 py-3">Čas shranjevanja</th>
                  <th className="px-6 py-3">Tip</th>
                </tr>
              </thead>
              <tbody>
                {firstPartyCookies.map(cookie => (
                  <tr key={cookie.name} className="border-t border-stone-100">
                    <td className="px-6 py-4 font-semibold text-stone-900">{cookie.name}</td>
                    <td className="px-6 py-4 text-stone-600">{cookie.purpose}</td>
                    <td className="px-6 py-4 text-stone-600">{cookie.duration}</td>
                    <td className="px-6 py-4 text-stone-600">{cookie.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white border border-stone-200 p-8">
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Upravljanje nastavitev</h3>
          <p className="text-stone-600">
            Nastavitve piškotkov lahko kadarkoli urejate v svojem brskalniku. Večina modernih brskalnikov omogoča brisanje,
            blokiranje ali prejemanje obvestil, ko so piškotki poslani na vašo napravo. Če piškotke onemogočite, lahko to vpliva
            na delovanje nekaterih funkcionalnosti (npr. pojavnost pop-upa za newsletter). Za dodatna vprašanja nam pišite na
            info@cebelarstvo-tomaz.si.
          </p>
        </div>
      </div>
    </div>
  );
};
