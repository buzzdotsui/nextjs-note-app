'use client'
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading, error } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await signup(email, password, name);
    if (user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/55 shadow-[0_24px_100px_rgba(2,6,23,0.45)] backdrop-blur lg:grid-cols-[1fr_0.9fr]">
        <div className="p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-amber-100">
            <Sparkles className="h-3.5 w-3.5" />
            Local-first workspace
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">Create your note system in under a minute.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            This rebuild stores your workspace locally so you can start immediately. You&apos;ll get a seeded dashboard,
            tags, pinning, favorites, archive flows, and full note editing from day one.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSignup}>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
            />
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
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
            />
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <Button type="submit" loading={loading} className="w-full rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200">
              Create workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="border-t border-white/10 bg-white/5 p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">What you get</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
              <p className="text-lg font-medium text-white">Capture and refine</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Create, edit, duplicate, and color-code notes without leaving the dashboard.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
              <p className="text-lg font-medium text-white">Organize with intent</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use tags, favorites, pinning, and archive views so retrieval stays fast.</p>
            </div>
            <div className="rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5 text-slate-950">
              <p className="text-lg font-medium">Ready immediately</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">No Firebase setup is required just to experience the app. It works as soon as the browser loads.</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-200 transition hover:text-amber-100">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
