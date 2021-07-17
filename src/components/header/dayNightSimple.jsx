import React, { memo } from 'react';
import styles from './dayNightSimple.module.css';

const DayNightSimple = memo(({ darkTheme, themeToggle }) => {
  return (
    <div className={styles.container} onClick={themeToggle}>
      <div
        className={styles.sunContainer}
        style={{
          opacity: darkTheme ? 0 : 1,
        }}
      >
        <div className={styles.sun}></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(0deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(30deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(60deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(90deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(120deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(150deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(180deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(210deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(240deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(270deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.long} `}
          style={{
            transform: darkTheme ? '' : 'rotate(300deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
        <div
          className={`${styles.ray} ${styles.short} `}
          style={{
            transform: darkTheme ? '' : 'rotate(330deg)',
            opacity: darkTheme ? 0 : 1,
          }}
        ></div>
      </div>
      <div
        className={styles.moonContainer}
        style={{
          opacity: darkTheme ? 1 : 0,
        }}
      >
        <div className={styles.moon}></div>
        <div className={styles.cover}></div>
      </div>
    </div>
  );
});

export default DayNightSimple;
