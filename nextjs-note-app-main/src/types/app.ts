export type NoteColor =
  | 'sun'
  | 'mint'
  | 'sky'
  | 'rose'
  | 'violet'
  | 'slate';

export type NoteView = 'all' | 'pinned' | 'favorites' | 'archived';

export type SortOption = 'updated' | 'created' | 'alphabetical';

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  plan: 'Starter' | 'Focus';
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  color: NoteColor;
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceState {
  users: WorkspaceUser[];
  sessionUserId: string | null;
  notes: Note[];
}
