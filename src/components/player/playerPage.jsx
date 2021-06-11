import React from 'react';
import PlayerVideo from './playerVideo';
import styles from './playerPage.module.css';
import { useCallback, useEffect, useState } from 'react/cjs/react.development';
import CurrentComment from './current_comment';
import { memo } from 'react/cjs/react.production.min';

const PlayerPage = memo(({ nemo, player, youtube }) => {
  const [currentVideo, setCurrentVideo] = useState(
    nemo.videos.filter((video) => video.id.videoId === player.video.id.videoId).length ===
      1
      ? player.video
      : nemo.videos[0]
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

  const getDescription = useCallback(
    (id) => {
      youtube.description(id).then((snippet) => setDescription(snippet));
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

  return (
    <div className={styles.page}>
      <div className={styles.nemoTitle}>{nemo.nemoTitle}</div>
      <div className={styles.grid}>
        <div
          className={styles.ytPlayer}
          style={{
            gridColumn: `auto/span 3`,
          }}
        >
          <iframe
            className={styles.videoPlayer}
            title="yt video player"
            id="ytplayer"
            type="text/html"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.id.videoId}?modestbranding=1`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div
          className={styles.videoList}
          style={{
            gridColumn: `auto/span 1`,
            gridRow: `auto/span 7`,
          }}
        >
          {nemo.double
            ? nemo.videos.map(
                (video, index) =>
                  index < (nemo.column * nemo.row) / 4 && (
                    <PlayerVideo
                      key={index}
                      video={video}
                      currentVideo={currentVideo}
                      setCurrentVideo={setCurrentVideo}
                      getDescription={getDescription}
                      getComments={getComments}
                    />
                  )
              )
            : nemo.videos.map(
                (video, index) =>
                  index < nemo.column * nemo.row && (
                    <PlayerVideo
                      key={index}
                      video={video}
                      currentVideo={currentVideo}
                      setCurrentVideo={setCurrentVideo}
                      getDescription={getDescription}
                      getComments={getComments}
                    />
                  )
              )}
        </div>
        <div
          className={styles.meta}
          style={{
            gridColumn: `auto/span 3`,
            gridRow: `auto/span 1`,
          }}
        >
          {description && (
            <div>
              <div className={styles.title}>{description.title}</div>
              <div className={styles.date}>{description.publishedAt.slice(0, 10)}</div>
              <div
                style={{ borderTop: '1px solid grey ', margin: '0.5em 0 -0.5em 0' }}
              ></div>
            </div>
          )}
        </div>
        <div
          className={styles.commentList}
          style={{
            gridColumn: `auto/span 3`,
            gridRow: `auto/span 5`,
          }}
        >
          {description && (
            <div className={styles.description}>{description.description}</div>
          )}
          <div style={{ borderTop: '1px solid grey ', margin: '0.5em' }}></div>

          {comments &&
            comments.map((comment, index) => (
              <CurrentComment comment={comment} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
});

export default PlayerPage;
