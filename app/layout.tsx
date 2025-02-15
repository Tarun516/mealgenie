import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Provider from '@/components/Provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({

  children,
}: {
  children: React.ReactNode
}) {
  return (
   
      <html lang="en" data-theme="light">
        <body className={inter.className}>
          <Provider>
          <main className="container mx-auto p-4">
            {children}
          </main>
          <Toaster position="bottom-right" />
          </Provider>
        </body>
      </html>
  
  );
}