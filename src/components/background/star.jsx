import { random } from 'lodash';
import React from 'react';
import styles from './star.module.css';

const Star = (props) => {
  const randomValue = (number) => {
    let value = `${random(100)}vw ${random(100)}vh #FFF`;
    for (let i = 0; i < number; i++) {
      value = `${value} , ${random(100)}vw ${random(200)}vh #FFF`;
    }
    return value;
  };
  const randomValue1 = randomValue(500);
  const randomValue2 = randomValue(200);
  const randomValue3 = randomValue(100);
  return (
    <div id="stars">
      <div
        className={styles.stars1}
        style={{
          boxShadow: randomValue1,
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: '100vh',
            width: '1px',
            height: '1px',
            backgroundColor: 'transparent',
            boxShadow: randomValue1,
          }}
        >
          {' '}
        </div>
      </div>
      <div
        className={styles.stars2}
        style={{
          boxShadow: randomValue2,
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: '100vh',
            width: '2px',
            height: '2px',
            backgroundColor: 'transparent',
            boxShadow: randomValue2,
          }}
        >
          {' '}
        </div>
      </div>
      <div
        className={styles.stars3}
        style={{
          boxShadow: randomValue3,
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            top: '100vh',
            width: '3px',
            height: '3px',
            backgroundColor: 'transparent',
            boxShadow: randomValue3,
          }}
        >
          {' '}
        </div>
      </div>
    </div>
  );
};

export default Star;
