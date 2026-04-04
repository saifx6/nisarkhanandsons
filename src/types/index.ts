export type UserRole = 'admin' | 'staff';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export type TileCategory = 'Floor Tile' | 'Wall Tile' | 'Border Tile' | 'Outdoor Tile' | 'Mosaic';
export type TileFinish = 'Matte' | 'Glossy' | 'Polished' | 'Textured' | 'Rustic';
export type TileUnit = 'Box' | 'Square Meter' | 'Piece';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  category: TileCategory | null;
  size: string | null;
  finish: TileFinish | null;
  color: string | null;
  unit: TileUnit;
  quantity_in_stock: number;
  low_stock_threshold: number;
  cost_price?: number; // Optional because staff won't see it
  selling_price: number;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductLog {
  id: string;
  product_id: string;
  changed_by: string;
  change_type: string;
  old_value: any;
  new_value: any;
  created_at: string;
  user_profiles?: Partial<UserProfile>;
}

export interface Sale {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount: number;
  created_by: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  products?: Partial<Product>;
}
