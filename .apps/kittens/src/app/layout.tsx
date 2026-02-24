import type { Metadata } from 'next';
import './globals.css';
import ThemeStyles from '@/components/ThemeStyles';
import { ThemeProvider } from '@/components/ThemeProvider';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyles />
      </head>
      <body className="antialiased font-sans text-foreground bg-background selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider>
          <FontLoader />
          {children}
          <SettingsMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
