import React, { useEffect, useState } from 'react';
import Login from '../login/login';
import styles from './header.module.css';
import _ from 'lodash';
import { memo } from 'react/cjs/react.production.min';
import UserModal from './userModal';
import DayNightSimple from './dayNightSimple';

const Header = memo(
  ({ authService, user, logOut, darkTheme, setDarkTheme, dbService }) => {
    const [pageDown, setPageDown] = useState(false);
    const [toggle, setToggle] = useState(false);

    const themeToggle = () => {
      const newTheme = !darkTheme;
      setDarkTheme(newTheme);
      user.uid && dbService.setTheme(user.uid, newTheme);
    };
    const userToggle = () => {
      setToggle((toggle) => !toggle);
    };
    useEffect(() => {
      const scrollEvent = _.debounce(() => {
        window.scrollY === 0 ? setPageDown(false) : setPageDown(true);
        // console.log('scroll');
      }, 200);
      window.addEventListener('scroll', scrollEvent);
      return () => {
        window.removeEventListener('scroll', scrollEvent);
      };
    }, []);

    const themeClass = darkTheme ? styles.dark : styles.light;

    return (
      <header
        id="header"
        className={`${styles.header} ${themeClass} ${pageDown && styles.pageDown}`}
      >
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={styles.your}>Your</span>
            <span className={styles.tube}>Tube</span>
          </div>
          <div className={styles.right}>
            {user.uid ? (
              <div className={styles.logOn}>
                <i className={`fas fa-user ${styles.userIcon}`} onClick={userToggle} />
                {toggle && (
                  <UserModal user={user} logOut={logOut} darkTheme={darkTheme} />
                )}
              </div>
            ) : (
              <div className={styles.login}>
                <span className={styles.loginwith}>login with</span>
                <Login authService={authService} />
              </div>
            )}
            <DayNightSimple darkTheme={darkTheme} themeToggle={themeToggle} />
          </div>
        </div>
      </header>
    );
  }
);

export default Header;
