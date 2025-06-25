'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('test.user@gmail.com');
  const [password, setPassword] = useState('Test@1234');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hasAccessToken = document.cookie.split('; ').find((row) => row.startsWith('accessToken='));

    if (hasAccessToken) {
      router.replace('/'); // redirect to dashboard if token exists
    }
  }, [router]);

  const setCookie = (name: string, value: string, maxAge: number) => {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; secure; samesite=strict`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('https://car-list-863m.onrender.com/api/v1/auth/login/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      const accessToken = data.tokens.access.token;
      const refreshToken = data.tokens.refresh.token;
      const accessExpiresIn = data.tokens.access.expiresIn; // in ms
      const refreshExpiresIn = data.tokens.refresh.expiresIn; // in ms

      // Convert milliseconds to seconds for max-age
      setCookie('accessToken', accessToken, accessExpiresIn / 1000);
      setCookie('refreshToken', refreshToken, refreshExpiresIn / 1000);
      setMessage('Login successful!');

      router.replace('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {message && (
            <p
              style={{
                marginTop: '1rem',
                color: message.toLowerCase().includes('success') ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
