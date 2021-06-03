import React from 'react';
import { useState } from 'react/cjs/react.development';
import styles from './video.module.css';

const Video = ({ video, double }) => {
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
};

export default Video;
