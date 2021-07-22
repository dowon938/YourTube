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
  const randomValue1 = randomValue(700);
  const randomValue2 = randomValue(150);
  const randomValue3 = randomValue(100);
  const smallStarStyle = {
    width: '1px',
    height: '1px',
    background: 'transparent',
    boxShadow: randomValue1,
  };
  const smallAfterStyle = {
    content: '',
    position: 'absolute',
    top: '100vh',
    width: '1px',
    height: '1px',
    background: 'transparent',
    boxShadow: randomValue1,
  };
  const midiumStarStyle = {
    width: '2px',
    height: '2px',
    background: 'transparent',
    boxShadow: randomValue2,
  };
  const midiumAfterStyle = {
    content: '',
    position: 'absolute',
    top: '100vh',
    width: '2px',
    height: '2px',
    background: 'transparent',
    boxShadow: randomValue2,
  };
  const largeStarStyle = {
    width: '3px',
    height: '3px',
    background: 'transparent',
    boxShadow: randomValue3,
  };
  const largeAfterStyle = {
    content: '',
    position: 'absolute',
    top: '100vh',
    width: '3px',
    height: '3px',
    background: 'transparent',
    boxShadow: randomValue3,
  };
  return (
    <div id="stars">
      <div className={styles.stars1} style={smallStarStyle}>
        <div style={smallAfterStyle}> </div>
      </div>
      <div className={styles.stars2} style={midiumStarStyle}>
        <div style={midiumAfterStyle}> </div>
      </div>
      <div className={styles.stars3} style={largeStarStyle}>
        <div style={largeAfterStyle}> </div>
      </div>
    </div>
  );
};

export default Star;
