import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConditionalNav } from '@/components/navigation/conditional-nav';
import { NotificationProvider } from '@/hooks/useNotifications';
import { NotificationContainer } from '@/components/notifications/NotificationContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BNP Paribas - Ma Banque',
  description: 'Maîtrisez votre budget en toute simplicité',
  icons: {
    icon: '/BNP-Paribas-Emblem.png',
    shortcut: '/BNP-Paribas-Emblem.png',
    apple: '/BNP-Paribas-Emblem.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NotificationProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <ConditionalNav />
          <NotificationContainer />
        </NotificationProvider>
      </body>
    </html>
  );
}
