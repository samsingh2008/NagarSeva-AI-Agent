import type { Metadata } from 'next';
import '../styles/globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'NagarSeva - AI Urban Service Management',
  description: 'An AI-powered platform for urban service management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
