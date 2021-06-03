import React, { useEffect, useState } from 'react';
import Login from '../login/login';
import styles from './header.module.css';
import _ from 'lodash';

const Header = ({ authService, setUser }) => {
  const [headerEm, setHeaderEm] = useState(1);
  const scrollEvent = _.throttle(() => {
    if (window.scrollY < 140) {
      const em = 1 - Math.round(window.scrollY / 3.5) / 100;
      setHeaderEm(em);
    }
  }, 200);

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
  }, [authService, setUser]);

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [scrollEvent]);
  return (
    <header id="header" className={styles.header} style={{ fontSize: headerEm + 'em' }}>
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
