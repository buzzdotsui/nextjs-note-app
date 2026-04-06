'use client'

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AddNote } from '@/components/AddNote';
import { NoteCard } from '@/components/NoteCard';
import { Spinner } from '@/components/Spinner';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface Note {
  id: string;
  text: string;
  createdAt: Timestamp;
  uid: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      };
      fetchUserData();

      const q = query(collection(db, 'notes'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Note[];
        setNotes(notesData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground animate-fade-in">
      <aside className="w-64 p-6 bg-card border-r border-border animate-slide-in-from-left">
        <h1 className="mb-8 text-2xl font-bold text-primary">Note Taking App</h1>
        <AddNote />
        <div className="mt-auto">
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome, {userName || 'User'}!</h2>
            <p className="text-muted-foreground">Here are your notes:</p>
          </div>
          <div className="w-1/3">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </main>
    </div>
  );
}
