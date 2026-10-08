export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  is_active?: boolean;
}
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  is_active?: boolean;
  avg_rating?: number;
  total_ratings?: number;
}