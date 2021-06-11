import React from 'react';
import PlayerPage from './playerPage';
import styles from './player.module.css';
import { useState } from 'react/cjs/react.development';

const Player = ({ player, setPlayer, findPage, order, youtube }) => {
  const [position, setPosition] = useState(order.indexOf(player.nemoId) * 100);
  const closePlayer = () => {
    setPlayer(false);
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

  return (
    <div>
      <button className={styles.left} onClick={moveLeft}>
        <i className="fas fa-chevron-left" />
      </button>
      <div className={styles.player} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.slider}
          style={{
            left: -position + '%',
          }}
        >
          {order.map((chId) => (
            <PlayerPage
              key={chId}
              player={player}
              nemo={findPage.nemos[chId]}
              youtube={youtube}
            />
          ))}
        </div>
      </div>
      <button className={styles.right} onClick={moveRight}>
        <i className="fas fa-chevron-right" />
      </button>
      <div className={styles.playerClose} onClick={closePlayer}></div>
    </div>
  );
};

export default Player;
