import React, { useEffect, useState } from 'react';
import Login from '../login/login';
import styles from './header.module.css';
import _ from 'lodash';
import { memo } from 'react/cjs/react.production.min';
import UserModal from './userModal';
import DayNight from './dayNight';
import { COLORS } from '../../common/colors';

const Header = memo(
  ({ authService, user, logOut, darkTheme, setDarkTheme, dbService }) => {
    const [pageDown, setPageDown] = useState(false);
    const [toggle, setToggle] = useState(false);

    const themeToggle = () => {
      setDarkTheme((darkTheme) => !darkTheme);
      // console.log(darkTheme);
      user.uid && dbService.setTheme(user.uid, !darkTheme);
    };

    const userToggle = () => {
      setToggle((toggle) => !toggle);
    };

    useEffect(() => {
      const scrollEvent = _.throttle(() => {
        window.scrollY === 0 ? setPageDown(false) : setPageDown(true);
      }, 10);
      window.addEventListener('scroll', scrollEvent);
      return () => {
        window.removeEventListener('scroll', scrollEvent);
      };
    }, []);
    return (
      <header
        id="header"
        className={styles.header}
        style={{
          fontSize: pageDown ? '0.6em' : '0.85em',
          backgroundColor: darkTheme ? COLORS.Dgrey1 : COLORS.Lgrey1,
        }}
      >
        <div className={styles.logo}>
          <span className={styles.your}>Your</span>
          <span className={styles.tube}>Tube</span>
        </div>
        <div className={styles.right}>
          {user.uid ? (
            <div className={styles.logOn}>
              {/* <i class="fas fa-user"></i> */}
              <i
                className={`fas fa-user ${styles.userIcon}`}
                onClick={userToggle}
                style={{ fontSize: 2 + 'em', marginTop: '0.5em' }}
              />
              {toggle && <UserModal user={user} logOut={logOut} darkTheme={darkTheme} />}
            </div>
          ) : (
            <div className={styles.login} style={{ fontSize: 1.2 + 'em' }}>
              <span className={styles.loginwith}>login with</span>
              <Login authService={authService} />
            </div>
          )}
          <DayNight darkTheme={darkTheme} themeToggle={themeToggle} />
        </div>
      </header>
    );
  }
);

export default Header;
