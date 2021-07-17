import React, { memo } from 'react';
import { useState } from 'react/cjs/react.development';
import styles from './tab.module.css';
import { COLORS } from '../../common/colors';

const Tab = memo(
  ({
    page,
    deletePage,
    changePage,
    setSelected,
    selected,
    pageEdit,
    isSampleTab,
    darkTheme,
  }) => {
    const [inputToggle, setInputToggle] = useState(false);
    const onSelect = () => {
      setSelected({ pageId: page.id, isSample: isSampleTab ? true : false });
    };
    const selectedDark = selected.pageId === page.id ? COLORS.Dgrey1 : COLORS.Dgrey3;
    const selectedLight = selected.pageId === page.id ? COLORS.Dgrey1 : COLORS.Lgrey3;
    const selectedLightFont = selected.pageId === page.id ? COLORS.vWhite : COLORS.vBlack;
    const editOn = pageEdit ? styles.editOn : '';
    const [pageTitle, setPageTitle] = useState(
      page && (page.newTitle ? page.newTitle : '')
    );
    // const sampleStyle = isSample ? styles.sampleStyle : '';
    const onDelete = (e) => {
      deletePage(page.id);
    };
    const onChange = (e) => {
      setPageTitle(e.target.value);
    };
    const onSubmit = (e) => {
      e.preventDefault();
      const newPage = { ...page, newTitle: pageTitle };
      changePage(newPage, page.id);
      setInputToggle((inputToggle) => !inputToggle);
    };

    return (
      <>
        <div
          data-id={page.id}
          onClick={onSelect}
          className={`${styles.tab}  ${editOn}`}
          style={{
            backgroundColor: darkTheme ? selectedDark : selectedLight,
            color: darkTheme ? COLORS.vWhite : selectedLightFont,
            fontWeight: selected.pageId === page.id && 500,
            border: selected.pageId === page.id && 'solid 2px rgb(250,250,250,0.5)',
          }}
        >
          <div
            className={styles.hv}
            style={{
              backgroundColor: darkTheme ? COLORS.vWhite : COLORS.vBlack,
            }}
          />
          {!inputToggle && <span>{page.newTitle ? page.newTitle : page.pageTitle}</span>}
          {inputToggle && (
            <form onSubmit={onSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="새로운 제목을 입력해주세요"
                value={pageTitle}
                onChange={onChange}
              />
            </form>
          )}
          {!isSampleTab && (
            <span
              className={`${styles.edit}`}
              // onClick={(e) => e.stopPropagation()}
            >
              <i className="far fa-edit" onClick={onSubmit}></i>
              <i className="fas fa-minus-circle" onClick={onDelete}></i>
            </span>
          )}
        </div>
      </>
    );
  }
);

export default Tab;
