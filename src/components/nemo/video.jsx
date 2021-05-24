import React from 'react';
import styles from './video.module.css';

const Video = ({ video }) => {
  return (
    <img
      className={styles.img}
      src={video.snippet.thumbnails.medium.url}
      alt="thumnail image"
    />
  );
};

export default Video;
