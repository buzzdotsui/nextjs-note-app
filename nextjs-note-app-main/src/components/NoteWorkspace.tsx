'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Archive,
  Copy,
  LogOut,
  NotebookPen,
  Pin,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { StatCard } from '@/components/StatCard';
import { Textarea } from '@/components/Textarea';
import { noteThemes } from '@/lib/note-theme';
import { cn } from '@/lib/utils';
import { useNotesApp } from '@/providers/app-provider';
import type { NoteColor, NoteView, SortOption } from '@/types/app';

const noteColors: NoteColor[] = ['sun', 'mint', 'sky', 'rose', 'violet', 'slate'];

const quickViews: { value: NoteView; label: string }[] = [
  { value: 'all', label: 'All notes' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'archived', label: 'Archived' },
];

const sortLabels: Record<SortOption, string> = {
  updated: 'Recently updated',
  created: 'Recently created',
  alphabetical: 'Alphabetical',
};

const emptyDraft = {
  title: '',
  content: '',
  tags: '',
  color: 'sun' as NoteColor,
};

interface NoteEditorProps {
  selectedNote: ReturnType<typeof useNotesApp>['notes'][number] | null;
  onCreate: (input: { title: string; content: string; tags: string[]; color: NoteColor }) => string;
  onUpdate: (
    noteId: string,
    input: {
      title: string;
      content: string;
      tags: string[];
      color: NoteColor;
      pinned: boolean;
      favorite: boolean;
      archived: boolean;
    }
  ) => void;
  onDuplicate: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
  onSelectNote: (noteId: string | null) => void;
  isCreatingNew: boolean;
}

function NoteEditor({
  selectedNote,
  onCreate,
  onUpdate,
  onDuplicate,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onSelectNote,
  isCreatingNew,
}: NoteEditorProps) {
  const [draft, setDraft] = useState(() =>
    selectedNote
      ? {
          title: selectedNote.title,
          content: selectedNote.content,
          tags: selectedNote.tags.join(', '),
          color: selectedNote.color,
        }
      : emptyDraft
  );
  const [feedback, setFeedback] = useState(isCreatingNew ? 'New note ready.' : '');

  const saveDraft = () => {
    const normalizedTags = draft.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (!draft.title.trim() || !draft.content.trim()) {
      setFeedback('Give the note a title and some content so it has real retrieval value.');
      return;
    }

    if (selectedNote) {
      onUpdate(selectedNote.id, {
        title: draft.title,
        content: draft.content,
        tags: normalizedTags,
        color: draft.color,
        pinned: selectedNote.pinned,
        favorite: selectedNote.favorite,
        archived: selectedNote.archived,
      });
      setFeedback('Saved changes.');
      return;
    }

    const newNoteId = onCreate({
      title: draft.title,
      content: draft.content,
      tags: normalizedTags,
      color: draft.color,
    });
    onSelectNote(newNoteId);
    setFeedback('Created a new note.');
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
            {selectedNote ? 'Editor' : 'Quick draft'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {selectedNote ? 'Refine the note' : 'Capture something new'}
          </h2>
        </div>
        {selectedNote ? (
          <div className="flex gap-2">
            <button
              onClick={() => onTogglePin(selectedNote.id)}
              className={cn(
                'rounded-2xl border px-3 py-2 text-sm transition',
                selectedNote.pinned ? 'border-amber-300/50 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              )}
            >
              <Pin className="h-4 w-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(selectedNote.id)}
              className={cn(
                'rounded-2xl border px-3 py-2 text-sm transition',
                selectedNote.favorite ? 'border-rose-300/50 bg-rose-300/10 text-rose-100' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              )}
            >
              <Star className={cn('h-4 w-4', selectedNote.favorite && 'fill-current')} />
            </button>
            <button
              onClick={() => onToggleArchive(selectedNote.id)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <Archive className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <Input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder="Note title"
          className="h-12 rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
        />
        <Textarea
          value={draft.content}
          onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
          placeholder="Write ideas, meeting notes, outlines, or rough thinking here."
        />
        <Input
          value={draft.tags}
          onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
          placeholder="Tags, separated by commas"
          className="h-12 rounded-2xl border-white/10 bg-white/5 text-slate-50 placeholder:text-slate-500"
        />

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Color mood</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {noteColors.map((color) => (
              <button
                key={color}
                onClick={() => setDraft((current) => ({ ...current, color }))}
                className={cn(
                  'h-10 w-10 rounded-full border transition',
                  draft.color === color ? 'scale-105 border-white/60' : 'border-white/10',
                  noteThemes[color].dot
                )}
                aria-label={`Select ${color}`}
              />
            ))}
          </div>
        </div>

        {feedback ? <p className="text-sm text-amber-100">{feedback}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button onClick={saveDraft} className="rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200">
            {selectedNote ? 'Save changes' : 'Create note'}
          </Button>
          {selectedNote ? (
            <>
              <Button
                onClick={() => onDuplicate(selectedNote.id)}
                variant="outline"
                className="rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/[0.08]"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button
                onClick={() => {
                  onDelete(selectedNote.id);
                  onSelectNote(null);
                }}
                variant="outline"
                className="rounded-2xl border-rose-300/20 bg-transparent text-rose-100 hover:bg-rose-300/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function NoteWorkspace() {
  const {
    currentUser,
    notes,
    logout,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    toggleArchive,
    toggleFavorite,
    togglePin,
    stats,
    tagLibrary,
  } = useNotesApp();

  const [selectedView, setSelectedView] = useState<NoteView>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('updated');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const filteredNotes = (() => {
    const base = notes.filter((note) => {
      if (selectedView === 'pinned') {
        return note.pinned && !note.archived;
      }
      if (selectedView === 'favorites') {
        return note.favorite && !note.archived;
      }
      if (selectedView === 'archived') {
        return note.archived;
      }
      return !note.archived;
    });

    const tagged = selectedTag === 'all' ? base : base.filter((note) => note.tags.includes(selectedTag));
    const searched = tagged.filter((note) => {
      const haystack = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    return [...searched].sort((left, right) => {
      if (left.pinned !== right.pinned && selectedView !== 'archived') {
        return left.pinned ? -1 : 1;
      }

      if (sort === 'alphabetical') {
        return left.title.localeCompare(right.title);
      }

      const leftDate = sort === 'created' ? left.createdAt : left.updatedAt;
      const rightDate = sort === 'created' ? right.createdAt : right.updatedAt;
      return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
  })();

  const activeSelectedId =
    !isCreatingNew && filteredNotes.some((note) => note.id === selectedId)
      ? selectedId
      : !isCreatingNew
        ? filteredNotes[0]?.id ?? null
        : null;

  const selectedNote =
    !isCreatingNew && activeSelectedId
      ? filteredNotes.find((note) => note.id === activeSelectedId) ?? null
      : null;

  const createBlankNote = () => {
    setIsCreatingNew(true);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_30%),linear-gradient(180deg,#07111f_0%,#0f172a_45%,#020617_100%)] text-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-6">
        <header className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-amber-100">
              <Sparkles className="h-3.5 w-3.5" />
              Calm, fast notes
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {currentUser?.name.split(' ')[0]}&apos;s focus workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Capture ideas quickly, organize them with tags and views, then keep the workspace clean with pinning,
              favorites, and archive flows that actually help.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Active notes" value={stats.total} helper="Fresh work that still deserves attention." accent="amber" />
            <StatCard label="Pinned" value={stats.pinned} helper="Your highest-priority thinking surfaces first." accent="sky" />
            <StatCard label="Favorites" value={stats.favorites} helper="Ideas worth revisiting or turning into output." accent="rose" />
            <StatCard label="Archived" value={stats.archived} helper="Out of sight, still safely retrievable." accent="emerald" />
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)_420px]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-950/55 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.4)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Workspace</p>
                <p className="mt-2 text-xl font-semibold">{currentUser?.name}</p>
                <p className="text-sm text-slate-400">{currentUser?.plan} plan</p>
              </div>
              <NotebookPen className="h-8 w-8 text-amber-200" />
            </div>

            <Button onClick={createBlankNote} className="mt-6 w-full rounded-2xl bg-amber-300 text-slate-950 hover:bg-amber-200">
              <Plus className="mr-2 h-4 w-4" />
              New note
            </Button>

            <div className="mt-6 space-y-2">
              {quickViews.map((view) => (
                <button
                  key={view.value}
                  onClick={() => setSelectedView(view.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition',
                    selectedView === view.value ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  )}
                >
                  <span>{view.label}</span>
                  <span className="text-xs opacity-70">
                    {view.value === 'all'
                      ? stats.total
                      : view.value === 'pinned'
                        ? stats.pinned
                        : view.value === 'favorites'
                          ? stats.favorites
                          : stats.archived}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs transition',
                    selectedTag === 'all' ? 'bg-amber-300 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  )}
                >
                  All
                </button>
                {tagLibrary.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs transition',
                      selectedTag === tag ? 'bg-amber-300 text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Better than a bare notes demo</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your workspace now supports local persistence, tagging, pinning, favorites, archive flows, editing, and
                a real dashboard structure.
              </p>
            </div>

            <Button onClick={logout} variant="outline" className="mt-6 w-full rounded-2xl border-white/10 bg-transparent text-slate-200 hover:bg-white/[0.08]">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-slate-950/50 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.4)]">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, content, and tags"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-slate-50 placeholder:text-slate-500"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSort(option)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm transition',
                      sort === option ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    )}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {filteredNotes.length ? (
                filteredNotes.map((note) => {
                  const theme = noteThemes[note.color];
                  const active = selectedNote?.id === note.id;
                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        setIsCreatingNew(false);
                        setSelectedId(note.id);
                      }}
                      className={cn(
                        'group relative overflow-hidden rounded-[26px] border p-5 text-left transition',
                        active ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]',
                        theme.card
                      )}
                    >
                      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent', theme.glow)} />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn('h-2.5 w-2.5 rounded-full', theme.dot)} />
                            <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                              {note.archived ? 'Archived' : note.pinned ? 'Pinned' : 'Note'}
                            </span>
                          </div>
                          <h3 className="mt-3 text-lg font-semibold text-white">{note.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          {note.favorite ? <Star className="h-4 w-4 fill-current" /> : null}
                          {note.pinned ? <Pin className="h-4 w-4" /> : null}
                        </div>
                      </div>
                      <p
                        className="mt-3 overflow-hidden text-sm leading-6 text-slate-300"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {note.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <span key={tag} className={cn('rounded-full px-3 py-1 text-xs', theme.pill)}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.04] p-8 text-center">
                  <p className="text-lg font-medium text-white">Nothing matches this view yet.</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Try a different filter or create a fresh note to seed the workspace.
                  </p>
                </div>
              )}
            </div>
          </section>

          <NoteEditor
            key={selectedNote?.id ?? 'new-note'}
            selectedNote={selectedNote}
            isCreatingNew={isCreatingNew}
            onCreate={(input) => {
              const note = createNote(input);
              setIsCreatingNew(false);
              return note.id;
            }}
            onUpdate={updateNote}
            onDuplicate={duplicateNote}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            onSelectNote={(noteId) => {
              setIsCreatingNew(noteId === null);
              setSelectedId(noteId);
            }}
          />
        </div>
      </div>
    </div>
  );
}
