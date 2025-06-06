export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string; // Assuming Product.SKU is the id
  quantity: number;
  pricePerUnit: number; // Price at the time of order
}

export interface Order {
  id: string; // UUID
  userId: string; // Link to User.id (string version of User.id if User.id is number)
  items: OrderItem[];
  orderDate: string; // ISO date string
  status: OrderStatus;
  totalAmount: number; // Calculated from items
}
