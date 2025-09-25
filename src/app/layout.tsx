import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/Provider';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '@/components/SessionProvider';
import ThemeProvider from '@/components/ThemeProvider';
import ConditionalLayout from '@/components/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Muhammad Tahir Sultan- Portfolio',
  description: 'Professional Web Development Services by Muhammad Tahir in MERN Stack and Webflow in UK, USA, Australia',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionProvider>
          <ReduxProvider>
            <ThemeProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <Toaster position="top-center" />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}