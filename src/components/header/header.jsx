import React, { useEffect, useState } from 'react';
import Login from '../login/login';
import styles from './header.module.css';
import _ from 'lodash';
import { memo } from 'react/cjs/react.production.min';

const Header = memo(({ authService, user, logOut }) => {
  const [pageDown, setPageDown] = useState(false);
  const [toggle, setToggle] = useState(false);

  const userToggle = () => {
    setToggle((toggle) => !toggle);
  };

  const scrollEvent = _.throttle(() => {
    if (window.scrollY > 200) {
      setPageDown(true);
    } else setPageDown(false);
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);
    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [scrollEvent]);
  return (
    <header
      id="header"
      className={styles.header}
      style={{ fontSize: pageDown ? '0.6em' : '0.8em' }}
    >
      <div className={styles.logo}>
        <span className={styles.your}>Your</span>
        <span className={styles.tube}>Tube</span>
      </div>
      {user.uid ? (
        <div className={styles.logOn}>
          <i
            className={`far fa-user-circle ${styles.userIcon}`}
            onClick={userToggle}
            style={{ fontSize: 1.8 + 'em' }}
          />
          {toggle && (
            <div className={styles.userModal}>
              <div className={styles.triangle} />
              <div className={styles.userFlex} style={{ fontSize: 1 + 'rem' }}>
                <div className={styles.userFlex2}>
                  <button className={styles.logOut} onClick={logOut}>
                    LogOut!
                  </button>
                  <img src={user.photoURL} alt="user" className={styles.userImg} />
                </div>
                <span>{user.displayName}</span>
                <span>{user.email}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.login} style={{ fontSize: 1.2 + 'em' }}>
          <span className={styles.loginwith}>login with</span>
          <Login authService={authService} />
        </div>
      )}
    </header>
  );
});

export default Header;
