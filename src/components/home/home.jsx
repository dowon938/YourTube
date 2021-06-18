import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useState } from 'react/cjs/react.development';
import { ItemTypes } from '../../utils/items';
import Page from '../page/page';
import Tab from '../tab/tab';
import styles from './home.module.css';

const Home = ({ authService, dbService, userId, youtube, onPlayer, setPlayer }) => {
  const [sample, setSample] = useState({});
  const [pages, setPages] = useState({});
  const [selected, setSelected] = useState('daily-routine');
  const [order, setOrder] = useState([]);
  const [pageEdit, setPageEdit] = useState(false);
  const isSample = useState(true);
  const addPage = () => {
    const id = Date.now();
    dbService.addPages(userId, id, {
      pageTitle: '"No Name"',
      id: `${id}`,
    });
  };
  const deletePage = (pageId) => {
    dbService.deletePages(userId, pageId);
    const newPages = { ...pages };
    delete newPages[pageId];
    setPages(newPages);
  };
  const changePage = (newPage, pageId) => {
    const newPages = { ...pages, [pageId]: newPage };
    dbService.addPages(userId, pageId, newPage);
    setPages(newPages);
  };
  const addNemo = (channelId, paraNemo) => {
    // const id = Date.now();
    youtube
      .bringVideo(channelId)
      .then((video) => {
        const newNemo = paraNemo
          ? {
              ...paraNemo,
              videos: video,
            }
          : {
              nemoId: channelId,
              nemoTitle: video[0].snippet.channelTitle,
              column: 4,
              row: 4,
              double: false,
              videos: video,
            };
        dbService.addNemo('sample', selected, channelId, newNemo);
      })
      .then(() => {
        if (order.indexOf(channelId) === -1) {
          const newOrder = [...order, channelId];
          dbService.setOrder('sample', selected, newOrder);
        }
      });
  };
  const deleteNemo = (channelId) => {
    const newOrder = [...order];
    newOrder.splice(newOrder.indexOf(channelId), 1);
    dbService.setOrder('sample', selected, newOrder);
    dbService.deleteNemo('sample', selected, channelId);
  };
  const changeNemo = (newNemo) => {
    dbService.addNemo('sample', selected, newNemo.nemoId, newNemo);
  };
  const editPage = () => {
    console.log('hi');
    setPageEdit((pageEdit) => !pageEdit);
  };
  const editOn = pageEdit ? styles.editOn : '';

  //샘플만들기
  // useEffect(() => {
  //   const makeSample = () => {
  //     const sample1 = dbService.addPages('sample', 'self-develop', {
  //       id: 'self-develop',
  //       pageTitle: 'self-develop',
  //     });
  //     const sample2 = dbService.addPages('sample', 'work-out', {
  //       id: 'work-out',
  //       pageTitle: 'work-out',
  //     });
  //     const sample3 = dbService.addPages('sample', 'daily-routine', {
  //       id: 'daily-routine',
  //       pageTitle: 'daily-routine',
  //     });
  //   };
  //   // makeSample();
  // }, [userId]);

  useEffect(() => {
    !userId && setPages({});
    const stopRead = dbService.readPages(userId, setPages);
    console.log('readPage');
    return () => stopRead();
  }, [userId, dbService]);
  useEffect(() => {
    const stopRead = dbService.readPages('sample', setSample);
    console.log('readSample');
    return () => stopRead();
  }, [dbService]);
  useEffect(() => {
    const stopRead = dbService.readOrder('sample', selected, setOrder);
    console.log('order');
    return () => stopRead();
  }, [selected, dbService]);

  //리사이즈 드랍
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
        const gridRatio = double ? 3 : 2;

        // console.log(nRow, y, hPerRow, Math.round(y / hPerRow));
        const SENS = 1;
        nColumn += Math.round((x * SENS) / wPerColumn);
        nRow += Math.round((y * SENS) / hPerRow);

        // const sensRatio = 0.1;
        // if (x > wPerColumn * sensRatio) nColumn += Math.round(x / wPerColumn);
        // if (y > hPerRow * sensRatio) nRow += Math.round(y / hPerRow);
        // if (x < -wPerColumn * sensRatio) nColumn += Math.round(x / wPerColumn);
        // if (y < -hPerRow * sensRatio) nRow += Math.round(y / hPerRow);

        // if (double) {
        //   if (nColumn % 3 !== 0) nColumn = nColumn + (3 - (nColumn % 3));
        //   if (nRow % 3 !== 0) nRow = nRow + (3 - (nRow % 3));
        // }
        // if (!double) {
        //   if (nColumn % 2 !== 0) nColumn = nColumn + (2 - (nColumn % 2));
        //   if (nRow % 2 !== 0) nRow = nRow + (2 - (nRow % 2));
        // }
        // if (double) {
        //   nColumn > 9 && (nColumn = 9);
        //   nRow > 12 && (nRow = 12);
        // }
        // if (!double) {
        //   nColumn > 10 && (nColumn = 10);
        //   nRow > 12 && (nRow = 12);
        // }
        nColumn > 10 && (nColumn = 10);
        nRow > 12 && (nRow = 12);
        nColumn < gridRatio && (nColumn = gridRatio);
        nRow < gridRatio && (nRow = gridRatio);

        throttleGrid({ column: nColumn, row: nRow });
      },
    }),
    []
  );
  return (
    <div ref={resizeDrop}>
      <div className={styles.home}>
        <div className={styles.tab}>
          <div className={styles.sampleTab}>
            {Object.keys(sample).map((pageId) => (
              <Tab
                key={pageId}
                page={sample[pageId]}
                setSelected={setSelected}
                selected={selected}
                isSample={isSample}
              />
            ))}
          </div>
          <div className={styles.myTab}>
            {pages &&
              Object.keys(pages).map((pageId) => (
                <Tab
                  key={pageId}
                  page={pages[pageId]}
                  deletePage={deletePage}
                  changePage={changePage}
                  setSelected={setSelected}
                  selected={selected}
                  pageEdit={pageEdit}
                />
              ))}
            <button onClick={addPage} className={styles.plusPage}>
              +
            </button>
            <button onClick={editPage} className={`${styles.editPage} ${editOn}`}>
              <i className="far fa-edit"></i>
            </button>
          </div>
        </div>
        <div className={styles.pageGrid}>
          <Page
            pageId={selected}
            sample={sample}
            pages={pages}
            order={order}
            setOrder={setOrder}
            dbService={dbService}
            youtube={youtube}
            addNemo={addNemo}
            deleteNemo={deleteNemo}
            changeNemo={changeNemo}
            onPlayer={onPlayer}
            setPlayer={setPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
