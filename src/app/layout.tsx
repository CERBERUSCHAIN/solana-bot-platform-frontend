import { Inter } from 'next/font/google';
import './globals.css';

// Use Inter instead of Geist
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'CERBERUS Bot Platform',
  description: 'Advanced trading bot platform for Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
