import React from 'react';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useEffect } from 'react/cjs/react.development';
import AddNemo from '../addNemo/addNemo';
import Nemo from '../nemo/nemo';
import styles from './page.module.css';

const Page = ({ pageId, sample, pages, youtube, addNemo }) => {
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
    console.log(event);
    setEdit(!edit);
  };
  const [order, setOrder] = useState();
  return (
    <DragDropContext>
      <div className={styles.page}>
        <div className={styles.edit} onClick={onEdit}>
          Edit box
        </div>
        {findPage &&
          findPage.hasOwnProperty('nemos') &&
          findPage.order.map((chId) => (
            <Nemo nemo={findPage.nemos[chId]} key={chId} edit={edit} />
          ))}
        <button className={styles.plus} onClick={onclick}>
          + Make box!
        </button>
        {modalOn ? (
          <AddNemo youtube={youtube} setModalOn={setModalOn} addNemo={addNemo} />
        ) : (
          ''
        )}
      </div>
    </DragDropContext>
  );
};

export default Page;
