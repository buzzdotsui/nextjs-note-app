'use client'
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { forgotPassword, loading, error } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    if (success) {
      setMessage('Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md animate-slide-in-from-bottom">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Forgot Your Password?</h1>
          <p className="mt-2 text-muted-foreground">No worries, we&apos;ll send you reset instructions</p>
        </div>
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && <p className="text-sm text-emerald-500">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Button type="submit" loading={loading} className="w-full">
              Send Reset Email
            </Button>
          </div>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            &larr; Back to Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
