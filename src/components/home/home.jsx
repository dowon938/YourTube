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

  const saveNemo = (newNemo, grid) => {
    if (grid) {
      const { column, row } = grid;
      if (
        selected.isSample &&
        column === sample[selected.pageId].nemos[newNemo.nemoId].column &&
        row === sample[selected.pageId].nemos[newNemo.nemoId].row
      )
        return;
      if (
        !selected.isSample &&
        column === pages[selected.pageId].nemos[newNemo.nemoId].column &&
        row === pages[selected.pageId].nemos[newNemo.nemoId].row
      )
        return;
    }
    if (selected.isSample) {
      const newSample = { ...sample };
      newSample[selected.pageId].nemos[newNemo.nemoId] = newNemo;
      setSample(newSample);
    }
    if (!selected.isSample) {
      dbService.addNemo(userId, selected.pageId, newNemo.nemoId, newNemo);
      const newPages = { ...pages };
      newPages[selected.pageId].nemos
        ? (newPages[selected.pageId].nemos[newNemo.nemoId] = newNemo)
        : (newPages[selected.pageId].nemos = { [newNemo.nemoId]: newNemo });
      setPages(newPages);
    }
  };

  const saveOrder = (newOrder, id) => {
    if (selected.isSample) {
      const newSample = { ...sample };
      if (!newOrder) {
        newSample[selected.pageId].order = newSample[selected.pageId].order
          ? [...newSample[selected.pageId].order, id]
          : [id];
        setSample(newSample);
      } else {
        newSample[selected.pageId].order = newOrder;
        setSample(newSample);
      }
    }
    if (!selected.isSample) {
      const newPages = { ...pages };
      if (!newOrder) {
        newPages[selected.pageId].order = newPages[selected.pageId].order
          ? [...newPages[selected.pageId].order, id]
          : [id];
        dbService.setPages(userId, newPages);
      } else {
        newPages[selected.pageId].order = newOrder;
        dbService.setPages(userId, newPages);
      }
    }
  };

  const deleteNemo = (id) => {
    if (selected.isSample) {
      const newSample = { ...sample };
      const newOrder = [...newSample[selected.pageId].order];
      newOrder.splice(newSample[selected.pageId].order.indexOf(id), 1);
      delete newSample[selected.pageId].nemos[id];
      newSample[selected.pageId].order = newOrder;
      setSample(newSample);
    }
    if (!selected.isSample) {
      const newPages = { ...pages };
      const newOrder = [...newPages[selected.pageId].order];
      newOrder.splice(newPages[selected.pageId].order.indexOf(id), 1);
      delete newPages[selected.pageId].nemos[id];
      newPages[selected.pageId].order = newOrder;
      dbService.setPages(userId, newPages);
      setPages(newPages);
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
    saveOrder(false, id);
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
  // useEffect(() => {
  //   const stopRead = selected.isSample
  //     ? dbService.readOrder('sample', selected.pageId, setOrder)
  //     : dbService.readOrder(userId, selected.pageId, setOrder);
  //   console.log('order');
  //   return () => stopRead();
  // }, [userId, selected, dbService]);

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
        gridRatio,
      } = monitor.getItem();
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      let [newColumn, newRow] = [column, row];
      const [wPerColumn, hPerRow] = [w / column, h / row];

      newColumn += Math.round(x / wPerColumn);
      newRow += Math.round(y / hPerRow);
      if (newColumn === column && newRow === row) return;
      if (newColumn > 10) return;
      if (newRow > 10) return;
      if (newColumn < gridRatio) return;
      if (newRow < gridRatio) return;

      throttleGrid({ column: newColumn, row: newRow });
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
            dbService={dbService}
            youtube={youtube}
            addNemo={addNemo}
            deleteNemo={deleteNemo}
            saveNemo={saveNemo}
            saveOrder={saveOrder}
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
