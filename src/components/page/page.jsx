import React from 'react';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';

const Page = ({
  pageId,
  sample,
  pages,
  order,
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
    setModalOn(!modalOn);
  };
  const onEdit = (event) => {
    setEdit(!edit);
  };
  return (
    <DragDropContext>
      <div className={styles.page}>
        <div className={styles.menuBar}>
          <button className={styles.plus} onClick={onclick}>
            + Make box!
          </button>
          <div className={styles.edit} onClick={onEdit}>
            Edit box
          </div>
        </div>
        {findPage &&
          order &&
          order.map(
            (chId) =>
              chId in findPage.nemos && (
                <Nemo
                  nemoPre={findPage.nemos[chId]}
                  key={chId}
                  edit={edit}
                  deleteNemo={deleteNemo}
                  changeNemoTitle={changeNemoTitle}
                />
              )
          )}

        {modalOn && (
          <AddNemo
            youtube={youtube}
            modalOn={modalOn}
            setModalOn={setModalOn}
            addNemo={addNemo}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default Page;
