import { Metadata } from 'next';
import CarGrid from './components/CarGrid';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'AutoHub - Find Your Perfect Car',
  description: 'Browse thousands of new and used cars. Find luxury vehicles, sedans, SUVs, and more from trusted dealers.',
  keywords: 'cars for sale, used cars, new cars, car dealership, automotive marketplace',
  openGraph: {
    title: 'AutoHub - Find Your Perfect Car',
    description: 'Browse thousands of new and used cars',
    url: 'https://autohub.com',
    siteName: 'AutoHub',
    images: [
      {
        url: 'https://autohub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AutoHub Car Marketplace',
      },
    ],
  },
};

export default function Home() {
  return (
    <div className='container'>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Find Your Perfect Car</h1>
        <p className={styles.heroSubtitle}>Browse our extensive collection of premium vehicles from trusted dealers</p>
      </section>

      <CarGrid />
    </div>
  );
}
