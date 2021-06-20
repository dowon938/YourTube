import React, { memo } from 'react';
import { useState } from 'react/cjs/react.development';
import styles from './tab.module.css';

const Tab = memo(
  ({ page, deletePage, changePage, setSelected, selected, pageEdit, isSampleTab }) => {
    const [inputToggle, setInputToggle] = useState(false);
    const onSelect = () => {
      setSelected({ pageId: page.id, isSample: isSampleTab ? true : false });
    };
    const selectedOn = selected.pageId === page.id ? styles.on : '';
    const editOn = pageEdit ? styles.editOn : '';
    // const sampleStyle = isSample ? styles.sampleStyle : '';
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
          className={`${styles.tab} ${selectedOn} ${editOn}`}
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
          {!isSampleTab && (
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
  }
);

export default Tab;
