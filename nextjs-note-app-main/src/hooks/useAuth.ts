import { useState } from 'react';
import { useNotesApp } from '@/providers/app-provider';
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

export const useAuth = () => {
  const { currentUser, loading, signup: signupApp, login: loginApp, logout, resetPassword, loginDemo } =
    useNotesApp();
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);
      return signupApp(name, validatedEmail, validatedPassword);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);
      return loginApp(validatedEmail, validatedPassword);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0].message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
      return null;
    }
  };

  const forgotPassword = async (email: string, nextPassword: string) => {
    setError(null);
    try {
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(nextPassword);
      resetPassword(validatedEmail, validatedPassword);
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
    }
  };

  const user = currentUser
    ? {
        uid: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.name,
      }
    : null;

  return { user, loading, error, signup, login, logout, forgotPassword, loginDemo };
};
