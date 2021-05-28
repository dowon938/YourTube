import { faBorderNone } from '@fortawesome/free-solid-svg-icons';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';

const Nemo = ({ nemoPre, edit, deleteNemo, changeNemoTitle }) => {
  const [nemo, setNemo] = useState(nemoPre);
  const [toggle, setToggle] = useState(false);
  const [inputToggle, setInputToggle] = useState(false);
  const editTitle = () => {
    setInputToggle(!inputToggle);
  };
  const onDelete = (e) => {
    deleteNemo(nemo.nemoId);
    console.log(nemo);
  };
  const onChange = (e) => {
    const newNemo = { ...nemo, newTitle: e.target.value };
    setNemo(newNemo);
    changeNemoTitle(newNemo);
  };
  return (
    <div className={`${styles.nemo} ${styles.number}`}>
      <div className={styles.title}>
        {inputToggle && (
          <input
            type="text"
            // id={nemo.nemoId + 'title'}
            placeholder="새로운 제목을 입력해주세요"
            value={nemo.newTitle ? nemo.newTitle : ''}
            onChange={onChange}
          />
        )}
        {!inputToggle && (nemo.newTitle ? nemo.newTitle : nemo.nemoTitle)}
        {edit && <i className="far fa-edit" onClick={editTitle}></i>}
        {edit && <i className="fas fa-minus-circle" onClick={onDelete}></i>}
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
