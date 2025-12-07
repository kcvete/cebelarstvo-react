import React from 'react';
import { ScrollText, ShieldCheck, Package, RefreshCcw, Lock } from 'lucide-react';

const sections = [
  {
    icon: ScrollText,
    title: '1. Splošne določbe',
    body: `Trgovina Čebelarstvo Tomaž deluje v skladu z zakonodajo Republike Slovenije. Spletna stran in
    vsebine so namenjene predstavitvi izdelkov našega čebelarstva ter omogočanju spletnega naročanja.
    Z uporabo strani soglašate s spodaj navedenimi pogoji.`
  },
  {
    icon: ShieldCheck,
    title: '2. Varstvo podatkov',
    body: `Podatke, posredovane preko naročil in kontaktnega obrazca, uporabljamo izključno za obdelavo naročil,
    pripravo ponudb in komunikacijo s strankami. Vaših podatkov nikoli ne posredujemo tretjim osebam, razen če
    to zahteva zakon. Za pošiljanje obvestil uporabljamo platformo Brevo (Sendinblue).`
  },
  {
    icon: Package,
    title: '3. Dostava in plačila',
    body: `Naročila odposlano v 2–4 delovnih dneh po prejemu plačila. Poštnina se obračuna glede na skupno težo
    proizvoda in je vidna ob zaključku nakupa. Plačilo je možno s karticami preko Stripe ali po predračunu.
    Kupcu pripada račun v elektronski obliki.`
  },
  {
    icon: RefreshCcw,
    title: '4. Reklamacije in vračila',
    body: `Kupec lahko izdelek vrne v 14 dneh od prejema, če je neodprt in nepoškodovan. Reklamacije zaradi
    poškodb ob dostavi uredimo, če nas obvestite najkasneje v 48 urah s fotografijami poškodbe. Stroške povratne
    pošiljke krije kupec, razen v primeru naše napake.`
  },
  {
    icon: Lock,
    title: '5. Politika zasebnosti in piškotki',
    body: `Osebne podatke shranjujemo v šifriranih sistemih in jih hranimo toliko časa, kolikor je potrebno za izvedbo naročila,
    komunikacijo ali izpolnjevanje zakonskih zahtev. Piškotke uporabljamo za osnovno delovanje strani in anonimno analitiko obiskov.
    Nastavitve piškotkov lahko kadarkoli spremenite v brskalniku, od prejemanja obvestil se lahko odjavite preko povezave v e-pošti.`
  }
];

export const Terms: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-600">Pogoji poslovanja</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-4">
            Splošni pogoji uporabe in nakupa
          </h1>
          <p className="mt-4 text-stone-600 max-w-3xl mx-auto">
            Dokument ureja pravice in obveznosti kupcev ter upravljavca spletne trgovine Čebelarstvo Tomaž.
            Priporočamo, da si pogoje preberete pred oddajo naročila. V primeru vprašanj smo vam na voljo preko
            e-pošte info@cebelarstvo-tomaz.si.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8 shadow-sm">
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

        <div className="mt-14 rounded-3xl bg-stone-900 text-white p-8 sm:p-10">
          <h3 className="text-2xl font-serif font-bold mb-4">Kontakt za pritožbe in vprašanja</h3>
          <p className="text-stone-200 mb-6">
            Nosilec dejavnosti: Čebelarstvo Tomaž, Banjška planota 123, 5250 Solkan, Slovenija
            <br />Davčna številka: SI12345678 (nismo zavezanci za DDV)
          </p>
          <p className="text-sm text-stone-300">
            Zadnja posodobitev: {new Date().toLocaleDateString('sl-SI', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};
