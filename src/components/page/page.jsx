import React, { memo, useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';

const Page = memo(
  ({
    userId,
    pageId,
    isSample,
    sample,
    pages,
    order,
    setOrder,
    dbService,
    youtube,
    addNemo,
    saveNemo,
    deleteNemo,
    onPlayer,
    darkTheme,
    addChannel,
    addPlayList,
    addVideo,
  }) => {
    const [findPage, setFindPage] = useState(false);
    const [edit, setEdit] = useState(false);
    const [someDragging, setSomeDragging] = useState(false);
    useEffect(() => {
      sample[pageId] ? setFindPage(sample[pageId]) : setFindPage(pages[pageId]);
    }, [pageId, sample, pages]);

    const onEdit = (event) => {
      setEdit((edit) => !edit);
    };

    //플레이어
    const pagePlayer = (nemoId, videoId) => {
      findPage && nemoId && videoId && onPlayer(findPage, nemoId, videoId);
    };

    const editOn = edit ? styles.editOn : '';
    //드래그 앤 드랍
    const moveNemo = useCallback(
      (nemoId, toIndex) => {
        const index = order.indexOf(nemoId);
        let newOrder = [...order];
        newOrder.splice(index, 1);
        newOrder.splice(toIndex, 0, nemoId);
        isSample ? setOrder(newOrder) : dbService.setOrder(userId, pageId, newOrder);
      },
      [order, setOrder, dbService, isSample, pageId, userId]
    );

    const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
    const themeClass = darkTheme ? styles.dark : styles.light;

    return (
      <div className={`${styles.page} ${themeClass}`} ref={drop}>
        <div className={styles.menuBar}>
          <button className={`${styles.plus} ${themeClass}`} onClick={addNemo}>
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} /> + 네모 만들기!
          </button>
          <div className={`${styles.edit} ${themeClass} ${editOn}`} onClick={onEdit}>
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} />
            네모 수정하기
          </div>
        </div>
        <div className={styles.grid}>
          {findPage &&
            order &&
            order.map((chId, index) => (
              // console.log(findPage.nemos[chId].videos)
              <Nemo
                key={chId}
                index={index}
                id={chId}
                nemo={findPage.nemos[chId]}
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
