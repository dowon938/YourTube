import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useState } from 'react/cjs/react.development';
import { ItemTypes } from '../../utils/items';
import Page from '../page/page';
import Tab from '../tab/tab';
import styles from './home.module.css';
import { memo } from 'react';
import Star from '../background/star';

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
    dbService.addPages(userId, pageId, newPage);
  };

  const saveNemo = (newNemo) => {
    if (selected.isSample) {
      const newSample = { ...sample };
      newSample[selected.pageId].nemos[newNemo.nemoId] = newNemo;
      setSample(newSample);
    } else dbService.addNemo(userId, selected.pageId, newNemo.nemoId, newNemo);
    //샘플페이지수정용코드
    // dbService.addNemo('sample', selected.pageId, newNemo.nemoId, newNemo);
  };

  const saveOrder = (id) => {
    if (order.indexOf(id) === -1) {
      const newOrder = [...order, id];
      selected.isSample
        ? setOrder(newOrder)
        : dbService.setOrder(userId, selected.pageId, newOrder);
      //샘플페이지수정용코드
      // dbService.setOrder('sample', selected.pageId, newOrder);
    }
  };
  const addNemo = async () => {
    const id = Date.now();
    const newNemo = {
      nemoId: id,
      column: 5,
      row: 5,
      isLargerSize: false,
    };
    await saveNemo(newNemo);
    saveOrder(id);
  };
  const addChannel = (channelId, channelTitle, orgNemo) => {
    youtube
      .bringVideo(channelId)
      .then((videos) => {
        videos = videos.filter((video) => video.id.videoId);
        videos = videos.map((video) => ({
          snippet: { ...video.snippet },
          videoId: video.id.videoId,
        }));
        return videos;
      })
      .then((videos) => {
        const newNemo = {
          ...orgNemo,
          channelId: channelId,
          originTitle: channelTitle,
          videos: videos,
        };
        saveNemo(newNemo);
      });
  };
  const addPlayList = async (playListId, orgNemo) => {
    console.log(playListId);
    youtube
      .playListItems(playListId)
      .catch((e) => {
        console.log(e.response.status);
        console.log(e.response.data);
        const reason = e.response.data.error.errors[0].reason;
        reason === 'quotaExceeded' &&
          console.log('할당량을 초과했습니다. 관리자에게 문의하세요');
        reason === 'playlistNotFound' && console.log('재생목록 ID를 찾을수 없습니다.');
      })
      .then((videos) => {
        videos = videos.map((video) => ({
          snippet: { ...video.snippet },
          videoId: video.snippet.resourceId.videoId,
        }));
        return videos;
      })
      .catch((e) => {
        console.log(e);
      })
      .then((videos) => {
        console.log(videos);
        const newNemo = {
          ...orgNemo,
          playListId: playListId,
          videos: videos,
        };
        saveNemo(newNemo);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const addVideo = (videoId, orgNemo) => {
    youtube.getVideoFromId(videoId).then((video) => {
      console.log(orgNemo.videos);
      const newNemo = {
        ...orgNemo,
        isCustomNemo: true,
        videos: orgNemo.videos ? [...orgNemo.videos, video.items[0]] : [video.items[0]],
      };
      saveNemo(newNemo);
    });
  };
  const deleteNemo = (id) => {
    const newOrder = [...order];
    console.log(newOrder.indexOf(id), newOrder);
    newOrder.splice(newOrder.indexOf(id), 1);
    console.log(newOrder, order);
    selected.isSample
      ? setOrder([...newOrder])
      : dbService.setOrder(userId, selected.pageId, newOrder);
    if (selected.isSample) {
      const newSample = { ...sample };
      delete newSample[selected.pageId].nemos[id];
      newSample[selected.pageId].order = [...newOrder];
      setSample(newSample);
    } else dbService.deleteNemo(userId, selected.pageId, id);
    //샘플페이지수정용코드
    // dbService.setOrder('sample', selected.pageId, newOrder);
    // dbService.deleteNemo('sample', selected.pageId, channelId);
  };
  const editPage = () => {
    console.log('hi');
    setPageEdit((pageEdit) => !pageEdit);
  };

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

  const [, resizeDrop] = useDrop(() => ({
    accept: ItemTypes.Resize,
    canDrop: () => false,
    hover(item, monitor) {
      const {
        column,
        row,
        width: w,
        height: h,
        throttleGrid,
        isLargerSize,
      } = monitor.getItem();
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      let [newColumn, newRow] = [column, row];
      const [wPerColumn, hPerRow] = [w / column, h / row];
      const gridRatio = isLargerSize ? 3 : 2;

      const SENS = 0.9;

      newColumn += Math.round((x * SENS) / wPerColumn);
      newRow += Math.round((y * SENS) / hPerRow);
      if (newColumn > 10) return;
      if (newRow > 10) return;
      if (newColumn < gridRatio) return;
      if (newRow < gridRatio) return;

      // console.log(x, column, newColumn);

      if (newColumn !== column || newRow !== row) {
        throttleGrid({ column: newColumn, row: newRow });
      }
    },
  }));

  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div ref={resizeDrop}>
      <Star />
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
            saveNemo={saveNemo}
            onPlayer={onPlayer}
            setPlayer={setPlayer}
            darkTheme={darkTheme}
            addChannel={addChannel}
            addPlayList={addPlayList}
            addVideo={addVideo}
          />
        </div>
      </div>
    </div>
  );
});

export default Home;
