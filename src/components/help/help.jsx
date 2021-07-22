import React, { useState } from 'react';
import styles from './help.module.css';

const Help = ({ helpToggle }) => {
  const [position, setPosition] = useState(0);

  const endPosition = 2 * 100;
  const moveLeft = () => {
    let newPositon = position - 100;
    if (newPositon < 0) newPositon = endPosition;
    setPosition(newPositon);
  };
  const moveRight = () => {
    let newPositon = position + 100;
    if (newPositon > endPosition) newPositon = 0;
    setPosition(newPositon);
  };
  return (
    <div className={styles.helpContainer}>
      <button className={styles.close} onClick={helpToggle}>
        <i className="fas fa-times"></i>
      </button>
      <div className={styles.helpContents}>
        <div
          className={styles.slider}
          style={{
            // left: -position + '%',
            transform: `translateX(${-position}%)`,
          }}
        >
          <img src="/imgs/help/1.png" alt="help1" />
          <img src="/imgs/help/2.png" alt="help2" />
          <img src="/imgs/help/3.png" alt="help3" />
        </div>
        <div className={styles.count}>{position / 100 + 1 + '/3'}</div>
      </div>
      <button className={styles.left} onClick={moveLeft}>
        <i className="fas fa-chevron-left" />
      </button>
      <button className={styles.right} onClick={moveRight}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
};

export default Help;
