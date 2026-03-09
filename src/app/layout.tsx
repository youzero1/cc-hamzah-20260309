import 'reflect-metadata';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'cc - Social Calculator',
  description: 'A social media-inspired calculator app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
