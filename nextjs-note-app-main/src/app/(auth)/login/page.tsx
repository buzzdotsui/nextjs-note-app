'use client'
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ArrowRight, Layers3, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, loginDemo } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/55 shadow-[0_24px_100px_rgba(2,6,23,0.45)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-white/10 bg-white/5 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-amber-100">
            <Sparkles className="h-3.5 w-3.5" />
            Demo-ready access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
            Return to a cleaner notes workflow.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Sign in with your local workspace account or jump into the rebuilt demo workspace instantly.
          </p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3">
              <Layers3 className="h-8 w-8 text-sky-200" />
              <div>
                <p className="text-sm font-medium text-white">Demo workspace</p>
                <p className="text-sm text-slate-400">Email: demo@noteflow.app</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">Password: demo1234</p>
            <Button
              onClick={async () => {
                const user = await loginDemo();
                if (user) {
                  router.push('/dashboard');
                }
              }}
              variant="outline"
              className="mt-5 w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            >
              Open demo workspace
            </Button>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Sign in</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Pick up where you left off</h2>
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
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
            <div className="flex items-center justify-between gap-4 text-sm">
              <Link href="/forgot-password" className="text-amber-200 transition hover:text-amber-100">
                Reset local password
              </Link>
              <Link href="/signup" className="text-slate-400 transition hover:text-slate-200">
                Need an account?
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200">
              Continue to dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
