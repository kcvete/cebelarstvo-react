import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, X, Trash2, Menu, Github, Twitter, CheckCircle, Filter } from 'lucide-react';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CheckoutForm } from './components/CheckoutForm';
import { HoneySommelier } from './components/HoneySommelier';
import { PRODUCTS, TESTIMONIALS } from './constants';
import { CartItem, Product, ViewState } from './types';

// Helper icon for testimonials - Defined outside to correctly type props including key support in JSX
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-gold-500 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Persistent Cart
  useEffect(() => {
    const savedCart = localStorage.getItem('goldenDropCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goldenDropCart', JSON.stringify(cart));
  }, [cart]);

  // Filtering Logic
  const allTags = useMemo(() => {
    return Array.from(new Set(PRODUCTS.flatMap(p => p.tags))).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedTags.length === 0) return PRODUCTS;
    return PRODUCTS.filter(product =>
      // Show product if it matches ANY of the selected tags
      product.tags.some(tag => selectedTags.includes(tag))
    );
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const handleCheckoutSuccess = () => {
    setCart([]);
    setView('success');
    window.scrollTo(0, 0);
  };

  const scrollToProducts = () => {
    const element = document.getElementById('shop-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- RENDER HELPERS ---

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <span className="text-2xl">🍯</span>
          <h1 className="text-xl font-bold font-serif text-stone-900">GoldenDrop</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-stone-600">
            <button onClick={() => { setView('home'); setTimeout(scrollToProducts, 100); }} className="hover:text-gold-600 transition-colors">Trgovina</button>
            <button className="hover:text-gold-600 transition-colors">Naša zgodba</button>
            <button className="hover:text-gold-600 transition-colors">Blog</button>
          </nav>

          <button
            className="relative p-2 text-stone-600 hover:text-gold-600 transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🍯</span>
                    <h2 className="text-xl font-bold font-serif text-white">GoldenDrop</h2>
                </div>
                <p className="text-sm leading-relaxed text-stone-400">
                    Delivering the purest, ethically harvested honey straight from the hive to your home. 
                </p>
            </div>
            <div>
                <h3 className="text-white font-bold mb-4">Shop</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-gold-500">Raw Honey</a></li>
                    <li><a href="#" className="hover:text-gold-500">Manuka</a></li>
                    <li><a href="#" className="hover:text-gold-500">Gift Sets</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-gold-500">About Us</a></li>
                    <li><a href="#" className="hover:text-gold-500">Sustainability</a></li>
                    <li><a href="#" className="hover:text-gold-500">Contact</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold mb-4">Connect</h3>
                <div className="flex gap-4">
                    <Github className="w-5 h-5 hover:text-gold-500 cursor-pointer" />
                    <Twitter className="w-5 h-5 hover:text-gold-500 cursor-pointer" />
                </div>
            </div>
        </div>
    </footer>
  );

  const renderCartDrawer = () => (
    <div className={`fixed inset-0 z-[60] ${isCartOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-lg font-bold font-serif text-stone-900">Vaša košarica ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-900">Košarica je prazna</h3>
              <p className="text-stone-500 max-w-xs">Izgleda, da še niste dodali nobene sladkosti v svoje življenje.</p>
              <button 
                onClick={() => { setIsCartOpen(false); scrollToProducts(); }}
                className="mt-4 text-gold-600 font-bold hover:text-gold-700"
              >
                Začni nakup
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="font-bold text-gold-700">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                  <p className="text-sm text-stone-500">{item.tags[0]}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                        <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-1 hover:bg-stone-50 text-stone-600"
                        >-</button>
                        <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 hover:bg-stone-50 text-stone-600"
                        >+</button>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-stone-50 border-t border-stone-100">
            <div className="flex justify-between mb-4">
              <span className="text-stone-600">Vmesni znesek</span>
              <span className="font-bold text-xl text-stone-900">{cartTotal.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-stone-500 mb-4 text-center">Poštnina in davki se izračunajo pri zaključku nakupa</p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setView('checkout');
              }}
              className="w-full bg-stone-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Zaključi nakup
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      <Hero scrollToShop={scrollToProducts} />
      
      {/* Social Proof / Trust Bar */}
      <section className="bg-stone-900 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-80">
            <div className="flex items-center gap-3">
                <CheckCircle className="text-gold-500 w-6 h-6" />
                <span className="font-medium">100% Surov in neﬁltriran</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-gold-500 w-6 h-6" />
                <span className="font-medium">Trajnostno čebelarjenje</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-gold-500 w-6 h-6" />
                <span className="font-medium">Brezplačna poštnina nad 50 €</span>
            </div>
            <div className="flex items-center gap-3">
                <CheckCircle className="text-gold-500 w-6 h-6" />
                <span className="font-medium">Testirano po serijah</span>
            </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shop-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-stone-900 font-serif sm:text-4xl">
            Pridelano iz srca narave
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Izberite med našo ponudbo vrhunskih, etično pridelanih medov. Vsak kozarec pripoveduje zgodbo svojega izvora.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
                onClick={() => setSelectedTags([])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTags.length === 0
                        ? 'bg-stone-900 text-white shadow-md'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-gold-400 hover:text-gold-600'
                }`}
            >
                Vsi izdelki
            </button>
            {allTags.map(tag => (
                <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                            ? 'bg-gold-500 text-white shadow-md'
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-gold-400 hover:text-gold-600'
                    }`}
                >
                    {tag}
                </button>
            ))}
        </div>

        {filteredProducts.length === 0 ? (
             <div className="text-center py-12">
                <p className="text-stone-500 text-lg">Ni medu s temi lastnostmi.</p>
                <button onClick={() => setSelectedTags([])} className="mt-4 text-gold-600 font-medium hover:underline">
                    Počisti filtre
                </button>
             </div>
        ) : (
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
            </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gold-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gold-100">
                        <div className="flex text-gold-500 mb-4">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} filled />)}
                        </div>
                        <p className="text-stone-700 text-lg italic mb-6">"{t.text}"</p>
                        <div>
                            <p className="font-bold text-stone-900">{t.author}</p>
                            <p className="text-sm text-gold-600 uppercase tracking-wide font-medium">{t.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );

  const renderSuccess = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold font-serif text-stone-900 mb-4">Naročilo potrjeno!</h1>
        <p className="text-stone-500 max-w-md text-lg mb-8">
            Hvala za vaš nakup. Vaša zlata dobrota se pripravlja na pošiljanje. Potrdilo o nakupu je bilo poslano na vaš e-naslov.
        </p>
        <button 
            onClick={() => setView('home')}
            className="bg-stone-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors"
        >
            Nadaljuj z nakupovanjem
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-gold-200">
      {renderHeader()}
      
      <main>
        {view === 'home' && renderHome()}
        {view === 'checkout' && (
          <CheckoutForm 
            total={cartTotal} 
            onSuccess={handleCheckoutSuccess}
            onBack={() => setView('home')}
          />
        )}
        {view === 'success' && renderSuccess()}
      </main>

      {renderFooter()}
      {renderCartDrawer()}
      
      {/* Only show AI Chat on home page */}
      {view === 'home' && <HoneySommelier />}
    </div>
  );
}

export default App;