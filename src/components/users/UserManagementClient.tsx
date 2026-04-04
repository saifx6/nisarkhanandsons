'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPKR, formatDate } from '@/lib/formatters';
import { CheckCircle2, XCircle, ShieldAlert, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UserManagementClient({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users] = useState<UserProfile[]>(initialUsers);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('staff');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, fullName, role })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to provision user.');
      }

      toast({ title: 'User Successfully Provisioned!', description: `${fullName} can now log in.` });
      setOpen(false);
      
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('staff');
      
      router.refresh();

    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Provisioning Failed', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">User Management</h2>
          <p className="text-text-secondary text-sm">Manage staff accounts and administrative access.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-primary text-black hover:bg-accent-dim">
              + Provision New User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-bg-surface border-border text-text-primary w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Provision Staff Account</DialogTitle>
              <DialogDescription className="text-text-secondary">
                Generate a secure access profile for a new team member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                  <Input 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 bg-bg-elevated border-border" 
                    placeholder="e.g. Ali Khan" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                  <Input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-bg-elevated border-border" 
                    placeholder="ali@nisarkhan.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                  <Input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-bg-elevated border-border font-mono tracking-widest" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              <div className="space-y-2 pb-4">
                <Label>System Role</Label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 bg-bg-elevated border border-border rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="staff">Staff (Inventory & Sales)</option>
                  <option value="admin">Admin (Full Access & Revisions)</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end items-center">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-bg-hover">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-accent-primary text-black hover:bg-accent-dim">
                  {loading ? 'Validating...' : 'Authorize User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-text-muted">Full Name</TableHead>
              <TableHead className="text-text-muted">ID</TableHead>
              <TableHead className="text-text-muted">Role</TableHead>
              <TableHead className="text-text-muted">Status</TableHead>
              <TableHead className="text-right text-text-muted">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow 
                key={u.id} 
                className="border-border hover:bg-bg-hover"
              >
                <TableCell className="text-text-primary font-medium">{u.full_name || 'Incognito User'}</TableCell>
                <TableCell className="font-mono text-xs text-text-secondary">{u.id.slice(0, 8)}</TableCell>
                <TableCell>
                  {u.role === 'admin' ? (
                    <span className="flex items-center text-xs font-mono text-warning bg-warning/10 px-2 py-1 rounded w-fit border border-warning/20">
                      <ShieldAlert size={14} className="mr-1" /> ADMIN
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-mono text-accent-primary bg-accent-primary/10 px-2 py-1 rounded w-fit border border-accent-primary/20">
                      <ShieldCheck size={14} className="mr-1" /> STAFF
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {u.is_active ? (
                    <span className="flex items-center text-xs text-text-primary">
                      <CheckCircle2 size={14} className="text-accent-primary mr-1" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-xs text-text-secondary">
                      <XCircle size={14} className="text-danger mr-1" /> Disabled
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-text-secondary">
                  {formatDate(u.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-border bg-bg-elevated rounded-b-lg text-xs font-mono text-text-secondary flex items-center justify-between">
        <span>* Creating new users via dashboard dynamically invokes the backend identity proxy.</span>
      </div>
    </div>
  );
}
