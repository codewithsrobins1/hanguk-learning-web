import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Hanguk — Learn Korean',
  description:
    'Study Hangul, flashcards, and reading passages to learn Korean.',
  keywords: ['Korean', 'Hangul', 'language learning', 'flashcards'],
  openGraph: {
    title: 'Hanguk — Learn Korean',
    description:
      'Study Hangul, flashcards, and reading passages to learn Korean.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
