import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useState } from 'react/cjs/react.development';
import { ItemTypes } from '../../utils/items';
import Page from '../page/page';
import Tab from '../tab/tab';
import styles from './home.module.css';
import { memo } from 'react';

const Home = memo(({ dbService, userId, youtube, onPlayer, setPlayer, darkTheme }) => {
  const [sample, setSample] = useState({});
  const [pages, setPages] = useState({});
  const [selected, setSelected] = useState({ pageId: 'daily-routine', isSample: true });
  const [order, setOrder] = useState([]);
  const [pageEdit, setPageEdit] = useState(false);
  const isSampleTab = useState(true);
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
  const saveNemo = (id, newNemo) => {
    selected.isSample
      ? setSample({
          ...sample,
          [selected.pageId]: {
            ...sample[selected.pageId],
            nemos: { ...sample[selected.pageId].nemos, [id]: newNemo },
          },
        })
      : dbService.addNemo(userId, selected.pageId, id, newNemo);
  };
  const saveOrder = (id) => {
    if (order.indexOf(id) === -1) {
      const newOrder = [...order, id];
      selected.isSample
        ? setOrder(newOrder)
        : dbService.setOrder(userId, selected.pageId, newOrder);
    }
  };
  const addNemo = async () => {
    const id = Date.now();
    const newNemo = {
      nemoId: id,
      column: 5,
      row: 5,
      double: false,
    };
    await saveNemo(id, newNemo);
    saveOrder(id);
  };
  const addChannel = (channelId, paraNemo) => {
    // const id = Date.now();
    youtube.bringVideo(channelId).then((video) => {
      const newNemo = {
        ...paraNemo,
        videos: video,
      };
      saveNemo(paraNemo.nemoId, newNemo);
    });
  };
  const deleteNemo = (channelId) => {
    const newOrder = [...order];
    newOrder.splice(newOrder.indexOf(channelId), 1);
    selected.isSample
      ? setOrder(newOrder)
      : dbService.setOrder(userId, selected.pageId, newOrder);
    selected.isSample
      ? setSample({
          ...sample,
          [selected.pageId]: {
            ...sample[selected.pageId],
            nemos: { ...sample[selected.pageId].nemos, [channelId]: undefined },
          },
        })
      : dbService.deleteNemo(userId, selected.pageId, channelId);
  };
  const changeNemo = (newNemo) => {
    selected.isSample
      ? setSample({
          ...sample,
          [selected.pageId]: {
            ...sample[selected.pageId],
            nemos: { ...sample[selected.pageId].nemos, [newNemo.nemoId]: newNemo },
          },
        })
      : dbService.addNemo(userId, selected.pageId, newNemo.nemoId, newNemo);
  };
  const editPage = () => {
    console.log('hi');
    setPageEdit((pageEdit) => !pageEdit);
  };

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
    const stopRead = selected.isSample
      ? dbService.readOrder('sample', selected.pageId, setOrder)
      : dbService.readOrder(userId, selected.pageId, setOrder);
    console.log('order');
    return () => stopRead();
  }, [userId, selected, dbService]);

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
        const SENS = 0.8;
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
        nRow > 10 && (nRow = 10);
        nColumn < gridRatio && (nColumn = gridRatio);
        nRow < gridRatio && (nRow = gridRatio);

        throttleGrid({ column: nColumn, row: nRow });
      },
    }),
    []
  );

  const themeClass = darkTheme ? styles.dark : styles.light;

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
                isSampleTab={isSampleTab}
                darkTheme={darkTheme}
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
                  darkTheme={darkTheme}
                />
              ))}
            <button onClick={addPage} className={`${styles.plusPage} ${themeClass}`}>
              <div className={styles.hv} />
              <span>+</span>
            </button>
            <button
              onClick={editPage}
              className={`${styles.editPage} ${themeClass} ${pageEdit && styles.editOn}`}
            >
              <div className={styles.hv} />
              <i className="far fa-edit"></i>
            </button>
          </div>
        </div>
        <div className={styles.pageGrid}>
          <Page
            userId={userId}
            pageId={selected.pageId}
            isSample={selected.isSample}
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
            darkTheme={darkTheme}
          />
        </div>
      </div>
    </div>
  );
});

export default Home;
