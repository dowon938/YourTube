import React from 'react';
import PlayerVideo from './playerVideo';
import styles from './playerPage.module.css';
import { useCallback, useEffect, useState } from 'react/cjs/react.development';
import CurrentComment from './current_comment';
import { memo } from 'react/cjs/react.production.min';
import YouTube from 'react-youtube';

const PlayerPage = memo(({ nemo, player, youtube, darkTheme }) => {
  const [currentVideo, setCurrentVideo] = useState(
    nemo.nemoId === player.nemoId ? player.video : nemo.videos[0]
  );
  const getComments = useCallback(
    (id) => {
      youtube
        .comments(id) //
        .then((items) =>
          items
            ? items.map((item) => ({
                ...item.snippet.topLevelComment.snippet,
              }))
            : items
        )
        .then((comment) => setComments(comment));
      console.log('cm');
    },
    [youtube]
  );

  const onReady = (e) => {
    e.target.pauseVideo();
    e.target.setVolume(50);
  };

  const getDescription = useCallback(
    (id) => {
      youtube.description(id).then((data) => {
        data.items.length !== 0 && setDescription(data.items[0].snippet);
      });
      console.log('ds');
    },
    [youtube]
  );

  const [comments, setComments] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    getComments(currentVideo.id.videoId);
    getDescription(currentVideo.id.videoId);
  }, [currentVideo, getComments, getDescription]);
  useEffect(() => {
    nemo.nemoId === player.nemoId && setCurrentVideo(player.video);
  }, [player, nemo.nemoId]);

  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div className={`${styles.page} ${themeClass}`}>
      <div className={`${styles.nemoTitle} ${themeClass}`}>{nemo.nemoTitle}</div>
      <div className={styles.grid}>
        <div
          className={styles.ytPlayer}
          style={{
            gridColumn: `auto/span 3`,
          }}
        >
          <YouTube
            className={styles.videoPlayer}
            videoId={currentVideo.id.videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 0,
                modestbranding: 1,
              },
            }}
            onReady={onReady}
          />
        </div>
        <div
          className={`${styles.videoList} ${themeClass}`}
          style={{
            gridColumn: `auto/span 1`,
            gridRow: `auto/span 7`,
          }}
        >
          {nemo.videos.map(
            (video, index) =>
              index < 10 && (
                <PlayerVideo
                  key={index}
                  video={video}
                  currentVideo={currentVideo}
                  setCurrentVideo={setCurrentVideo}
                  getDescription={getDescription}
                  getComments={getComments}
                  darkTheme={darkTheme}
                />
              )
          )}
        </div>
        <div
          className={`${styles.commentList} ${themeClass}`}
          style={{
            gridColumn: `auto/span 3`,
            gridRow: `auto/span 6`,
          }}
        >
          {description && (
            <div className={`${styles.meta} ${themeClass}`}>
              <div className={styles.title}>{description.title}</div>
              <div className={styles.date}>{description.publishedAt.slice(0, 10)}</div>
              <div style={{ borderTop: '1px solid grey ', margin: '0.5em 0' }}></div>
              <div className={styles.description}>{description.description}</div>
              <div style={{ borderTop: '1px solid grey ', margin: '0.5em 0' }}></div>
            </div>
          )}
          {comments &&
            comments.map((comment, index) => (
              <CurrentComment comment={comment} key={index} darkTheme={darkTheme} />
            ))}
        </div>
      </div>
    </div>
  );
});

export default PlayerPage;
