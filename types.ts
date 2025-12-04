export interface Product {
  id: string;
  name: string;
  price: number;
  previousPrice?: number;
  description: string;
  image: string;
  tags: string[];
  rating: number;
  reviews: number;
  soldOut?: boolean;
  priceId?: string; // Stripe Price ID for Checkout Sessions
}

export interface CartItem extends Product {
  quantity: number;
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

export type ViewState = 'home' | 'checkout' | 'success' | 'story' | 'blog' | 'blogPost';