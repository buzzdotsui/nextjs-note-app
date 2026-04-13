'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadWorkspaceState, saveWorkspaceState } from '@/lib/storage';
import { starterNotesForUser } from '@/lib/demo-data';
import type { Note, NoteColor, SortOption, WorkspaceState, WorkspaceUser } from '@/types/app';

interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
  color: NoteColor;
}

interface UpdateNoteInput extends CreateNoteInput {
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
}

interface AppContextValue {
  loading: boolean;
  currentUser: WorkspaceUser | null;
  notes: Note[];
  signup: (name: string, email: string, password: string) => WorkspaceUser;
  login: (email: string, password: string) => WorkspaceUser;
  loginDemo: () => WorkspaceUser;
  logout: () => void;
  resetPassword: (email: string, nextPassword: string) => void;
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (noteId: string, input: UpdateNoteInput) => void;
  deleteNote: (noteId: string) => void;
  duplicateNote: (noteId: string) => void;
  togglePin: (noteId: string) => void;
  toggleFavorite: (noteId: string) => void;
  toggleArchive: (noteId: string) => void;
  stats: {
    total: number;
    pinned: number;
    favorites: number;
    archived: number;
    tagged: number;
  };
  tagLibrary: string[];
}

const AppContext = createContext<AppContextValue | null>(null);

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const summarize = (content: string) => content.replace(/\s+/g, ' ').trim().slice(0, 180);

const sortNotes = (notes: Note[], sort: SortOption = 'updated') => {
  return [...notes].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return left.pinned ? -1 : 1;
    }

    if (sort === 'alphabetical') {
      return left.title.localeCompare(right.title);
    }

    if (sort === 'created') {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(() => loadWorkspaceState());

  useEffect(() => {
    if (state) {
      saveWorkspaceState(state);
    }
  }, [state]);

  const currentUser = useMemo(() => {
    if (!state?.sessionUserId) {
      return null;
    }
    return state.users.find((user) => user.id === state.sessionUserId) ?? null;
  }, [state]);

  const userNotes = useMemo(() => {
    if (!state || !currentUser) {
      return [];
    }
    return sortNotes(state.notes.filter((note) => note.userId === currentUser.id));
  }, [state, currentUser]);

  const stats = useMemo(() => {
    return {
      total: userNotes.filter((note) => !note.archived).length,
      pinned: userNotes.filter((note) => note.pinned && !note.archived).length,
      favorites: userNotes.filter((note) => note.favorite && !note.archived).length,
      archived: userNotes.filter((note) => note.archived).length,
      tagged: userNotes.filter((note) => note.tags.length > 0 && !note.archived).length,
    };
  }, [userNotes]);

  const tagLibrary = useMemo(() => {
    return Array.from(new Set(userNotes.flatMap((note) => note.tags))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [userNotes]);

  const setSession = (userId: string | null) => {
    setState((current) => {
      if (!current) {
        return current;
      }
      return { ...current, sessionUserId: userId };
    });
  };

  const signup = (name: string, email: string, password: string) => {
    if (!state) {
      throw new Error('Workspace is still loading.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (state.users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const now = new Date().toISOString();
    const user: WorkspaceUser = {
      id: createId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: now,
      plan: 'Starter',
    };

    setState({
      ...state,
      users: [...state.users, user],
      sessionUserId: user.id,
      notes: [...state.notes, ...starterNotesForUser(user.id, user.name)],
    });

    return user;
  };

  const login = (email: string, password: string) => {
    if (!state) {
      throw new Error('Workspace is still loading.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = state.users.find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password
    );

    if (!user) {
      throw new Error('Incorrect email or password.');
    }

    setSession(user.id);
    return user;
  };

  const loginDemo = () => {
    if (!state) {
      throw new Error('Workspace is still loading.');
    }

    const demoUser = state.users.find((user) => user.email === 'demo@noteflow.app');
    if (!demoUser) {
      throw new Error('Demo workspace is unavailable.');
    }
    setSession(demoUser.id);
    return demoUser;
  };

  const logout = () => {
    setSession(null);
  };

  const resetPassword = (email: string, nextPassword: string) => {
    if (!state) {
      throw new Error('Workspace is still loading.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = state.users.find((user) => user.email === normalizedEmail);
    if (!existingUser) {
      throw new Error('No workspace account matches that email.');
    }

    setState({
      ...state,
      users: state.users.map((user) =>
        user.id === existingUser.id ? { ...user, password: nextPassword } : user
      ),
    });
  };

  const createNote = (input: CreateNoteInput) => {
    if (!state || !currentUser) {
      throw new Error('Sign in to create a note.');
    }

    const now = new Date().toISOString();
    const note: Note = {
      id: createId(),
      userId: currentUser.id,
      title: input.title.trim(),
      content: input.content.trim(),
      excerpt: summarize(input.content),
      tags: input.tags,
      color: input.color,
      pinned: false,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    setState({
      ...state,
      notes: [note, ...state.notes],
    });

    return note;
  };

  const updateNote = (noteId: string, input: UpdateNoteInput) => {
    if (!state || !currentUser) {
      return;
    }

    setState({
      ...state,
      notes: state.notes.map((note) =>
        note.id === noteId && note.userId === currentUser.id
          ? {
              ...note,
              ...input,
              title: input.title.trim(),
              content: input.content.trim(),
              excerpt: summarize(input.content),
              updatedAt: new Date().toISOString(),
            }
          : note
      ),
    });
  };

  const deleteNote = (noteId: string) => {
    if (!state || !currentUser) {
      return;
    }

    setState({
      ...state,
      notes: state.notes.filter((note) => !(note.id === noteId && note.userId === currentUser.id)),
    });
  };

  const duplicateNote = (noteId: string) => {
    if (!state || !currentUser) {
      return;
    }

    const source = state.notes.find((note) => note.id === noteId && note.userId === currentUser.id);
    if (!source) {
      return;
    }

    const now = new Date().toISOString();
    const duplicate: Note = {
      ...source,
      id: createId(),
      title: `${source.title} (copy)`,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setState({
      ...state,
      notes: [duplicate, ...state.notes],
    });
  };

  const patchNote = (noteId: string, updater: (note: Note) => Note) => {
    if (!state || !currentUser) {
      return;
    }

    setState({
      ...state,
      notes: state.notes.map((note) =>
        note.id === noteId && note.userId === currentUser.id
          ? { ...updater(note), updatedAt: new Date().toISOString() }
          : note
      ),
    });
  };

  const togglePin = (noteId: string) => patchNote(noteId, (note) => ({ ...note, pinned: !note.pinned }));
  const toggleFavorite = (noteId: string) =>
    patchNote(noteId, (note) => ({ ...note, favorite: !note.favorite }));
  const toggleArchive = (noteId: string) =>
    patchNote(noteId, (note) => ({ ...note, archived: !note.archived, pinned: note.archived ? note.pinned : false }));

  const value: AppContextValue = {
    loading: false,
    currentUser,
    notes: userNotes,
    signup,
    login,
    loginDemo,
    logout,
    resetPassword,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePin,
    toggleFavorite,
    toggleArchive,
    stats,
    tagLibrary,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useNotesApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNotesApp must be used within AppProvider.');
  }
  return context;
};
