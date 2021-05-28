import React, { useEffect, useState } from 'react';
import Login from '../login/login';
import styles from './header.module.css';

const Header = ({ authService, setUser }) => {
  const [headerEm, setHeaderEm] = useState('1em');
  useEffect(() => {
    authService.onAuthChange((user) => {
      user &&
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
    });
  }, [authService]);
  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY < 140) {
        setHeaderEm(1 - window.scrollY / 350 + 'em');
      }
    });
  }, [window.scrollY]);
  return (
    <header id="header" className={styles.header} style={{ 'font-size': headerEm }}>
      <div className={styles.logo}>
        <span className={styles.your}>Your</span>
        <span className={styles.tube}>Tube</span>
      </div>
      <div className={styles.login}>
        <span className={styles.loginwith}>login with</span>
        <Login authService={authService} />
      </div>
    </header>
  );
};

export default Header;
