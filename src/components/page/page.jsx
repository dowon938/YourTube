import React, { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';
import _ from 'lodash';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';

const Page = ({
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
  const throttleSetOrder = _.throttle((newOrder) => {
    isSample ? setOrder(newOrder) : dbService.setOrder(userId, pageId, newOrder);
  }, 1000);
  const moveNemo = useCallback(
    (nemoId, toIndex) => {
      const index = order.indexOf(nemoId);
      let newOrder = [...order];
      newOrder.splice(index, 1);
      newOrder.splice(toIndex, 0, nemoId);
      throttleSetOrder(newOrder);
    },
    [order, throttleSetOrder]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
  return (
    <div className={styles.page} ref={drop}>
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
