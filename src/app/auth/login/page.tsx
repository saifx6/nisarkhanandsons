'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An internal error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <Card className="w-full max-w-md bg-bg-surface border-border shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-8 border-b border-border/50 mb-6">
          <CardTitle className="font-heading text-3xl font-bold tracking-wider text-accent-primary uppercase flex flex-col items-center gap-1">
            <span>Nisar Khan</span>
            <span className="text-text-primary text-xl tracking-widest">& Sons</span>
          </CardTitle>
          <CardDescription className="text-text-secondary text-sm">
            Shop Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-danger border border-danger/50 bg-danger/10 rounded-md text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-secondary">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-bg-elevated border-border focus:border-accent-primary focus:ring-accent-primary text-text-primary"
                placeholder="admin@nisarkhan.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-text-secondary">Password</Label>
                <button type="button" className="text-xs text-accent-primary hover:text-accent-dim">
                  Forgot Password?
                </button>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-bg-elevated border-border focus:border-accent-primary focus:ring-accent-primary text-text-primary"
                placeholder="********"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-border bg-bg-elevated text-accent-primary focus:ring-accent-primary focus:ring-offset-bg-surface" 
              />
              <Label htmlFor="remember" className="text-sm font-normal text-text-secondary">
                Remember me
              </Label>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent-primary text-black hover:bg-accent-dim font-bold tracking-wide transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Decorative neon lines for cyberpunk feel */}
      <div className="fixed top-0 left-0 w-full h-1 shadow-[0_0_15px_#39FF14] bg-accent-primary/20 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 shadow-[0_0_15px_rgba(255,68,68,0.5)] bg-danger/20 pointer-events-none"></div>
    </div>
  );
}
