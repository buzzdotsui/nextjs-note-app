import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowRight, Layers3, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-12 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-100">
              <Sparkles className="h-3.5 w-3.5" />
              Rebuilt for better flow
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-7xl">
              Notes that feel like a workspace, not a dumping ground.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              NoteFlow is a local-first notes product for fast capture, better organization, and calmer review.
              Create notes, pin what matters, tag themes, favorite ideas, archive clutter, and keep momentum.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button className="w-full rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200 sm:w-auto">
                  Start your workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 sm:w-auto">
                  Open demo or sign in
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative rounded-[36px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_100px_rgba(2,6,23,0.45)] backdrop-blur">
            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Daily focus</p>
                    <p className="mt-2 text-2xl font-semibold text-white">3 pinned notes</p>
                  </div>
                  <Zap className="h-8 w-8 text-amber-200" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Surface high-priority thinking first so the workspace helps you act, not just store.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Retrieval</p>
                    <p className="mt-2 text-2xl font-semibold text-white">Tags + search</p>
                  </div>
                  <Layers3 className="h-8 w-8 text-sky-200" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Find ideas across titles, note content, and tags in one pass without friction.
                </p>
              </div>
              <div className="rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5 text-slate-950">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-700">Included in this rebuild</p>
                <p className="mt-2 text-2xl font-semibold">Local-first persistence, editing, archiving, favorites, pinning, and a stronger dashboard UX.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
