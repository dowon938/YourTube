import _ from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { COLORS } from '../../common/colors';
import styles from './addNemo.module.css';

const AddNemo = ({
  youtube,
  modalOn,
  setModalOn,
  addChannel,
  nemo,
  darkTheme,
  addPlayList,
  addVideo,
}) => {
  const formRef = useRef();
  const inputRef = useRef();
  const modalRef = useRef();
  const [list, setList] = useState();
  const [searchQ, setSearchQ] = useState();
  const [nextPageTok, setNextPageTok] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onSearch = (event) => {
    event.preventDefault();
    const value = inputRef.current.value;
    if (value === '') return;
    console.log(inputRef.current.value);
    if (modalOn === 'channel')
      youtube.search(value).then((channels) => setList(channels));
    if (modalOn === 'playList') {
      const playlistIdFromURI =
        value.split('?list=').length > 0 ? value.split('?list=')[1].split('&')[0] : false;
      if (!playlistIdFromURI) {
        console.log('List Id가 발견되지 않았습니다.');
        return;
      }
      addPlayList(playlistIdFromURI, nemo).then(setModalOn(false));
    }
    if (modalOn === 'video') {
      const videoIdFromURI =
        value.split('?v=').length > 1 ? value.split('?v=')[1].split('&')[0] : false;
      console.log(videoIdFromURI);
      if (videoIdFromURI) addVideo(videoIdFromURI, nemo);
      if (!videoIdFromURI)
        youtube.searchVideo(value).then((videos) => {
          setSearchQ(value);
          setNextPageTok(videos.nextPageToken);
          setList(videos.items);
        });
    }
    formRef.current.reset();
  };
  const loadMore = () => {
    setIsLoading(true);
    youtube.searchVideo(searchQ, nextPageTok).then((videos) => {
      setNextPageTok(videos.nextPageToken);
      setList([...list, ...videos.items]);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const modalScroll = _.debounce(() => {
    if (!list) return;
    if (modalOn !== 'video') return;
    const { scrollHeight, scrollTop, clientHeight } = modalRef.current;
    console.log(scrollHeight, scrollTop, clientHeight);
    if (scrollHeight - 10 < scrollTop + clientHeight) loadMore();
  }, 200);

  const onAddChannel = (event) => {
    addChannel(event.target.dataset.channelid, event.target.dataset.title, nemo);
    setModalOn(false);
  };
  const onAddVideo = (event) => {
    console.log(nemo);
    addVideo(event.target.dataset.videoid, nemo);
  };
  const onClose = (event) => {
    setModalOn(false);
  };
  useEffect(() => {
    // console.log(inputRef);
    modalOn && inputRef.current.focus();
  }, [modalOn]);
  return (
    <div>
      <div onClick={onClose} className={`${styles.close}`} />
      <div className={`${styles.addModal} ${darkTheme ? styles.dark : styles.light}`}>
        <form
          ref={formRef}
          className={`${styles.form} ${darkTheme ? styles.dark : styles.light}`}
          onSubmit={onSearch}
        >
          <input
            ref={inputRef}
            type="text"
            className={styles.text}
            placeholder={
              (modalOn === 'channel' && '채널명을 검색해주세요') ||
              (modalOn === 'playList' && '재생목록의 주소를 붙여넣어주세요') ||
              (modalOn === 'video' && '영상 url 혹은 검색어를 입력해주세요')
            }
          />
          <button className={styles.submit}>
            <i className="fas fa-search"></i>
          </button>
        </form>
        {modalOn === 'video' && !list && (
          <div className={styles.explain}>
            영상의 주소를 붙여넣거나, 키워드를 입력해 영상을 검색하세요.
            <img src="/imgs/videoLink.png" alt="videoLink Explain" />
            <img src="/imgs/videoSearch2.png" alt="videoSearch Explain" />
          </div>
        )}
        {modalOn === 'playList' && !list && (
          <div className={styles.explain}>
            **재생목록 설정이 '나만보기(private)'일 경우 등록이 불가합니다.
            <img src="/imgs/playList.png" alt="playlist Explain" />
          </div>
        )}
        <div
          className={`${styles.grid} ${darkTheme ? styles.dark : styles.light}`}
          ref={modalRef}
          onScroll={modalScroll}
        >
          {list &&
            modalOn === 'channel' &&
            list.map((ch) => (
              <li
                key={ch.snippet.channelId}
                className={`${styles.chList} ${darkTheme ? styles.dark : styles.light}`}
                data-channelid={ch.snippet.channelId}
                data-title={ch.snippet.title}
                onClick={onAddChannel}
              >
                <img
                  className={styles.img}
                  src={ch.snippet.thumbnails.medium.url}
                  alt="channel thumbnails"
                />
                <span className={styles.span}>{ch.snippet.title}</span>
              </li>
            ))}
          {list &&
            modalOn === 'video' &&
            list.map((video, index) => (
              <li
                key={index}
                className={`${styles.videoList} ${
                  darkTheme ? styles.dark : styles.light
                }`}
                data-videoid={video.id.videoId}
                data-title={video.snippet.title}
                onClick={onAddVideo}
              >
                <img
                  className={styles.imgVideo}
                  src={video.snippet.thumbnails.medium.url}
                  alt="video thumbnails"
                />
                <span
                  className={styles.spanVideo}
                  style={{
                    color: darkTheme ? COLORS.vWhite : COLORS.fontGrey,
                  }}
                >
                  {video.snippet.title}
                </span>
              </li>
            ))}
        </div>
        {list && modalOn === 'video' && (
          <button
            className={`${styles.moreBtn} ${darkTheme ? styles.dark : styles.light}`}
            onClick={loadMore}
          >
            Load more...
          </button>
        )}
        {isLoading && (
          <div className={styles.waveContainer}>
            <div className={styles.water}>
              <div className={styles.wave}></div>
              <div className={styles.deepWater}>Loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNemo;
