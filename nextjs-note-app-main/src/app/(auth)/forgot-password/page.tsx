'use client'
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [message, setMessage] = useState('');
  const { forgotPassword, loading, error } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await forgotPassword(email, nextPassword);
    if (success) {
      setMessage('Password updated for this local workspace account. You can sign in with the new password now.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[36px] border border-white/10 bg-slate-950/55 p-8 shadow-[0_24px_100px_rgba(2,6,23,0.45)] backdrop-blur lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-emerald-100">
          <ShieldCheck className="h-3.5 w-3.5" />
          Local password reset
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">Reset your workspace password.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          This rebuild uses a local-first account model, so password reset happens directly in the app instead of email delivery.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleForgotPassword}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
          />
          <Input
            id="next-password"
            name="next-password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="New password"
            value={nextPassword}
            onChange={(e) => setNextPassword(e.target.value)}
            className="rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
          />
          {message && <p className="text-sm text-emerald-300">{message}</p>}
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" loading={loading} className="w-full rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200">
            Update password
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          <Link href="/login" className="text-amber-200 transition hover:text-amber-100">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
