'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function IndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/home' : '/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-3xl animate-pulse">한국</p>
    </div>
  );
}
