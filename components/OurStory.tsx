import React from 'react';
import { Heart, Leaf, Award, Users, MapPin, Calendar } from 'lucide-react';

interface OurStoryProps {
  onShopClick: () => void;
}

export const OurStory: React.FC<OurStoryProps> = ({ onShopClick }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-stone-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-stone-900 font-serif sm:text-5xl mb-6">
                Naša zgodba
              </h1>
              <p className="text-xl text-stone-600 leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
              </p>
              <div className="flex items-center gap-4 text-stone-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-600" />
                  <span>Vipavska dolina</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-600" />
                  <span>Od leta 2010</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800"
                alt="Čebelar pri delu z panji"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold-500 text-white p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm">let tradicije</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 font-serif sm:text-4xl mb-4">
              Naše vrednote
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-stone-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Strast do čebelarstva</h3>
              <p className="text-stone-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>

            <div className="text-center p-8 bg-stone-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Trajnostno čebelarjenje</h3>
              <p className="text-stone-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>

            <div className="text-center p-8 bg-stone-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Vrhunska kakovost</h3>
              <p className="text-stone-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 bg-gold-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 font-serif sm:text-4xl mb-4">
              Naša pot
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Od prvih panjev do danes - zgodba Čebelarstva Tomaž.
            </p>
          </div>

          <div className="space-y-12">
            {/* Timeline Item 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600"
                  alt="Začetki čebelarstva"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <div className="inline-block bg-gold-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  2010
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">Začetek zgodbe</h3>
                <p className="text-stone-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=600"
                  alt="Širitev čebelarstva"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <div className="inline-block bg-gold-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  2015
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">Širitev na Banjško planoto</h3>
                <p className="text-stone-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1607371928034-ca00d8c52aaf?auto=format&fit=crop&q=80&w=600"
                  alt="Spletna trgovina"
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <div className="inline-block bg-gold-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  2023
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">Spletna trgovina</h3>
                <p className="text-stone-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Family Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 font-serif sm:text-4xl mb-6">
                Družinsko čebelarstvo
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gold-600" />
                  <span className="text-stone-700 font-medium">Družinska tradicija</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1568526381923-caf3fd520382?auto=format&fit=crop&q=80&w=400"
                alt="Družinsko čebelarstvo"
                className="rounded-xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400"
                alt="Naši panji"
                className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"
                alt="Pridelava medu"
                className="rounded-xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&q=80&w=400"
                alt="Naraven med"
                className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-serif sm:text-4xl mb-6">
            Poskusite naš med
          </h2>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto mb-8">
            Odkrijte okus Vipavske doline in Banjške planote. 100% naraven, nefiltriran med, direktno od našega čebelarstva do vaše mize.
          </p>
          <button
            onClick={onShopClick}
            className="bg-gold-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Obiščite trgovino
          </button>
        </div>
      </section>
    </div>
  );
};
