'use server';

import { z } from 'zod';
import { requireAdmin } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase-server';

// --- Zod Schemas ---
const productSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  brand: z.string().min(1).max(100),
  category: z.string().max(50),
  size: z.string().max(50),
  finish: z.string().max(50),
  color: z.string().max(50).optional(),
  unit: z.string().max(20),
  quantity_in_stock: z.number().min(0),
  low_stock_threshold: z.number().min(0),
  cost_price: z.number().min(0),
  selling_price: z.number().min(0),
  description: z.string().max(1000).optional(),
}).strict();

const adjustStockSchema = z.object({
  productId: z.string().uuid(),
  newStock: z.number().min(0)
}).strict();

// --- Server Actions ---
export async function createProductAction(formData: any) {
  const { user } = await requireAdmin();
  const data = productSchema.parse(formData);

  const supabase = createClient();
  const { data: newProd, error } = await supabase.from('products').insert([data]).select().single();
  
  if (error) throw new Error(error.message);
  
  // Log change securely on backend
  await supabase.from('product_logs').insert({
    product_id: newProd.id,
    changed_by: user.id,
    change_type: 'created',
    new_value: data
  });
  
  return newProd;
}

export async function updateProductAction(id: string, formData: any, oldData: any) {
  const { user } = await requireAdmin();
  const data = productSchema.parse(formData);
  const zId = z.string().uuid().parse(id);

  const supabase = createClient();
  const { error } = await supabase.from('products').update(data).eq('id', zId);
  
  if (error) throw new Error(error.message);

  await supabase.from('product_logs').insert({
    product_id: zId,
    changed_by: user.id,
    change_type: 'edit',
    old_value: oldData, // passing it from client for log context
    new_value: data
  });
  
  return true;
}

export async function deleteProductAction(id: string, isActive: boolean) {
  const { user } = await requireAdmin();
  const zId = z.string().uuid().parse(id);
  const zIsActive = z.boolean().parse(isActive);

  const supabase = createClient();
  const { error } = await supabase.from('products').update({ is_active: !zIsActive }).eq('id', zId);
  if (error) throw new Error(error.message);

  await supabase.from('product_logs').insert({
    product_id: zId,
    changed_by: user.id,
    change_type: 'edit',
    old_value: { is_active: zIsActive },
    new_value: { is_active: !zIsActive }
  });

  return true;
}

export async function adjustStockAction(productId: string, newStock: number, currentStock: number) {
  const { user } = await requireAdmin();
  const data = adjustStockSchema.parse({ productId, newStock });

  const supabase = createClient();
  const { error } = await supabase.from('products').update({ quantity_in_stock: data.newStock }).eq('id', data.productId);
  if (error) throw new Error(error.message);

  await supabase.from('product_logs').insert({
    product_id: data.productId,
    changed_by: user.id,
    change_type: 'stock_update',
    old_value: { quantity_in_stock: currentStock },
    new_value: { quantity_in_stock: data.newStock }
  });

  return true;
}
