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
  const addPage = () => {
    const id = Date.now();
    dbService.addPages(userId, id, {
      pageTitle: '"No Name"',
      id: `${id}`,
    });
  };
  const addNemo = (channelId, channelTitle) => {
    const id = Date.now();
    youtube
      .bringVideo(channelId)
      .then((video) => {
        const newNemo = {
          nemoId: channelId,
          nemoTitle: channelTitle,
          videos: video,
        };
        dbService.addNemo('sample', selected, channelId, newNemo);
      })
      .then(() => {
        const newOrder = [...order, channelId];
        dbService.setArr('sample', selected, newOrder);
      });
  };
  const deleteNemo = (channelId) => {
    const newOrder = [...order];
    newOrder.splice(newOrder.indexOf(channelId), 1);
    dbService.setArr('sample', selected, newOrder);
    dbService.deleteNemo('sample', selected, channelId);
  };
  const changeNemoTitle = (newNemo) => {
    dbService.addNemo('sample', selected, newNemo.nemoId, newNemo);
  };
  //샘플만들기
  useEffect(() => {
    const makeSample = () => {
      const sample1 = dbService.addPages('sample', 'self-develop', {
        id: 'self-develop',
        pageTitle: 'self-develop',
      });
      const sample2 = dbService.addPages('sample', 'work-out', {
        id: 'work-out',
        pageTitle: 'work-out',
      });
      const sample3 = dbService.addPages('sample', 'daily-routine', {
        id: 'daily-routine',
        pageTitle: 'daily-routine',
      });
    };
    // makeSample();
  }, [userId]);

  useEffect(() => {
    const stopRead = dbService.readPages(userId, setPages);
    console.log('effect');
    return () => stopRead();
  }, [userId, dbService]);
  useEffect(() => {
    const stopRead = dbService.readPages('sample', setSample);
    console.log('sample');
    return () => stopRead();
  }, [userId]);
  useEffect(() => {
    const stopRead = dbService.readArr('sample', selected, setOrder);
    console.log('order', order, selected);
    return () => stopRead();
  }, [userId, selected]);
  return (
    <div className={styles.home}>
      <div className={styles.tab}>
        <div className={styles.sampleTab}>
          {Object.keys(sample).map((page) => (
            <Tab
              page={sample[page]}
              key={page}
              setSelected={setSelected}
              selected={selected}
            />
          ))}
        </div>
        <div className={styles.myTab}>
          {pages &&
            Object.keys(pages).map((key) => (
              <Tab
                page={pages[key]}
                key={key}
                setSelected={setSelected}
                selected={selected}
              />
            ))}
          <button onClick={addPage}>+</button>
        </div>
      </div>
      <Page
        pageId={selected}
        sample={sample}
        pages={pages}
        order={order}
        youtube={youtube}
        addNemo={addNemo}
        deleteNemo={deleteNemo}
        changeNemoTitle={changeNemoTitle}
      />
    </div>
  );
};

export default Home;
