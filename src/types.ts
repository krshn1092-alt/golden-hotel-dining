export interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  img: string;
  category: 'all' | 'mains' | 'pizzas' | 'burgers' | 'pasta' | 'cocktails' | 'desserts';
  categoryLabel: string;
  isVeg?: boolean;
  isChefSpecial?: boolean;
  spicyLevel?: number; // 0-3
  calories?: string;
  prepTime?: string;
}

export interface CartItem {
  item: MenuItem;
  qty: number;
  instruction: string;
}

export type ViewType = 'menu' | 'cart' | 'order_placed' | 'admin';

export type PaymentMethod = 'table' | 'online' | 'upi' | 'card';

export interface StaffAlert {
  id: string;
  tableNo: string;
  type: 'Waiter' | 'Bill';
  time: string;
  note?: string;
  timestamp: number;
}

export interface OrderRecord {
  id: string;
  table: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  placedAt: Date;
  status: 'received' | 'preparing' | 'ready' | 'served';
  estimatedMinutes: number;
  completionTimestamp?: number;
}
