'use client'

import { Spinner } from '@/components/Spinner';
import { NoteWorkspace } from '@/components/NoteWorkspace';
import { useNotesApp } from '@/providers/app-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { currentUser, loading } = useNotesApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return <Spinner />;
  }

  return <NoteWorkspace />;
}
