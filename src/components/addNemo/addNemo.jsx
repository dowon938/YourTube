import React, { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import styles from './addNemo.module.css';

const AddNemo = ({ youtube, modalOn, setModalOn, addNemo }) => {
  const formRef = useRef();
  const inputRef = useRef();
  const [list, setList] = useState([]);
  const onSearch = (event) => {
    event.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value &&
      youtube.search(inputRef.current.value).then((channels) => setList(channels));
    formRef.current.reset();
  };
  const onAdd = (event) => {
    addNemo(event.target.dataset.channelid, event.target.dataset.title);
  };
  const onClose = (event) => {
    setModalOn(false);
  };
  useEffect(() => {
    // console.log(inputRef);
    modalOn && inputRef.current.focus();
  }, [modalOn]);
  return (
    <div className={styles.addModal}>
      <button onClick={onClose} className={styles.close}>
        x
      </button>
      <form ref={formRef} className={styles.form} onSubmit={onSearch}>
        <input
          ref={inputRef}
          type="text"
          className={styles.text}
          placeholder="Search Channel Name!"
        />
        <button className={styles.submit}>
          <i className="fas fa-search"></i>
        </button>
      </form>
      {list
        ? list.map((ch) => (
            <li
              className={styles.chList}
              data-channelid={ch.snippet.channelId}
              data-title={ch.snippet.title}
              onClick={onAdd}
            >
              <img
                className={styles.img}
                src={ch.snippet.thumbnails.medium.url}
                alt="channel thumbnails"
              />
              <span className={styles.span}>{ch.snippet.title}</span>
            </li>
          ))
        : ''}
    </div>
  );
};

export default AddNemo;
