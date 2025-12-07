export enum HoneyWeight {
  G250 = 250,
  G450 = 450,
  G900 = 900,
}

export interface ProductWeightOption {
  weight: HoneyWeight;
  label: string;
  price: number;
  priceId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Base price for default (900 g) jar
  previousPrice?: number;
  description: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  soldOut?: boolean;
  priceId?: string; // Default Stripe Price ID (900 g)
  weights?: ProductWeightOption[];
  defaultWeight?: HoneyWeight;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight: HoneyWeight;
  weightLabel: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export type ViewState =
  | 'home'
  | 'checkout'
  | 'success'
  | 'story'
  | 'blog'
  | 'blogPost'
  | 'contact'
  | 'terms'
  | 'cookies';