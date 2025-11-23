import { Product } from './types';

export const STRIPE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';

export const PRODUCTS: Product[] = [
    {
      id: 'cvetlicni',
      name: 'Cvetlični med',
      price: 12.00,
      description: 'Naravni slovenski cvetlični med, pridelan iz nektarja različnih cvetov. Blag, aromatičen in vsestransko uporaben.',
      image: '/cvetlicni.png',
      tags: ['Naravni', 'Aromatičen', 'Slovenski'],
      rating: 4.9,
      reviews: 128,
      priceId: 'price_1SWOBhI5iqAVuGDVcHriXpGk' // Replace with your actual Stripe Price ID
    },
    {
      id: 'lipov',
      name: 'Lipov med',
      price: 12.00,
      previousPrice: 14.00,
      description: 'Med iz cvetov lipe, značilno svežega okusa z blagimi mentolnimi notami. Odličen za čaj in pomiritev.',
      image: '/Lipov-store.jpg',
      tags: ['Lipa', 'Svež', 'Slovenski'],
      rating: 4.8,
      reviews: 210,
      priceId: 'price_1SWMxhI5iqAVuGDVZixLNmLi' // Replace with your actual Stripe Price ID
    },
    {
      id: 'hojev',
      name: 'Hojev med',
      price: 15.00,
      description: 'Hojev med je znan po svoji intenzivni aromi in temni barvi. Trenutno ni na zalogi.',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
      tags: ['Hoja', 'Intenziven', 'Slovenski', 'Ni na zalogi'],
      rating: 4.7,
      reviews: 85,
      soldOut: true,
      priceId: 'price_hojev_med' // Replace with your actual Stripe Price ID
    }
  ];

export const TESTIMONIALS = [
  {
    text: "Najboljši med, kar sem jih kdaj poskusila. Cvetlični med me spomni na babičin vrt.",
    author: "Sara Novak",
    role: "Potrjen kupec"
  },
  {
    text: "Dostava je bila izjemno hitra, embalaža pa čudovita. Pikanten med je popolnoma spremenil mojo pico!",
    author: "Marko Čern",
    role: "Kuhar"
  }
];