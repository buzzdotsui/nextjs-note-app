'use client'
import { db } from '@/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { FiTrash2 } from 'react-icons/fi';

interface Note {
  id: string;
  text: string;
  createdAt: {
    seconds: number;
  };
}

export const NoteCard = ({ note }: { note: Note }) => {
  const deleteNote = async () => {
    await deleteDoc(doc(db, 'notes', note.id));
  };

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="p-6">
        <p className="text-lg text-foreground mb-4">{note.text}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{note.createdAt ? format(new Date(note.createdAt.seconds * 1000), 'PPpp') : ''}</span>
          <button
            onClick={deleteNote}
            className="text-muted-foreground hover:text-destructive transition-colors duration-200"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
