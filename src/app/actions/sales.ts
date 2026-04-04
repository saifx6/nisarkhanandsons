'use server';

import { z } from 'zod';
import { requireAuth } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase-server';

const lineItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0)
}).strict();

const createSaleSchema = z.object({
  p_customer_name: z.string().max(100).nullable().optional(),
  p_customer_phone: z.string().max(20).nullable().optional(),
  p_items: z.array(lineItemSchema).min(1)
}).strict();

export async function createSaleAction(payload: any) {
  const user = await requireAuth(); // Staff or Admin allowed
  const data = createSaleSchema.parse(payload);

  const supabase = createClient();
  
  // The 'create_sale' RPC manages inserting the sale and items transactional.
  // We explicitly pass the backend-validated user_id
  const finalPayload = {
    ...data,
    p_user_id: user.id
  };

  const { data: result, error } = await supabase.rpc('create_sale', finalPayload);
  
  if (error) throw new Error(error.message);

  return result;
}
