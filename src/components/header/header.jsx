import React, { useEffect } from 'react';
import Login from '../login/login';
import styles from './header.module.css';

const Header = ({ authService, setUser }) => {
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
  }, authService);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Your🤞🏻Tube</div>
      <div className={styles.login}>
        <span className={styles.loginwith}>login with</span>
        <Login authService={authService} />
      </div>
    </header>
  );
};

export default Header;
