import React, { memo, useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import { COLORS } from '../../common/colors';

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
    deleteNemo,
    changeNemo,
    onPlayer,
    setPlayer,
    darkTheme,
  }) => {
    const [findPage, setFindPage] = useState(false);
    const [modalOn, setModalOn] = useState(false);
    const [edit, setEdit] = useState(false);
    const [someDragging, setSomeDragging] = useState(false);
    useEffect(() => {
      sample[pageId] ? setFindPage(sample[pageId]) : setFindPage(pages[pageId]);
    }, [pageId, sample, pages]);
    const onMake = (event) => {
      setModalOn((modalOn) => !modalOn);
    };
    const onEdit = (event) => {
      setEdit((edit) => !edit);
    };

    // useEffect(() => {
    //   findPage &&
    //     findPage.order &&
    //     setPlayer({
    //       findPage,
    //       nemoId: findPage.order[0],
    //       video: findPage.nemos[findPage.order[0]].videos[0],
    //     });
    // }, [findPage, setPlayer]);

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
    return (
      <div
        className={styles.page}
        ref={drop}
        style={{
          backgroundColor: darkTheme ? COLORS.Dgrey4 : COLORS.Lgrey4,
        }}
      >
        <div className={styles.menuBar}>
          <button
            className={styles.plus}
            onClick={onMake}
            style={{
              backgroundColor: darkTheme ? COLORS.Dgrey3 : COLORS.Lgrey3,
              color: darkTheme ? COLORS.vWhite : COLORS.vBlack,
            }}
          >
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} /> + 네모 만들기!
          </button>
          <div
            className={`${styles.edit} ${editOn}`}
            onClick={onEdit}
            style={{
              backgroundColor:
                (edit && COLORS.mainColorL) ||
                (darkTheme && COLORS.Dgrey3) ||
                COLORS.Lgrey3,
              color: darkTheme ? COLORS.vWhite : COLORS.vBlack,
            }}
          >
            <div className={`${styles.hv} ${darkTheme && styles.dk}`} />
            네모 수정하기
          </div>
        </div>
        <div className={styles.grid}>
          {findPage &&
            order &&
            order.map((chId, index) => (
              <Nemo
                key={chId}
                index={index}
                id={chId}
                nemoPre={findPage.nemos[chId]}
                edit={edit}
                deleteNemo={deleteNemo}
                changeNemo={changeNemo}
                moveNemo={moveNemo}
                addNemo={addNemo}
                pagePlayer={pagePlayer}
                someDragging={someDragging}
                setSomeDragging={setSomeDragging}
                darkTheme={darkTheme}
              />
            ))}
        </div>
        {modalOn && (
          <AddNemo
            youtube={youtube}
            sdfsdf
            modalOn={modalOn}
            setModalOn={setModalOn}
            addNemo={addNemo}
            darkTheme={darkTheme}
          />
        )}
      </div>
    );
  }
);

export default Page;
