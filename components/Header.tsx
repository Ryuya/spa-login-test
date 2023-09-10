import React from 'react';
import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { AuthContext } from './AuthContext';  // AuthContextのパスを適切に指定してください。
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/Header.module.css';
const Header = () => {
  const { user } = useContext(AuthContext);
  console.log("Current user: ", user);
  const auth = getAuth(app);
  const router = useRouter();
  if (router.pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
      router.push('/login');
    });
  };
  

  return (
    <div>
        <header className={styles.header}>
        <nav>
            <div className={styles.navItem}>
        {user ? (
            <button className={styles.button}onClick={handleLogout}>ログアウト</button> // ログアウトボタンを表示
        ) : (
            <Link href="/login">ログイン</Link>
        )}

            </div>
        </nav>
        </header>
        <div className={styles.headerMargin}>
        </div>
    </div>
  );
};

export default Header;
