import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

interface AppUser extends User {
  displayName: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUser({ ...user, displayName: userData?.name || null });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);

      const userCredential = await createUserWithEmailAndPassword(auth, validatedEmail, validatedPassword);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      return userCredential;
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);

      return await signInWithEmailAndPassword(auth, validatedEmail, validatedPassword);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      await sendPasswordResetEmail(auth, validatedEmail);
      return true;
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signup, login, logout, forgotPassword };
};
