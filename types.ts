
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export enum Currency {
  USD = 'USD',
  NGN = 'NGN',
  GHS = 'GHS',
  KES = 'KES'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: Currency;
  image: string;
  stock: number;
  featured: boolean;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  currency: Currency;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED';
  date: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface StoreProfile {
  name: string;
  logo: string;
  currency: Currency;
  address: string;
  whatsapp: string;
}
