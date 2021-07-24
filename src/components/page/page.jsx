import React, { useState, useEffect, memo, useCallback } from 'react';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';

const Page = memo(
  ({
    pageId,
    isSample,
    sample,
    pages,
    youtube,
    addNemo,
    saveNemo,
    saveOrder,
    deleteNemo,
    onPlayer,
    darkTheme,
    addChannel,
    addPlayList,
    addVideo,
  }) => {
    const [findPage, setFindPage] = useState(isSample ? sample[pageId] : pages[pageId]);
    const [edit, setEdit] = useState(false);
    const [someDragging, setSomeDragging] = useState(false);
    const [rotate, setRotate] = useState(false);

    useEffect(() => {
      isSample ? setFindPage(sample[pageId]) : setFindPage(pages[pageId]);
    }, [pageId, sample, pages, isSample]);

    const onEdit = (event) => {
      setEdit((edit) => !edit);
    };

    //플레이어
    const pagePlayer = (nemoId, videoId) => {
      findPage && nemoId && videoId && onPlayer(findPage, nemoId, videoId);
    };

    //드래그 앤 드랍
    const moveNemo = useCallback(
      (nemoId, toIndex) => {
        const index = findPage.order.indexOf(nemoId);
        if (index === toIndex) return;
        let newOrder = [...findPage.order];
        newOrder.splice(index, 1);
        newOrder.splice(toIndex, 0, nemoId);
        saveOrder(newOrder);
      },
      [findPage, saveOrder]
    );
    //새로고침
    const onRefresh = () => {
      setRotate(true);
      findPage.order &&
        findPage.order.forEach((nemoId) => {
          const nemo = findPage.nemos[nemoId];
          nemo.channelId && addChannel(nemo.channelId, nemo.originTitle, nemo);
          nemo.playListId && addPlayList(nemo.playListId, nemo);
          console.log(
            `i have ${
              (nemo.channelId && 'channelId') ||
              (nemo.playListId && 'playListId') ||
              'no Id'
            }`
          );
        });

      setTimeout(() => {
        setRotate(false);
      }, 900);
    };

    const themeClass = darkTheme ? styles.dark : styles.light;
    const editOn = edit ? styles.editOn : '';

    return (
      <div className={`${styles.page} ${themeClass}`}>
        <div className={styles.menuBar}>
          <button
            className={`${styles.refresh} ${themeClass}`}
            title="재생목록을 다시 불러옵니다."
            onClick={onRefresh}
          >
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} />
            <i className={`fas fa-redo ${rotate && styles.rotate}`} />
          </button>
          <button className={`${styles.plus} ${themeClass}`} onClick={addNemo}>
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} /> + 네모 만들기!
          </button>
          <button className={`${styles.edit} ${themeClass} ${editOn}`} onClick={onEdit}>
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} />
            네모 수정하기
          </button>
        </div>
        <div className={styles.grid}>
          {findPage &&
            findPage.order !== undefined &&
            findPage.order.map((id, index) => (
              // console.log(findPage.nemos[chId].videos)
              <Nemo
                key={id}
                index={index}
                id={id}
                nemo={findPage.nemos[id]}
                edit={edit}
                saveNemo={saveNemo}
                deleteNemo={deleteNemo}
                moveNemo={moveNemo}
                addNemo={addNemo}
                pagePlayer={pagePlayer}
                someDragging={someDragging}
                setSomeDragging={setSomeDragging}
                darkTheme={darkTheme}
                addChannel={addChannel}
                youtube={youtube}
                addPlayList={addPlayList}
                addVideo={addVideo}
              />
            ))}
        </div>
      </div>
    );
  }
);

export default Page;
