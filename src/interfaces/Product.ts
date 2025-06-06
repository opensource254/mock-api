export interface Product {
  SKU: string; // In JSON, it's SKU, assuming it's a unique identifier like id.
  title: string;
  type: string;
  description: string;
  filename: string;
  height: number;
  width: number;
  price: number;
  rating: number;
}
