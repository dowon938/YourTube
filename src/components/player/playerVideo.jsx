import React from 'react';
import { memo } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import styles from './playerVideo.module.css';

const PlayerVideo = memo(
  ({ video, setCurrentVideo, currentVideo, getComments, getDescription, darkTheme }) => {
    const onChange = () => {
      getDescription(video.videoId);
      getComments(video.videoId);
      setCurrentVideo(video);
    };
    const [isCurrent, setIsCurrent] = useState(
      video.videoId === currentVideo.videoId ? true : false
    );

    useEffect(() => {
      if (video.videoId === currentVideo.videoId) setIsCurrent(true);
      else setIsCurrent(false);
    }, [currentVideo, video.videoId]);

    const themeClass = darkTheme ? styles.dark : styles.light;

    return (
      <div className={styles.flex} onClick={onChange}>
        <div
          className={styles.container}
          style={{
            border: isCurrent ? '2px solid tomato' : '',
          }}
        >
          <img
            className={styles.img}
            src={video.snippet.thumbnails.medium.url}
            alt="thumnail"
          />
        </div>
        <div className={`${styles.title} ${themeClass}`}>{video.snippet.title}</div>
      </div>
    );
  }
);

export default PlayerVideo;
