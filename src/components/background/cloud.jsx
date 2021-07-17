import React from 'react';
import styles from './cloud.module.css';

const Cloud = (props) => {
  return (
    <div id={styles.clouds}>
      <div
        class={`${styles.cloud} ${styles.x1}`}
        style={{
          left: '10%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x2}`}
        style={{
          left: '30%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x3}`}
        style={{
          left: '20%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x4}`}
        style={{
          left: '50%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x5}`}
        style={{
          left: '40%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x1}`}
        style={{
          left: '70%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x2}`}
        style={{
          left: '100%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x3}`}
        style={{
          left: '10%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x4}`}
        style={{
          left: '80%',
        }}
      ></div>
      <div
        class={`${styles.cloud} ${styles.x5}`}
        style={{
          left: '90%',
        }}
      ></div>
    </div>
  );
};

export default Cloud;
