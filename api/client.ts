
import { StoreProfile, Product, Category, Order, User, Currency } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock Data
let mockProducts: Product[] = [
  { id: 'p1', name: 'V6 Cylinder Head', category: '1', price: 150000, currency: Currency.NGN, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400', stock: 12, featured: true, description: 'Genuine V6 cylinder head for high-performance engines. Optimized for heat dissipation and maximum torque throughput. Manufactured with aerospace-grade aluminum alloys for durability under extreme African road conditions.' },
  { id: 'p2', name: 'Brembo Sport Pads', category: '2', price: 45000, currency: Currency.NGN, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400', stock: 50, featured: true, description: 'High performance ceramic brake pads for superior stopping power and low dust. Designed for the discerning driver who demands safety without compromise.' },
  { id: 'p3', name: 'Coilover Suspension', category: '3', price: 285000, currency: Currency.NGN, image: 'https://images.unsplash.com/photo-1512428559083-a40ca990724d?auto=format&fit=crop&q=80&w=400', stock: 8, featured: false, description: 'Adjustable damping and ride height for precision handling. Transform your vehicle\'s stance and cornering ability with our premium coilover kit.' },
  { id: 'p4', name: 'Adaptive LED Kit', category: '4', price: 15000, currency: Currency.NGN, image: 'https://images.unsplash.com/photo-1598501479155-738914099436?auto=format&fit=crop&q=80&w=400', stock: 100, featured: true, description: 'Ultra bright 6000K LED bulbs with adaptive cooling technology. High-intensity discharge performance with the longevity of modern LED chips.' },
  { id: 'p5', name: 'Aerodynamic Grille', category: '5', price: 32000, currency: Currency.NGN, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400', stock: 15, featured: false, description: 'Carbon fiber finish front grille with improved airflow dynamics. Enhance both cooling efficiency and aggressive aesthetic styling.' },
];

let mockOrders: Order[] = [
  { id: 'ORD-1001', customerId: 'c1', customerName: 'Chidi Okoro', items: [{ productId: 'p1', name: 'V6 Cylinder Head', quantity: 1, price: 150000 }], total: 150000, currency: Currency.NGN, status: 'PAID', date: '2023-10-24T10:00:00Z' },
  { id: 'ORD-1002', customerId: 'c2', customerName: 'Fatima Musa', items: [{ productId: 'p2', name: 'Brake Pads', quantity: 2, price: 45000 }], total: 90000, currency: Currency.NGN, status: 'PENDING', date: '2023-10-25T14:30:00Z' },
];

export const apiClient = {
  getStoreProfile: async (): Promise<StoreProfile> => {
    await delay(500);
    return {
      name: "ComXStore Lagos",
      logo: "https://picsum.photos/seed/comx/200/200",
      currency: (localStorage.getItem('store_currency') as any) || Currency.NGN,
      address: "123 Marina, Lagos Island, Nigeria",
      whatsapp: "+2348000000000"
    };
  },

  getCategories: async (): Promise<Category[]> => {
    await delay(300);
    return [
      { id: '1', name: 'Powertrain', icon: '⚙️', count: 124 },
      { id: '2', name: 'Braking', icon: '🛑', count: 86 },
      { id: '3', name: 'Chassis', icon: '🚙', count: 45 },
      { id: '4', name: 'Illumination', icon: '💡', count: 210 },
      { id: '5', name: 'Aerodynamics', icon: '🌪️', count: 156 },
    ];
  },

  getProducts: async (categoryId?: string): Promise<Product[]> => {
    await delay(600);
    return categoryId && categoryId !== 'all' ? mockProducts.filter(p => p.category === categoryId) : mockProducts;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(400);
    return mockProducts.find(p => p.id === id);
  },

  toggleFeatured: async (productId: string) => {
    await delay(300);
    mockProducts = mockProducts.map(p => p.id === productId ? { ...p, featured: !p.featured } : p);
    return { success: true };
  },

  getOrders: async (): Promise<Order[]> => {
    await delay(400);
    return mockOrders;
  },

  getCustomers: async (): Promise<any[]> => {
    await delay(400);
    return [
      { id: 'c1', name: 'Chidi Okoro', phone: '+234801111111', totalSpent: 1500000, lastOrder: '2023-10-24' },
      { id: 'c2', name: 'Fatima Musa', phone: '+234802222222', totalSpent: 450000, lastOrder: '2023-10-25' },
    ];
  },

  createOrder: async (orderData: Partial<Order>) => {
    await delay(1500);
    const newOrder = {
      ...orderData,
      id: 'ORD-' + Math.floor(Math.random() * 9000 + 1000),
      date: new Date().toISOString(),
      status: 'PAID' as const
    } as Order;
    mockOrders = [newOrder, ...mockOrders];
    return { success: true, order: newOrder };
  },

  triggerWhatsAppAlert: async (phone: string, message: string) => {
    await delay(800);
    console.log(`n8n Trigger: Sending WhatsApp to ${phone} -> ${message}`);
    return { success: true };
  }
};
