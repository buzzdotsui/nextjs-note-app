import { Note, NoteColor, WorkspaceState, WorkspaceUser } from '@/types/app';

const baseTime = new Date('2026-04-10T09:00:00.000Z').getTime();

const createId = (value: string) => value;

const demoUser: WorkspaceUser = {
  id: createId('demo-user'),
  name: 'Amina Okafor',
  email: 'demo@noteflow.app',
  password: 'demo1234',
  createdAt: new Date(baseTime).toISOString(),
  plan: 'Focus',
};

const makeNote = (
  id: string,
  title: string,
  content: string,
  tags: string[],
  color: NoteColor,
  pinned = false,
  favorite = false,
  archived = false,
  offsetHours = 0
): Note => {
  const updated = new Date(baseTime + offsetHours * 60 * 60 * 1000).toISOString();
  return {
    id,
    userId: demoUser.id,
    title,
    content,
    excerpt: content.slice(0, 180),
    tags,
    color,
    pinned,
    favorite,
    archived,
    createdAt: updated,
    updatedAt: updated,
  };
};

export const demoNotes: Note[] = [
  makeNote(
    'note-vision',
    'Product vision',
    'Build a calmer note space that makes deep work feel easier. The experience should prioritize capture speed, fast retrieval, and lightweight planning instead of overwhelming the user with knobs.',
    ['strategy', 'product'],
    'sun',
    true,
    true,
    false,
    1
  ),
  makeNote(
    'note-rituals',
    'Weekly review ritual',
    'Friday checklist:\n- close open loops\n- archive stale tasks\n- pull standout ideas into next week\n- flag notes that deserve shipping, not just storing',
    ['workflow', 'review'],
    'mint',
    true,
    false,
    false,
    5
  ),
  makeNote(
    'note-launch',
    'Launch copy ideas',
    'Headline directions:\n1. Your workspace for clear thinking.\n2. Notes that stay organized without effort.\n3. Capture the signal, not the clutter.',
    ['marketing', 'copy'],
    'rose',
    false,
    true,
    false,
    12
  ),
  makeNote(
    'note-reading',
    'Reading highlights',
    'People return to products that reduce friction in moments of uncertainty. Notes are not just storage, they are memory scaffolding.',
    ['research'],
    'sky',
    false,
    false,
    false,
    18
  ),
  makeNote(
    'note-archive',
    'Old retro notes',
    'Keep this archived as a reference point for design decisions we no longer want in the current iteration.',
    ['archive'],
    'slate',
    false,
    false,
    true,
    24
  ),
];

export const defaultWorkspaceState: WorkspaceState = {
  users: [demoUser],
  sessionUserId: demoUser.id,
  notes: demoNotes,
};

export const starterNotesForUser = (userId: string, userName: string): Note[] => {
  const timestamp = new Date().toISOString();

  return [
    {
      id: `${userId}-welcome`,
      userId,
      title: `Welcome, ${userName.split(' ')[0]}`,
      content:
        'This workspace is ready to go. Pin important notes, add tags for retrieval, and archive anything that no longer deserves space in your active view.',
      excerpt:
        'This workspace is ready to go. Pin important notes, add tags for retrieval, and archive anything that no longer deserves space in your active view.',
      tags: ['welcome'],
      color: 'violet',
      pinned: true,
      favorite: true,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: `${userId}-capture`,
      userId,
      title: 'Quick capture ideas',
      content:
        'Use short titles for retrieval and tags for themes. A strong notes system should help you find what matters in seconds, not minutes.',
      excerpt:
        'Use short titles for retrieval and tags for themes. A strong notes system should help you find what matters in seconds, not minutes.',
      tags: ['tips', 'workflow'],
      color: 'mint',
      pinned: false,
      favorite: false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
};
