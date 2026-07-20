'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LandingPage from '@/components/landing/LandingPage';

export default function IndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-3xl animate-pulse">한국</p>
      </div>
    );
  }

  return <LandingPage />;
}
