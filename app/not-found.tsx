import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className='container'>
      <div className={styles.notFound}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Car Not Found</h2>
          <p className={styles.description}>The car you're looking for doesn't exist or has been removed from our inventory.</p>
          <Link href='/' className='btn btn-primary'>
            Browse All Cars
          </Link>
        </div>
      </div>
    </div>
  );
}
