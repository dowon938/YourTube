import React from 'react';
import { memo } from 'react';
import YouTube from 'react-youtube';
import { useState } from 'react/cjs/react.development';
import styles from './video.module.css';

const Video = memo(({ video, double, nemoPlayer }) => {
  const [play, setPlay] = useState(false);
  const [vol, setVol] = useState(50);
  const [YT, setYT] = useState();
  const onPlay = () => {
    setPlay((play) => !play);
  };
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
    },
  };
  const onReady = (e) => {
    e.target.pauseVideo();
    e.target.setVolume(50);
    setYT(e.target);
  };
  const changeVolume = (e) => {
    setVol(e.target.value);
    YT.setVolume(e.target.value);
  };
  const onChange = (e) => {
    setVol(YT.getVolume());
  };
  return (
    <div
      className={styles.flex}
      style={{
        gridColumn: double ? `auto/span 2` : '',
        gridRow: double ? `auto/span 2` : '',
      }}
    >
      <div className={styles.container}>
        {play && (
          <div>
            <YouTube
              className={styles.videoPlayer}
              videoId={video.id.videoId}
              opts={opts}
              onReady={onReady}
              onStateChange={onChange}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={vol}
              className={styles.volume}
              onChange={changeVolume}
            />
            <button className={styles.closePlay} onClick={onPlay}>
              x
            </button>
          </div>
        )}
        <div className={styles.over}>
          <div className={styles.title}>{video.snippet.title}</div>
          <div
            className={styles.overIcon}
            style={{
              fontSize: double ? `1.5em` : '0.8em',
            }}
          >
            <i className="fas fa-play-circle" onClick={onPlay} />
            <i className="far fa-clone" onClick={() => nemoPlayer(video)} />
          </div>
        </div>
        <img
          className={styles.img}
          src={video.snippet.thumbnails.medium.url}
          alt="thumnail"
        />
      </div>
      <div className={styles.title}>{video.snippet.title}</div>
    </div>
  );
});

export default Video;
