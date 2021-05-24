import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';

const Nemo = ({ nemo, edit }) => {
  const [toggle, setToggle] = useState(false);
  const editTitle = () => {
    setToggle(!toggle);
  };
  console.log('nemo');
  return (
    <div className={`${styles.nemo} ${styles.number}`}>
      <div className={styles.title}>
        {nemo.nemoTitle}
        {/* <i className="fas fa-ellipsis-h" onClick={editTitle}></i> */}
        {edit && <i class="far fa-edit" onClick={editTitle}></i>}
        {edit && <i class="fas fa-minus-circle" onClick={editTitle}></i>}
      </div>
      <div className={styles.imgs}>
        {Object.keys(nemo.videos).map((video) => (
          <Video video={nemo.videos[video]} />
        ))}
      </div>
    </div>
  );
};

export default Nemo;
