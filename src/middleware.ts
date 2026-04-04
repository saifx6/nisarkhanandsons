import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/middleware'

const loginTracker = new Map<string, { attempts: number; windowStart: number }>();
const BLOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function middleware(request: NextRequest) {
  // 1. IP-Based Rate Limiting for Login
  if (request.nextUrl.pathname === '/api/auth/login' && request.method === 'POST') {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    let record = loginTracker.get(ip);
    
    // Clean up expired window
    if (record && now - record.windowStart > BLOCK_WINDOW_MS) {
      record = undefined;
      loginTracker.delete(ip);
    }
    
    if (record && record.attempts >= MAX_ATTEMPTS) {
      return new Response(
        JSON.stringify({ error: 'Too many failed login attempts. Please try again in 15 minutes.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Increment attempts (Assume every call is an attempt, blocks brute forcing)
    if (!record) {
      loginTracker.set(ip, { attempts: 1, windowStart: now });
    } else {
      record.attempts += 1;
      loginTracker.set(ip, record);
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
