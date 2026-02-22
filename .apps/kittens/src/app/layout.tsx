import type { Metadata } from 'next';
import './globals.css';
import { SettingsMenu } from '@/components/SettingsMenu';
import { FontLoader } from '@/components/FontLoader';

export const metadata: Metadata = {
  title: 'Kittens - Montessori AI Lessons',
  description: 'A beautiful way to learn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FontLoader />
        {children}
        <SettingsMenu />
      </body>
    </html>
  );
}
