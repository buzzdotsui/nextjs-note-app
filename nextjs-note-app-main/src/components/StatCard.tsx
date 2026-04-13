import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  helper: string;
  accent?: 'amber' | 'emerald' | 'sky' | 'rose';
}

const accentMap = {
  amber: 'from-amber-300/30 text-amber-100',
  emerald: 'from-emerald-300/30 text-emerald-100',
  sky: 'from-sky-300/30 text-sky-100',
  rose: 'from-rose-300/30 text-rose-100',
};

export function StatCard({ label, value, helper, accent = 'amber' }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent', accentMap[accent])} />
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}
