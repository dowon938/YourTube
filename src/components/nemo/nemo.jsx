import React from 'react';
import { useEffect, useRef, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';
import { COLORS } from '../../common/colors';

import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import _ from 'lodash';
import { memo } from 'react';
import AddNemo from '../addNemo/addNemo';

const Nemo = memo(
  ({
    id,
    index,
    nemo,
    edit,
    deleteNemo,
    saveNemo,
    moveNemo,
    addNemo,
    pagePlayer,
    someDragging,
    setSomeDragging,
    darkTheme,
    youtube,
    addChannel,
    addPlayList,
    addVideo,
  }) => {
    // const [nemo, setNemo] = useState(nemoPre);
    const [inputToggle, setInputToggle] = useState(false);
    const [rect, setRect] = useState(null);
    const [videos, setVideos] = useState();
    const [double, setDouble] = useState();
    const [rotate, setRotate] = useState(false);
    const [modalOn, setModalOn] = useState(false);
    const [nemoTitle, setNemoTitle] = useState(
      Nemo && (nemo.nemoTitle ? nemo.nemoTitle : '')
    );

    const spanRef = useRef();
    const sonRef = useRef();

    const onDelete = (e) => {
      deleteNemo(nemo.nemoId);
      console.log(nemo);
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
    const changeDouble = () => {
      let nColumn = nemo.column;
      let nRow = nemo.row;
      if (!double) {
        nColumn < 3 && (nColumn = 3);
        nRow < 3 && (nRow = 3);
      }
      const newNemo = double
        ? { ...nemo, column: nColumn, row: nRow, double: false }
        : { ...nemo, column: nColumn, row: nRow, double: true };
      // setNemo(newNemo);
      saveNemo(newNemo);
      setDouble((double) => !double);
    };

    const onRefresh = (e) => {
      setRotate(true);
      addChannel(nemo.channelId, nemo.channelTitle, nemo);
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
      setDouble(nemo && nemo.double);
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
        end: (item, monitor) => {
          const { id: droppedId, index } = item;
          const didDrop = monitor.didDrop();
          if (!didDrop) {
            moveNemo(droppedId, index);
          }
        },
      }),
      [id, index, moveNemo]
    );
    // const [, dropRef] = useDrop(
    //   () => ({
    //     accept: ItemTypes.Nemo,
    //     canDrop: () => false,
    //     hover({ id: draggedId }) {
    //       if (draggedId !== id) {
    //         moveNemo(draggedId, index);
    //       }
    //     },
    //   }),
    //   [moveNemo]
    // );
    const [, dropLeft] = useDrop(
      () => ({
        accept: ItemTypes.Nemo,
        canDrop: () => false,
        hover({ id: draggedId, index: orgIndex }) {
          if (draggedId !== id) {
            moveNemo(draggedId, index);
          }
        },
      }),
      [moveNemo]
    );
    const [, dropRight] = useDrop(
      () => ({
        accept: ItemTypes.Nemo,
        canDrop: () => false,
        hover({ id: draggedId, index: orgIndex }) {
          if (draggedId !== id) {
            orgIndex !== index + 1 && moveNemo(draggedId, index + 1);
          }
        },
      }),
      [moveNemo]
    );
    useEffect(() => {
      isDragging ? setSomeDragging(true) : setSomeDragging(false);
    }, [isDragging, setSomeDragging]);

    //드래그 리사이즈
    const gridRatio = double ? 3 : 2;
    const throttleGrid = _.throttle((newGrid) => {
      const { column, row } = newGrid;
      const newNemo = { ...nemo, column: column, row: row };
      // setNemo(newNemo);
      saveNemo(newNemo);
    }, 50);
    useEffect(() => {
      const width = sonRef.current.clientWidth;
      const height = sonRef.current.clientHeight;
      setRect({ width, height });
    }, [sonRef, nemo]);
    const [{ isResizing }, resizeRef] = useDrag(
      () => ({
        type: ItemTypes.Resize,
        item: {
          column: nemo && nemo.column,
          row: nemo && nemo.row,
          width: rect && rect.width,
          height: rect && rect.height,
          throttleGrid,
          double,
        },
        collect: (monitor) => ({
          isResizing: monitor.isDragging(),
        }),
      }),
      [nemo, rect, double, throttleGrid]
    );

    const themeClass = darkTheme ? styles.dark : styles.light;

    return (
      <div
        id={nemo && nemo.nemoId}
        className={styles.nemo}
        ref={previewRef}
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
              (nemo.nemoTitle || nemo.channelTitle || '제목을 지어주세요!')}
            <i className="far fa-edit" onClick={onSubmit} title="제목을 수정합니다." />
            <i
              className="fas fa-minus-circle"
              onClick={onDelete}
              title="카드를 삭제합니다."
            />
            <i
              className={double ? 'fas fa-compress' : 'fas fa-expand'}
              onClick={changeDouble}
              title={double ? '이미지 크기를 축소합니다.' : '이미지 크기를 확대합니다.'}
            />
            <i
              className={`fas fa-redo ${rotate && styles.rotate}`}
              onClick={onRefresh}
              title="재생목록을 다시 불러옵니다."
            />
          </div>
        )}
        <div
          className={`${styles.title} ${themeClass}`}
          ref={dragRef}
          title="다른 카드 옆으로 드래그해서 위치를 변경합니다."
        >
          {/* <div ref={dropRef} className={styles.dropRef}></div> */}
          {!inputToggle && (
            <span className={`${styles.span} ${themeClass}`} ref={spanRef}>
              {nemo && (nemo.nemoTitle || nemo.channelTitle || '제목을 지어주세요!')}
            </span>
          )}
        </div>
        <div
          ref={sonRef}
          className={styles.imgs}
          style={
            nemo && {
              gridTemplateColumns: `repeat(${
                nemo.column - (nemo.column % gridRatio)
              }, 1fr)`,
              gridTemplateRows: `repeat(${nemo.row - (nemo.row % gridRatio)}, 1fr)`,
              border: isResizing ? `solid 2px ${COLORS.mainColorL}` : 'none',
              backgroundColor: darkTheme ? COLORS.Dgrey3 : COLORS.Lgrey3,
              display: videos ? 'grid' : 'flex',
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
                    double={double}
                    nemoPlayer={nemoPlayer}
                    darkTheme={darkTheme}
                  />
                )
            )}
          {videos &&
            videos.length <
              parseInt(nemo.column / gridRatio) * parseInt(nemo.row / gridRatio) && (
              <div
                className={`${styles.btnDiv} ${themeClass}`}
                style={{
                  gridColumn: double ? `auto/span 3` : 'auto/span 2',
                  gridRow: double ? `auto/span 3` : 'auto/span 2',
                  width: '100%',
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
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.videoBtn} ${themeClass}`}
                  onClick={() => setModalOn('video')}
                >
                  영상 추가
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

        <button className={`${styles.drag} ${themeClass}`} ref={resizeRef}>
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
