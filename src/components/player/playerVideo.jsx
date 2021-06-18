import React from 'react';
import { memo } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import styles from './playerVideo.module.css';

const PlayerVideo = memo(
  ({ video, setCurrentVideo, currentVideo, getComments, getDescription }) => {
    const onChange = () => {
      getDescription(video.id.videoId);
      getComments(video.id.videoId);
      setCurrentVideo(video);
    };
    const [isCurrent, setIsCurrent] = useState(
      video.id.videoId === currentVideo.id.videoId ? true : false
    );

    useEffect(() => {
      if (video.id.videoId === currentVideo.id.videoId) setIsCurrent(true);
      else setIsCurrent(false);
    }, [currentVideo, video.id.videoId]);

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
        <div className={styles.title}>{video.snippet.title}</div>
      </div>
    );
  }
);

export default PlayerVideo;
