'use server';

import { z } from 'zod';
import { requireAuth } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase-server';

const lineItemSchema = z.object({
  product_id: z.string().uuid(),
  boxes: z.number().int().min(0),
  pieces: z.number().int().min(0),
  pieces_per_box: z.number().int().min(1),
  selling_price: z.number().min(0),
}).strict().refine(
  (data) => data.boxes > 0 || data.pieces > 0,
  { message: 'At least one of boxes or pieces must be greater than 0' }
);

const createSaleSchema = z.object({
  p_customer_name: z.string().max(100).nullable().optional(),
  p_customer_phone: z.string().max(20).nullable().optional(),
  p_items: z.array(lineItemSchema).min(1)
}).strict();

export async function createSaleAction(payload: unknown) {
  const user = await requireAuth(); // Staff or Admin allowed
  const data = createSaleSchema.parse(payload);

  const supabase = createClient();

  // Transform line items: compute quantity (total pieces), unit_price (per-piece), subtotal
  const transformedItems = data.p_items.map((item) => {
    const totalPieces = item.boxes * item.pieces_per_box + item.pieces;
    const pricePerPiece = parseFloat((item.selling_price / item.pieces_per_box).toFixed(4));
    const subtotal = parseFloat((totalPieces * pricePerPiece).toFixed(2));
    return {
      product_id: item.product_id,
      quantity: totalPieces,
      unit_price: pricePerPiece,
      subtotal,
    };
  });

  // The 'create_sale' RPC manages inserting the sale and items transactionally.
  // We explicitly pass the backend-validated user_id
  const finalPayload = {
    p_customer_name: data.p_customer_name,
    p_customer_phone: data.p_customer_phone,
    p_user_id: user.id,
    p_items: transformedItems,
  };

  const { data: result, error } = await supabase.rpc('create_sale', finalPayload);

  if (error) throw new Error(error.message);

  return result;
}
