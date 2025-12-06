import { Product, HoneyWeight } from './types';

const DEFAULT_WEIGHT = HoneyWeight.G900;
const WEIGHT_ORDER: HoneyWeight[] = [HoneyWeight.G900, HoneyWeight.G450, HoneyWeight.G250];

const formatWeightLabel = (weight: HoneyWeight) => `${weight} g`;

const roundPrice = (value: number) => Number(value.toFixed(2));

const buildWeightOptions = (
  basePrice: number,
  priceIds: Partial<Record<HoneyWeight, string>> = {}
) =>
  WEIGHT_ORDER.map(weight => ({
    weight,
    label: formatWeightLabel(weight),
    price: roundPrice(basePrice * (weight / DEFAULT_WEIGHT)),
    priceId: priceIds[weight]
  }));

export const SITE_NAME = 'Čebelarstvo Tomaž';
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
      priceId: 'price_1SWOBhI5iqAVuGDVcHriXpGk', // 900 g Stripe Price ID
      defaultWeight: HoneyWeight.G900,
      weights: buildWeightOptions(12, {
        [HoneyWeight.G900]: 'price_1SWOBhI5iqAVuGDVcHriXpGk',
        [HoneyWeight.G450]: 'price_cvetlicni_450', // TODO: replace with actual Stripe Price ID
        [HoneyWeight.G250]: 'price_cvetlicni_250' // TODO: replace with actual Stripe Price ID
      })
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
      priceId: 'price_1SWMxhI5iqAVuGDVZixLNmLi',
      defaultWeight: HoneyWeight.G900,
      weights: buildWeightOptions(12, {
        [HoneyWeight.G900]: 'price_1SWMxhI5iqAVuGDVZixLNmLi',
        [HoneyWeight.G450]: 'price_lipov_450', // TODO: replace with actual Stripe Price ID
        [HoneyWeight.G250]: 'price_lipov_250' // TODO: replace with actual Stripe Price ID
      })
    },
    {
      id: 'hojev',
      name: 'Hojev med',
      price: 15.00,
      description: 'Hojev med je znan po svoji intenzivni aromi in temni barvi. Trenutno ni na zalogi.',
      image: './hojev-store.png',
      tags: ['Hoja', 'Intenziven', 'Slovenski', 'Ni na zalogi'],
      rating: 4.7,
      reviews: 85,
      soldOut: false,
      priceId: 'price_hojev_med',
      defaultWeight: HoneyWeight.G900,
      weights: buildWeightOptions(15, {
        [HoneyWeight.G900]: 'price_hojev_med',
        [HoneyWeight.G450]: 'price_hojev_450', // TODO: replace
        [HoneyWeight.G250]: 'price_hojev_250' // TODO: replace
      })
    },
        {
      id: 'satje',
      name: 'Satje v medu',
      price: 7.00,
      description: 'Hojev med je znan po svoji intenzivni aromi in temni barvi. Trenutno ni na zalogi.',
      image: './satje.png',
      tags: ['Satje', 'Intenziven', 'Slovenski', 'Ni na zalogi'],
      rating: 4.7,
      reviews: 85,
      soldOut: false,
      priceId: 'price_satje_v_medu',
      defaultWeight: HoneyWeight.G900,
      weights: buildWeightOptions(7, {
        [HoneyWeight.G900]: 'price_satje_v_medu',
        [HoneyWeight.G450]: 'price_satje_450',
        [HoneyWeight.G250]: 'price_satje_250'
      })
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

export const BLOG_POSTS = [
  {
    id: 'zdravilne-lastnosti-medu',
    title: 'Zdravilne lastnosti slovenskega medu',
    excerpt: 'Odkrijte, zakaj je slovenski med eden najboljših na svetu in kakšne zdravstvene koristi prinaša redno uživanje tega zlatega zaklada.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <h2>Naravna moč medu</h2>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
      
      <blockquote>"Med ni samo sladilo – je naravno zdravilo, ki ga uporabljamo že tisočletja."</blockquote>
      
      <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      
      <h2>Antibakterijske lastnosti</h2>
      <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
      
      <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus.</p>
    `,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    category: 'Zdravje',
    author: 'Tomaž Čebelar',
    date: '28. nov. 2025',
    readTime: '5 min branja'
  },
  {
    id: 'kako-prepoznati-pravi-med',
    title: 'Kako prepoznati pravi domači med',
    excerpt: 'Naučite se razlikovati med pravim domačim medom in industrijskimi ponaredki. Preprosti triki za preverjanje kakovosti.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, vitae aliquam nisl nisl sit amet nisl. Sed euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc.</p>
      
      <h2>Videz in tekstura</h2>
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.</p>
      
      <h2>Test s palcem</h2>
      <p>Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum.</p>
      
      <blockquote>"Pravi med se nikoli popolnoma ne razpusti v hladni vodi – to je eden najboljših testov."</blockquote>
      
      <h2>Kristalizacija</h2>
      <p>Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi.</p>
      
      <p>Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue.</p>
    `,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
    category: 'Nasveti',
    author: 'Tomaž Čebelar',
    date: '15. nov. 2025',
    readTime: '4 min branja'
  },
  {
    id: 'zivljenje-cebel-skozi-leto',
    title: 'Življenje čebel skozi letne čase',
    excerpt: 'Spremljajte fascinantno potovanje čebelje družine skozi vse štiri letne čase in odkrijte, kako nastaja vaš najljubši med.',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lobortis nisl eget ultricies tincidunt. Fusce vehicula dolor arcu, sit amet blandit dolor molestie at. Sed a lorem a nibh elementum vehicula.</p>
      
      <h2>Pomlad – novi začetki</h2>
      <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
      
      <h2>Poletje – čas obilja</h2>
      <p>Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras justo odio, dapibus ac facilisis in.</p>
      
      <blockquote>"Ena čebela v svojem življenju proizvede le približno dvanajstino čajne žličke medu – zato cenite vsako kapljico!"</blockquote>
      
      <h2>Jesen – priprave na zimo</h2>
      <p>Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim sodales.</p>
      
      <h2>Zima – mirovanje</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
    `,
    image: 'https://images.unsplash.com/photo-1552960366-ff90ce30a68f?auto=format&fit=crop&q=80&w=800',
    category: 'Čebelarstvo',
    author: 'Tomaž Čebelar',
    date: '3. nov. 2025',
    readTime: '6 min branja'
  }
];