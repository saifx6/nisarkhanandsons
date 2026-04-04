import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth-server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const userSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(6).max(100),
  fullName: z.string().min(1).max(100),
  role: z.enum(['admin', 'staff']).optional(),
}).strict();

export async function POST(req: Request) {
  try {
    // 0. Payload Size Limit (1MB = 1048576 bytes)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1048576) {
      return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
    }

    // 1. Verify caller is admin
    await requireAdmin();

    // 2. Parse and Validate payload
    const body = await req.json();
    const parsedData = userSchema.parse(body);
    const { email, password, fullName, role } = parsedData;

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 });
    }

    // 3. Initialize Admin Client
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 4. Force creating the user using Admin bypass
    const { data: newAuthData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role
      }
    });

    if (createError) throw createError;

    // 5. Update user_profiles table safely
    // Our DB has a trigger that creates the profile. We'll update the generated profile immediately.
    if (newAuthData.user) {
       await supabaseAdmin.from('user_profiles').update({
         full_name: fullName,
         role: role || 'staff'
       }).eq('id', newAuthData.user.id);
    }

    return NextResponse.json({ success: true, user: newAuthData.user });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
