import React from 'react';
import { memo } from 'react';
import styles from './video.module.css';

const Video = memo(({ video, double }) => {
  return (
    <div
      className={styles.container}
      style={{
        gridColumn: double ? `auto/span 2` : '',
        gridRow: double ? `auto/span 2` : '',
      }}
    >
      <img
        className={styles.img}
        src={video.snippet.thumbnails.medium.url}
        alt="thumnail"
      />
    </div>
  );
});

export default Video;
