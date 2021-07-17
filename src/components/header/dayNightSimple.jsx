import React, { memo } from 'react';
import styles from './dayNightSimple.module.css';

const DayNightSimple = memo(({ darkTheme, themeToggle }) => {
  return (
    <div className={styles.container} onClick={themeToggle}>
      <div className={`${styles.sun} ${darkTheme ? styles.up : styles.down}`}></div>
      {/* rays */}
      <div className={`${styles.rays} ${darkTheme ? styles.down : styles.up}`}>
        <div className={`${styles.ray} ${styles.deg0} ${styles.long} `}></div>
        <div className={`${styles.ray} ${styles.deg36} ${styles.short} `}></div>
        <div className={`${styles.ray} ${styles.deg72} ${styles.long} `}></div>
        <div className={`${styles.ray} ${styles.deg108} ${styles.short} `}></div>
        <div className={`${styles.ray} ${styles.deg144} ${styles.long} `}></div>
        <div className={`${styles.ray} ${styles.deg180} ${styles.short} `}></div>
        <div className={`${styles.ray} ${styles.deg216} ${styles.long} `}></div>
        <div className={`${styles.ray} ${styles.deg252} ${styles.short} `}></div>
        <div className={`${styles.ray} ${styles.deg288} ${styles.long} `}></div>
        <div className={`${styles.ray} ${styles.deg324} ${styles.short} `}></div>
      </div>
      {/* moon */}
      <div className={`${styles.cover} ${darkTheme ? styles.up : styles.down}`}></div>
      <div className={`${styles.moonIcon} ${darkTheme ? styles.up : styles.down}`}>
        <i className="fas fa-moon"></i>
      </div>
    </div>
  );
});

export default DayNightSimple;
