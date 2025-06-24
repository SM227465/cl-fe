'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import styles from './Header.module.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className='container'>
        <div className={styles.nav}>
          <Link href='/' className={styles.logo}>
            <span className={styles.logoIcon}>🚗</span>
            AutoHub
          </Link>

          <nav className={styles.navLinks}>
            <Link href='/' className={styles.navLink}>
              Home
            </Link>
            <Link href='/admin/add' className={styles.navLink}>
              Add Car
            </Link>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
