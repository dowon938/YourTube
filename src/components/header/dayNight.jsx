import React, { memo } from 'react';
import styles from './dayNight.module.css';

const DayNight = memo(({ darkTheme, themeToggle }) => {
  return (
    <div
      className={styles.container}
      onClick={themeToggle}
      style={{
        background: darkTheme
          ? 'linear-gradient(to bottom, #000428, #004e92)'
          : 'linear-gradient(to bottom, #79d2e8, #eaecc6)',
      }}
    >
      <div className={styles.night}>
        <div
          className={styles.mountain1}
          style={{
            transform: darkTheme
              ? 'rotate(55deg)'
              : 'rotate(55deg) translate(100%, 100%)',
          }}
        />
        <div
          className={styles.mountain2}
          style={{
            transform: darkTheme
              ? 'rotate(55deg)'
              : 'rotate(55deg) translate(200%, 200%)',
          }}
        />
        <div className={`${styles.moon} ${darkTheme ? styles.Come : styles.Go}`}>
          <i className="fas fa-moon" />
        </div>
        <div className={`${styles.moon2} ${darkTheme ? styles.Come : styles.Go}`}>
          <i className="fas fa-moon" />
        </div>
      </div>
      <div className={styles.day}>
        <div className={`${styles.sun} ${darkTheme ? styles.Go : styles.Come}`} />
        <div className={`${styles.sun2} ${darkTheme ? styles.Go : styles.Come}`} />
        <div
          className={styles.umbrella}
          style={{
            transform: darkTheme ? 'translate(0,300%)' : '',
          }}
        >
          <i className="fas fa-umbrella-beach" />
        </div>
        <div
          className={styles.sea}
          style={{
            transform: darkTheme ? 'translate(0,100%)' : '',
          }}
        >
          <i className="fas fa-water" />
        </div>
        <div
          className={styles.sand}
          style={{
            transform: darkTheme ? 'translate(0,100%)' : '',
          }}
        >
          <i className="fas fa-water" />
        </div>
        <div
          className={styles.sandBottom}
          style={{
            transform: darkTheme ? 'translate(0,100%)' : '',
          }}
        />
      </div>
    </div>
  );
});

export default DayNight;
