import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';
import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { ItemTypes } from '../../utils/items';
import _ from 'lodash';

const Page = ({
  pageId,
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
}) => {
  const [findPage, setFindPage] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [edit, setEdit] = useState(false);
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
  const findNemo = useCallback(
    _.throttle((nemoId) => {
      const nemoIndex = order.indexOf(nemoId);
      return { nemo: nemoId, index: nemoIndex };
    }, 10),
    [order]
  );
  const moveNemo = useCallback(
    _.throttle((nemoId, toIndex) => {
      const { nemo, index } = findNemo(nemoId);
      let newOrder = order;
      newOrder.splice(index, 1);
      newOrder.splice(toIndex, 0, nemo);
      dbService.setOrder('sample', pageId, newOrder);
    }, 20),
    [order, dbService, findNemo, pageId]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
  return (
    <div ref={drop} className={styles.page}>
      <div className={styles.menuBar}>
        <button className={styles.plus} onClick={onMake}>
          + Make card!
        </button>
        <div className={`${styles.edit} ${editOn}`} onClick={onEdit}>
          Edit card
        </div>
      </div>
      <div className={styles.grid}>
        {findPage &&
          order &&
          order.map((chId) => (
            <Nemo
              key={chId}
              nemoPre={findPage.nemos[chId]}
              edit={edit}
              deleteNemo={deleteNemo}
              changeNemo={changeNemo}
              moveNemo={moveNemo}
              findNemo={findNemo}
              addNemo={addNemo}
              pagePlayer={pagePlayer}
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
        />
      )}
    </div>
  );
};

export default Page;
