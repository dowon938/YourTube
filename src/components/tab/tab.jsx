import React from 'react';
import { useState } from 'react/cjs/react.development';
import styles from './tab.module.css';

const Tab = ({
  page,
  deletePage,
  changePage,
  setSelected,
  selected,
  pageEdit,
  isSample,
}) => {
  const [inputToggle, setInputToggle] = useState(false);
  const onSelect = () => {
    setSelected(page.id);
  };
  const selectedOn = selected === page.id ? styles.on : '';
  const editOn = pageEdit ? styles.editOn : '';
  const sampleStyle = isSample ? styles.sampleStyle : '';
  const editPage = (e) => {
    setInputToggle((inputToggle) => !inputToggle);
  };
  const onDelete = (e) => {
    deletePage(page.id);
  };
  const onChange = (e) => {
    const newPage = { ...page, newTitle: e.target.value };
    changePage(newPage, page.id);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setInputToggle((inputToggle) => !inputToggle);
  };
  return (
    <>
      <div
        data-id={page.id}
        onClick={onSelect}
        className={`${styles.tab} ${selectedOn} ${editOn} ${sampleStyle}`}
      >
        {!inputToggle && (page.newTitle ? page.newTitle : page.pageTitle)}
        {inputToggle && (
          <form onSubmit={onSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="새로운 제목을 입력해주세요"
              value={page.newTitle ? page.newTitle : ''}
              onChange={onChange}
            />
          </form>
        )}
        {!isSample && (
          <span
            className={`${styles.edit} ${selectedOn}`}
            // onClick={(e) => e.stopPropagation()}
          >
            <i className="far fa-edit" onClick={editPage}></i>
            <i className="fas fa-minus-circle" onClick={onDelete}></i>
          </span>
        )}
      </div>
    </>
  );
};

export default Tab;
