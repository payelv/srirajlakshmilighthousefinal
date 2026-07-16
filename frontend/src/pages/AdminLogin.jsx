import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, LogIn, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ADMIN_CREDS } from '../mock';
import { useToast } from '../hooks/use-toast';

export default function AdminLogin() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [creds, setCreds] = useState({ username: '', password: '' });

  useEffect(() => {
    if (localStorage.getItem('srl-admin-auth') === '1') nav('/admin/dashboard', { replace: true });
  }, [nav]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (creds.username === ADMIN_CREDS.username && creds.password === ADMIN_CREDS.password) {
      localStorage.setItem('srl-admin-auth', '1');
      toast({ title: 'Welcome back, Admin!' });
      nav('/admin/dashboard');
    } else {
      toast({ title: 'Invalid credentials', description: 'Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-card/50 backdrop-blur p-8 relative">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-500/5">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </span>
          <div>
            <div className="font-serif text-2xl">Admin Panel</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase">Sri Rajlaxmi Light House</div>
          </div>
        </div>

        <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
        <div className="relative mt-2 mb-4">
          <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            className="pl-10 h-11 bg-background/60"
            placeholder="admin@example.com"
          />
        </div>

        <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
        <div className="relative mt-2 mb-6">
          <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="password"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            className="pl-10 h-11 bg-background/60"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-medium">
          <LogIn className="w-4 h-4 mr-2" /> Sign In
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized access only.
        </p>
      </form>
    </div>
  );
}
