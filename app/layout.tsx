import { Inter } from 'next/font/google';
import { ThemeProvider } from './components/ThemeProvider';
import './globals.css';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AutoHub - Premium Car Marketplace',
  description:
    'Find your perfect car from our extensive collection of new and used vehicles. Browse luxury cars, sedans, SUVs and more.',
  keywords: 'cars, automotive, buy car, sell car, used cars, new cars, luxury cars',
  authors: [{ name: 'AutoHub' }],
  openGraph: {
    title: 'AutoHub - Premium Car Marketplace',
    description: 'Find your perfect car from our extensive collection',
    type: 'website',
    url: 'https://autohub.com',
    siteName: 'AutoHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoHub - Premium Car Marketplace',
    description: 'Find your perfect car from our extensive collection',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
