import React, { useState, useRef, useEffect, memo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import Page from '../page/page';
import Tab from '../tab/tab';
import styles from './home.module.css';
import Star from '../background/star';

const Home = memo(({ dbService, userId, youtube, onPlayer, setPlayer, darkTheme }) => {
  const [sample, setSample] = useState({});
  const [pages, setPages] = useState({});
  const [selected, setSelected] = useState({ pageId: 'daily-routine', isSample: true });
  const { pageId, isSample } = selected;
  const [pageEdit, setPageEdit] = useState(false);

  useEffect(() => {
    !userId && setPages({});
    const stopRead = dbService.readPages(userId, setPages);
    return () => stopRead();
  }, [userId, dbService]);
  useEffect(() => {
    const stopRead = dbService.readPages('sample', setSample);
    return () => stopRead();
  }, [dbService]);

  const addPage = () => {
    const id = Date.now();
    dbService.addPages(userId, id, {
      pageTitle: '이름이 필요해요⇒',
      id: `${id}`,
    });
  };

  const deletePage = (targetPageId) => {
    dbService.deletePages(userId, targetPageId);
    const newPages = { ...pages };
    delete newPages[targetPageId];
    setPages(newPages);
  };
  const changePage = (newPage, targetPageId) => {
    dbService.addPages(userId, targetPageId, newPage);
  };
  const saveSampleToDB = () => {
    dbService.setPages('sample', sample);
  };

  const saveNemo = (newNemo, grid) => {
    const nemoId = newNemo.nemoId;
    if (grid) {
      const { column, row } = grid;
      const { column: originColumn, row: originRow } = isSample
        ? sample[pageId].nemos[nemoId]
        : pages[pageId].nemos[nemoId];
      if (column === originColumn && row === originRow) return;
    }
    const newPage = isSample ? { ...sample } : { ...pages };
    newPage[pageId].nemos
      ? (newPage[pageId].nemos[nemoId] = newNemo)
      : (newPage[pageId].nemos = { [nemoId]: newNemo });
    !isSample && dbService.addNemo(userId, pageId, nemoId, newNemo);
    isSample ? setSample(newPage) : setPages(newPage);
  };

  const saveOrder = (newOrder) => {
    const newPage = isSample ? { ...sample } : { ...pages };
    newPage[pageId].order = newOrder;
    isSample ? setSample(newPage) : dbService.setPages(userId, newPage);
  };

  const addOrder = (id) => {
    const newPage = isSample ? { ...sample } : { ...pages };
    newPage[pageId].order
      ? (newPage[pageId].order = [...newPage[pageId].order, id])
      : (newPage[pageId].order = [id]);
    isSample ? setSample(newPage) : dbService.setPages(userId, newPage);
  };

  const deleteNemo = (id) => {
    const newPage = isSample ? { ...sample } : { ...pages };
    delete newPage[pageId].nemos[id];
    newPage[pageId].order.splice(newPage[pageId].order.indexOf(id), 1);

    isSample ? setSample(newPage) : setPages(newPage);
    !isSample && dbService.setPages(userId, newPage);
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
    addOrder(id);
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
    setPageEdit((pageEdit) => !pageEdit);
  };

  //리사이즈 드랍
  const [, resizeDrop] = useDrop(() => ({
    accept: ItemTypes.Resize,
    canDrop: () => false,
    hover(item, monitor) {
      const { column, row, wPerColumn, hPerRow, saveGrid, gridRatio } = monitor.getItem();
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      let [newColumn, newRow] = [column, row];

      newColumn += Math.round(x / wPerColumn);
      newRow += Math.round(y / hPerRow);

      if (newColumn === column && newRow === row) return;
      if (newColumn > 10 || newRow > 10) return;
      if (newColumn < gridRatio || newRow < gridRatio) return;
      saveGrid({ column: newColumn, row: newRow });
    },
  }));

  const [, drop] = useDrop(() => ({ accept: ItemTypes.Nemo }));
  const ref = useRef();
  resizeDrop(ref);
  drop(ref);

  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div ref={ref}>
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
                darkTheme={darkTheme}
                isSampleTab
              />
            ))}
          </div>
          <div className={styles.myTab}>
            {Object.keys(pages).map((pageId) => (
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
            {userId === 'lyKviGnfTBdi6rEDHIt4Gd2zq0F2' && (
              <button
                onClick={saveSampleToDB}
                className={`${styles.editPage} ${themeClass}`}
                style={{ width: '12em' }}
              >
                <div className={styles.hv} />
                샘플DB에저장하기
              </button>
            )}
          </div>
        </div>
        <div className={styles.pageGrid}>
          <Page
            userId={userId}
            pageId={pageId}
            isSample={isSample}
            sample={sample}
            pages={pages}
            youtube={youtube}
            addNemo={addNemo}
            saveNemo={saveNemo}
            saveOrder={saveOrder}
            deleteNemo={deleteNemo}
            onPlayer={onPlayer}
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
