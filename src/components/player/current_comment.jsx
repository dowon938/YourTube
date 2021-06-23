import React from 'react';
import styles from './current_comment.module.css';

const CurrentComment = ({ comment, darkTheme }) => {
  return (
    <div className={styles.comment}>
      <img
        className={styles.thumbnail}
        src={comment.authorProfileImageUrl}
        alt="profile"
      />
      <div className={styles.metaData}>
        <div className={styles.author}>
          <span>{comment.authorDisplayName}</span>
          <span className={styles.date}>{comment.publishedAt.slice(0, 10)}</span>
          <span className={styles.like}>
            <i className="fas fa-thumbs-up" />
            {' ' + comment.likeCount}
          </span>
        </div>
        <div className={styles.text}>{comment.textOriginal}</div>
      </div>
    </div>
  );
};

export default CurrentComment;
