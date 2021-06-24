import React from 'react';
import PlayerPage from './playerPage';
import styles from './player.module.css';
import { useState } from 'react/cjs/react.development';
import { useEffect } from 'react/cjs/react.development';

const Player = ({ player, setPlayer, findPage, order, youtube, darkTheme }) => {
  const [position, setPosition] = useState(order.indexOf(player.nemoId) * 100);
  const [aniReverse, setAniReverse] = useState(false);
  const closePlayer = () => {
    setAniReverse(true);
    setTimeout(() => {
      setPlayer(false);
    }, 600);
  };
  const endPosition = (order.length - 1) * 100;
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
  useEffect(() => {
    setPosition(order.indexOf(player.nemoId) * 100);
  }, [player, order]);

  return (
    <div>
      <div
        className={`${styles.wrap} ${!aniReverse && styles.rotateWrap} ${
          aniReverse && styles.wrapReverse
        }`}
      >
        <div
          className={`${styles.player} ${!aniReverse && styles.rotate3D} ${
            aniReverse && styles.threeReverse
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.slider}
            style={{
              // left: -position + '%',
              transform: `translateX(${-position / order.length}%)`,
            }}
          >
            {order.map((chId) => (
              <PlayerPage
                key={chId}
                player={player}
                nemo={findPage.nemos[chId]}
                youtube={youtube}
                darkTheme={darkTheme}
              />
            ))}
          </div>
          <div className={styles.close} onClick={closePlayer}>
            <i className="fas fa-times-circle"></i>
          </div>
        </div>
      </div>
      {!aniReverse && (
        <div>
          <button className={styles.left} onClick={moveLeft}>
            <i className="fas fa-chevron-left" />
          </button>
          <button className={styles.right} onClick={moveRight}>
            <i className="fas fa-chevron-right" />
          </button>
          <div className={styles.playerClose} onClick={closePlayer}></div>
        </div>
      )}
    </div>
  );
};

export default Player;
