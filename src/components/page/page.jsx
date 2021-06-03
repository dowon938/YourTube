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
  changeNemoTitle,
}) => {
  const [findPage, setFindPage] = useState({});
  const [modalOn, setModalOn] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    sample[pageId] ? setFindPage(sample[pageId]) : setFindPage(pages[pageId]);
  }, [pageId, sample, pages]);

  const onclick = (event) => {
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
  const con = _.throttle((column, row, width, height, offset) => {
    console.log(column, row, width, height, offset);
  }, 200);
  const [, resizeDrop] = useDrop(
    () => ({
      accept: ItemTypes.Resize,
      canDrop: () => false,
      hover(item, monitor) {
        const { column, row, width, height, setGrid, double } = monitor.getItem();
        const { x, y } = monitor.getDifferenceFromInitialOffset();
        let newColumn = column;
        let newRow = row;
        if (x > width / (2 * column)) newColumn += Math.round(x / (width / column));
        if (y > height / (2 * row)) newRow += Math.round(y / (height / row));
        if (x < -width / (2 * column)) newColumn += Math.round(x / (width / column));
        if (y < -height / (2 * row)) newRow += Math.round(y / (height / row));
        if (double) newColumn % 2 === 1 && newColumn++;
        if (double) newRow % 2 === 1 && newRow++;
        newColumn < 1 ? (newColumn = 1) : (newColumn = newColumn);
        newRow < 1 ? (newRow = 1) : (newRow = newRow);
        newColumn > 6 ? (newColumn = 6) : (newColumn = newColumn);
        newRow > 6 ? (newRow = 6) : (newRow = newRow);

        setGrid({ column: newColumn, row: newRow });
        // con(column, row, width / column, height / row, x);
      },
    }),
    []
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
  return (
    <div ref={drop} className={styles.page}>
      <div className={styles.menuBar}>
        <button className={styles.plus} onClick={onclick}>
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
              changeNemoTitle={changeNemoTitle}
              moveNemo={moveNemo}
              findNemo={findNemo}
            />
          ))}
      </div>
      {modalOn && (
        <AddNemo
          youtube={youtube}
          modalOn={modalOn}
          setModalOn={setModalOn}
          addNemo={addNemo}
        />
      )}
    </div>
  );
};

export default Page;
