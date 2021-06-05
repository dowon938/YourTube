import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import Page from '../page/page';
import Tab from '../tab/tab';
import styles from './home.module.css';

const Home = ({ authService, dbService, userId, youtube }) => {
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
              column: 3,
              row: 3,
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
    const stopRead = dbService.readPages(userId, setPages);
    console.log('effect');
    return () => stopRead();
  }, [userId, dbService]);
  useEffect(() => {
    const stopRead = dbService.readPages('sample', setSample);
    console.log('sample');
    return () => stopRead();
  }, [dbService]);
  useEffect(() => {
    const stopRead = dbService.readOrder('sample', selected, setOrder);
    console.log('order');
    return () => stopRead();
  }, [selected, dbService]);
  return (
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
      />
    </div>
  );
};

export default Home;
