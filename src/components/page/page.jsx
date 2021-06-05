import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';
import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { ItemTypes } from '../../utils/items';

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
}) => {
  const [findPage, setFindPage] = useState({});
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

  const editOn = edit ? styles.editOn : '';
  //드래그 앤 드랍
  const findNemo = useCallback(
    (nemoId) => {
      const nemoIndex = order.indexOf(nemoId);
      return { nemo: nemoId, index: nemoIndex };
    },
    [order]
  );
  const moveNemo = useCallback(
    (nemoId, toIndex) => {
      const { nemo, index } = findNemo(nemoId);
      let newOrder = order;
      newOrder.splice(index, 1);
      newOrder.splice(toIndex, 0, nemo);
      dbService.setOrder('sample', pageId, newOrder);
    },
    [order, setOrder]
  );
  //드래그 리사이즈
  const [, resizeDrop] = useDrop(
    () => ({
      accept: ItemTypes.Resize,
      canDrop: () => false,
      hover(item, monitor) {
        const {
          column,
          row,
          width: w,
          height: h,
          throttleGrid,
          double,
        } = monitor.getItem();
        const { x, y } = monitor.getDifferenceFromInitialOffset();
        let [nColumn, nRow] = [column, row];
        const [wPerColumn, hPerRow] = [w / column, h / row];
        const sensRatio = 0.7;
        if (x > wPerColumn * sensRatio) nColumn += Math.round(x / wPerColumn);
        if (y > hPerRow * sensRatio) nRow += Math.round(y / hPerRow);
        if (x < -wPerColumn * sensRatio) nColumn += Math.round(x / wPerColumn);
        if (y < -hPerRow * sensRatio) nRow += Math.round(y / hPerRow);
        if (double) {
          nColumn % 2 === 1 && nColumn++;
          nRow % 2 === 1 && nRow++;
        }
        nColumn < 1 && (nColumn = 1);
        nRow < 1 && (nRow = 1);
        nColumn > 8 && (nColumn = 8);
        nRow > 8 && (nRow = 8);

        throttleGrid({ column: nColumn, row: nRow });
      },
    }),
    []
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
  return (
    <div ref={drop} className={styles.page}>
      <div className={styles.menuBar}>
        <button className={styles.plus} onClick={onMake}>
          + Make box!
        </button>
        <div className={`${styles.edit} ${editOn}`} onClick={onEdit}>
          Edit box
        </div>
      </div>
      <div className={styles.grid} ref={resizeDrop}>
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
              dbService={dbService}
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
