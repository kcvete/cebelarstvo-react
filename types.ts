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

export type ViewState = 'home' | 'checkout' | 'success';