'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useUserStats } from '@/hooks/useUserStats';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { stats } = useUserStats();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
      router.replace('/login');
    }
  };

  const statItems = [
    { label: 'Day Streak', value: `${stats.streak} 🔥` },
    { label: 'Cards Studied', value: `${stats.cardsStudied}` },
    { label: 'Passages Done', value: `${stats.passagesDone}` },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Avatar section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
            <span className="text-4xl">🧑</span>
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-red border-2 border-cream flex items-center justify-center">
            <span className="text-xs">✏️</span>
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-ink">
          {profile?.display_name || profile?.username || 'Learner'}
        </h2>
        <p className="text-sm text-muted">{profile?.username || ''}</p>
      </div>

      {/* Stats */}
      <p className="text-xs font-bold text-muted tracking-widest mb-3">
        YOUR STATS
      </p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 text-center shadow-sm border border-border"
          >
            <p className="text-2xl font-extrabold text-ink mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3.5 rounded-xl border-[1.5px] border-[#FDDDD9] bg-redLight text-red font-bold text-sm hover:bg-red hover:text-white hover:border-red transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
