// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Product interface
export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    price?: string;
    category?: Category;
    description?: string;
    image?: {
      url: string;
      imgix_url: string;
    };
    available?: boolean;
  };
}

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    icon?: string;
    order?: number;
    description?: string;
  };
}

// Order interface
export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    table_number?: string;
    items?: string; // JSON string of order items
    total_amount?: string;
    status?: OrderStatus;
    payment_method?: PaymentMethod;
    order_date?: string;
    notes?: string;
  };
}

// Table interface
export interface Table extends CosmicObject {
  type: 'tables';
  metadata: {
    capacity?: number;
    status?: TableStatus;
    current_order?: string;
  };
}

// Order item for cart
export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

// Type literals for select-dropdown values
export type OrderStatus = 'En préparation' | 'Servie' | 'Payée' | 'Annulée';
export type PaymentMethod = 'Espèces' | 'Carte bancaire' | 'Carte de crédit' | 'Chèque';
export type TableStatus = 'Libre' | 'Occupée' | 'Réservée';

// Statistics interfaces
export interface SalesStats {
  totalRevenue: number;
  orderCount: number;
  averageOrder: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guard for Product
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

// Type guard for Order
export function isOrder(obj: CosmicObject): obj is Order {
  return obj.type === 'orders';
}

// Type guard for Table
export function isTable(obj: CosmicObject): obj is Table {
  return obj.type === 'tables';
}