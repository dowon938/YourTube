import React from 'react';
import styles from './help.module.css';

const Help = ({ helpToggle }) => {
  return (
    <div className={styles.helpContainer}>
      <button className={styles.close} onClick={helpToggle}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Help;
