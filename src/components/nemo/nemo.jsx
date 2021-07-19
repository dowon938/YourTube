import React from 'react';
import { useEffect, useRef, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';
import { COLORS } from '../../common/colors';

import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import { memo } from 'react';
import AddNemo from '../addNemo/addNemo';
import _ from 'lodash';

const Nemo = memo(
  ({
    id,
    index,
    nemo,
    edit,
    saveNemo,
    deleteNemo,
    moveNemo,
    addNemo,
    pagePlayer,
    someDragging,
    setSomeDragging,
    darkTheme,
    addChannel,
    youtube,
    addPlayList,
    addVideo,
  }) => {
    const [inputToggle, setInputToggle] = useState(false);
    const [rect, setRect] = useState(null);
    const ref = useRef();
    const [videos, setVideos] = useState();
    const [isLargerSize, setIsLargerSize] = useState();
    const [rotate, setRotate] = useState(false);
    const [modalOn, setModalOn] = useState(false);
    const [nemoTitle, setNemoTitle] = useState(
      nemo && (nemo.nemoTitle ? nemo.nemoTitle : '')
    );

    const onDelete = (e) => {
      deleteNemo(nemo.nemoId);
    };
    const onChange = (e) => {
      setNemoTitle(e.target.value);
    };
    const onSubmit = (e) => {
      e.preventDefault();
      const newNemo = { ...nemo, nemoTitle: nemoTitle };
      saveNemo(newNemo);
      setInputToggle((inputToggle) => !inputToggle);
    };
    const changeIsLargerSize = () => {
      let nColumn = nemo.column;
      let nRow = nemo.row;
      if (!isLargerSize) {
        nColumn < 3 && (nColumn = 3);
        nRow < 3 && (nRow = 3);
      }
      const newNemo = isLargerSize
        ? { ...nemo, column: nColumn, row: nRow, isLargerSize: false }
        : { ...nemo, column: nColumn, row: nRow, isLargerSize: true };
      // setNemo(newNemo);
      saveNemo(newNemo);
      setIsLargerSize((isLargerSize) => !isLargerSize);
    };

    const onRefresh = (e) => {
      setRotate(true);
      console.log(
        `i have ${
          (nemo.channelId && 'channelId') || (nemo.playListId && 'playListId') || 'no Id'
        }`
      );
      nemo.channelId && addChannel(nemo.channelId, nemo.originTitle, nemo);
      nemo.playListId && addPlayList(nemo.playListId, nemo);
      setTimeout(() => {
        setRotate(false);
      }, 1600);
    };
    //플레이어
    const nemoPlayer = (videoId) => {
      videoId && pagePlayer(nemo.nemoId, videoId);
    };

    useEffect(() => {
      // setNemo(nemoPre);
      setIsLargerSize(nemo && nemo.isLargerSize);
      setVideos(nemo && nemo.videos !== undefined && [...nemo.videos]);
    }, [nemo]);

    // 드래그 앤 드랍
    const [{ isDragging }, dragRef, previewRef] = useDrag(
      () => ({
        type: ItemTypes.Nemo,
        item: { id, index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [id, index, moveNemo]
    );

    const [, dropLeft] = useDrop(
      () => ({
        accept: ItemTypes.Nemo,
        canDrop: () => false,
        hover({ id: draggedId, index: orgIndex }) {
          if (draggedId === id) return;
          if (orgIndex === index - 1) return;
          moveNemo(draggedId, index);
        },
      }),
      [moveNemo]
    );
    const [, dropRight] = useDrop(
      () => ({
        accept: ItemTypes.Nemo,
        canDrop: () => false,
        hover({ id: draggedId, index: orgIndex }) {
          if (draggedId === id) return;
          if (orgIndex === index + 1) return;
          moveNemo(draggedId, index + 1, nemo);
        },
      }),
      [moveNemo]
    );
    useEffect(() => {
      isDragging ? setSomeDragging(true) : setSomeDragging(false);
    }, [isDragging, setSomeDragging]);

    //드래그 리사이즈
    const gridRatio = isLargerSize ? 3 : 2;

    const saveGrid = _.throttle((newGrid) => {
      const { column, row } = newGrid;
      const newNemo = { ...nemo, column: column, row: row };
      saveNemo(newNemo, { column, row });
    }, 50);

    useEffect(() => {
      const wPerColumn = ref.current.clientWidth / nemo.column;
      const hPerRow = ref.current.clientHeight / nemo.row;
      setRect({ wPerColumn, hPerRow });
    }, [setRect, nemo]);

    const [{ isResizing }, resizeRef] = useDrag(
      () => ({
        type: ItemTypes.Resize,
        item: {
          column: nemo && nemo.column,
          row: nemo && nemo.row,
          wPerColumn: rect && rect.wPerColumn,
          hPerRow: rect && rect.hPerRow,
          saveGrid,
          gridRatio,
        },
        collect: (monitor) => ({
          isResizing: monitor.isDragging(),
        }),
      }),
      [nemo, rect, isLargerSize, saveGrid]
    );

    const themeClass = darkTheme ? styles.dark : styles.light;
    previewRef(ref);
    return (
      <div
        id={nemo && nemo.nemoId}
        className={styles.nemo}
        ref={ref}
        style={{
          opacity: isDragging ? '0.3' : '1',
          gridColumn: nemo && `auto/span ${nemo.column}`,
          gridRow: nemo && `auto/span ${nemo.row}`,
        }}
      >
        {edit && (
          <div className={`${styles.edit} ${themeClass}`}>
            <i
              className="fas fa-arrows-alt"
              ref={dragRef}
              style={{
                marginRight: '0.5em',
                cursor: 'move',
                zIndex: 10,
                padding: '0.5em',
              }}
            />
            {inputToggle && (
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="새로운 제목을 입력해주세요"
                  value={nemoTitle}
                  onChange={onChange}
                />
              </form>
            )}
            {!inputToggle &&
              nemo &&
              (nemo.nemoTitle || nemo.originTitle || '제목을 지어주세요!')}
            <i className="far fa-edit" onClick={onSubmit} title="제목을 수정합니다." />
            <i
              className="fas fa-minus-circle"
              onClick={onDelete}
              title="카드를 삭제합니다."
            />
            <i
              className={isLargerSize ? 'fas fa-compress' : 'fas fa-expand'}
              onClick={changeIsLargerSize}
              title={
                isLargerSize ? '이미지 크기를 축소합니다.' : '이미지 크기를 확대합니다.'
              }
            />
            <i
              className={`fas fa-redo ${rotate && styles.rotate}`}
              onClick={onRefresh}
              title="재생목록을 다시 불러옵니다."
            />
          </div>
        )}
        {!edit && (
          <div
            className={`${styles.title} ${themeClass}`}
            ref={dragRef}
            title="다른 카드 옆으로 드래그해서 위치를 변경합니다."
          >
            {!inputToggle && (
              <span
                className={`${styles.span} ${themeClass}`}
                style={{
                  pointerEvents: 'none',
                }}
              >
                <i
                  className="fas fa-star-of-life"
                  style={{
                    color: `${darkTheme ? COLORS.Dgrey3 : COLORS.Lgrey2}`,
                    marginRight: '1em',
                    fontSize: '0.5em',
                  }}
                />
                {nemo && (nemo.nemoTitle || nemo.originTitle || '제목을 지어주세요!')}
              </span>
            )}
          </div>
        )}
        <div
          className={styles.imgs}
          style={
            nemo && {
              border: isResizing ? `solid 2px ${COLORS.mainColorL}` : 'none',
              backgroundColor: darkTheme ? COLORS.Dgrey3 : COLORS.Lgrey3,
              zIndex: modalOn && 100,
            }
          }
        >
          {videos &&
            videos.map(
              (video, index) =>
                index <
                  parseInt(nemo.column / gridRatio) * parseInt(nemo.row / gridRatio) && (
                  <Video
                    key={index}
                    video={video}
                    isLargerSize={isLargerSize}
                    nemoPlayer={nemoPlayer}
                    darkTheme={darkTheme}
                    flexRatio={100 / parseInt(nemo.column / gridRatio)}
                  />
                )
            )}
          {videos &&
            videos.length <
              parseInt(nemo.column / gridRatio) * parseInt(nemo.row / gridRatio) && (
              <div
                className={`${styles.btnDiv} ${themeClass}`}
                style={{
                  width: 100 / parseInt(nemo.column / gridRatio) + '%',
                  height: 'auto',
                }}
              >
                <button
                  className={`${styles.videoBtn} ${themeClass}`}
                  onClick={() => setModalOn('video')}
                >
                  영상 추가
                </button>
              </div>
            )}
          {!videos && (
            <div
              className={`${styles.btnContainer}`}
              style={
                nemo && {
                  minHeight: nemo.row * 50,
                }
              }
            >
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.chBtn} ${themeClass}`}
                  onClick={() => setModalOn('channel')}
                >
                  채널 추가
                </button>
              </div>
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.listBtn} ${themeClass}`}
                  onClick={() => setModalOn('playList')}
                >
                  재생목록 추가
                </button>
              </div>
            </div>
          )}
          {modalOn && (
            <AddNemo
              nemo={nemo}
              youtube={youtube}
              modalOn={modalOn}
              setModalOn={setModalOn}
              addNemo={addNemo}
              darkTheme={darkTheme}
              addChannel={addChannel}
              addPlayList={addPlayList}
              addVideo={addVideo}
            />
          )}
        </div>

        <button
          className={`${styles.drag} ${themeClass}`}
          ref={resizeRef}
          style={{
            color: COLORS.mainColorL,
          }}
        >
          {isResizing && `${nemo.column}x${nemo.row}`}
        </button>
        <div
          ref={dropLeft}
          className={`${styles.drop} ${styles.left}`}
          style={{ zIndex: someDragging ? 30 : 0 }}
        ></div>
        <div
          ref={dropRight}
          className={`${styles.drop} ${styles.right}`}
          style={{ zIndex: someDragging ? 30 : 0 }}
        ></div>
      </div>
    );
  }
);
export default Nemo;
