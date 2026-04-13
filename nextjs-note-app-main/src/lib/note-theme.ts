import { NoteColor } from '@/types/app';

export const noteThemes: Record<
  NoteColor,
  {
    card: string;
    pill: string;
    dot: string;
    glow: string;
  }
> = {
  sun: {
    card: 'border-amber-300/30 bg-amber-300/10',
    pill: 'bg-amber-300/15 text-amber-100',
    dot: 'bg-amber-300',
    glow: 'from-amber-300/20',
  },
  mint: {
    card: 'border-emerald-300/30 bg-emerald-300/10',
    pill: 'bg-emerald-300/15 text-emerald-100',
    dot: 'bg-emerald-300',
    glow: 'from-emerald-300/20',
  },
  sky: {
    card: 'border-sky-300/30 bg-sky-300/10',
    pill: 'bg-sky-300/15 text-sky-100',
    dot: 'bg-sky-300',
    glow: 'from-sky-300/20',
  },
  rose: {
    card: 'border-rose-300/30 bg-rose-300/10',
    pill: 'bg-rose-300/15 text-rose-100',
    dot: 'bg-rose-300',
    glow: 'from-rose-300/20',
  },
  violet: {
    card: 'border-violet-300/30 bg-violet-300/10',
    pill: 'bg-violet-300/15 text-violet-100',
    dot: 'bg-violet-300',
    glow: 'from-violet-300/20',
  },
  slate: {
    card: 'border-slate-200/15 bg-slate-200/8',
    pill: 'bg-slate-200/10 text-slate-100',
    dot: 'bg-slate-300',
    glow: 'from-slate-100/10',
  },
};
