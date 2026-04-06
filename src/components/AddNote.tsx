'use client'
import { useState } from 'react';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';
import { Input } from './Input';

export const AddNote = () => {
  const { user } = useAuth();
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const addNote = async () => {
    if (newNote.trim() !== '' && user) {
      setLoading(true);
      await addDoc(collection(db, 'notes'), {
        text: newNote,
        uid: user.uid,
        createdAt: new Date(),
      });
      setNewNote('');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8 animate-slide-in-from-top">
      <Input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a new note..."
        className="flex-grow"
      />
      <Button onClick={addNote} loading={loading} className="w-full sm:w-auto">
        Add Note
      </Button>
    </div>
  );
};
