import React, { useState } from 'react';
import styles from './help.module.css';

const Help = ({ helpToggle, setCookie, removeCookie }) => {
  const [position, setPosition] = useState(0);

  const endPosition = (4 - 1) * 100;
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
  const moveTo = (num) => {
    setPosition((num - 1) * 100);
  };
  const popUpCheck = (e) => {
    e.target.checked ? setCookie('popUp', 'true', { path: '/' }) : removeCookie('popUp');
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
          <img src="/imgs/help/1.jpg" alt="help1" />
          <img src="/imgs/help/2.jpg" alt="help2" />
          <img src="/imgs/help/3.jpg" alt="help3" />
          <img src="/imgs/help/4.jpg" alt="help3" />
        </div>
        <div className={styles.navigator}>
          <button
            style={{ backgroundColor: position >= 0 && 'rgb(40, 192, 115)' }}
            onClick={() => moveTo(1)}
          ></button>
          <button
            style={{ backgroundColor: position >= 100 && 'rgb(40, 192, 115)' }}
            onClick={() => moveTo(2)}
          ></button>
          <button
            style={{ backgroundColor: position >= 200 && 'rgb(40, 192, 115)' }}
            onClick={() => moveTo(3)}
          ></button>
          <button
            style={{ backgroundColor: position >= 300 && 'rgb(40, 192, 115)' }}
            onClick={() => moveTo(4)}
          ></button>
        </div>
        <div className={styles.cookieCheck}>
          <label htmlFor="cookie">다시는 자동으로 열지 않음</label>
          <input
            type="checkbox"
            name="cookieCheckbox"
            id="cookie"
            onChange={popUpCheck}
          />
        </div>
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
