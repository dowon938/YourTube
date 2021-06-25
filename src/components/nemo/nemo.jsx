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
    nemoPre,
    edit,
    deleteNemo,
    changeNemo,
    moveNemo,
    addNemo,
    pagePlayer,
    someDragging,
    setSomeDragging,
    darkTheme,
    // setModalOn,
    youtube,
    // modalOn,
  }) => {
    const [nemo, setNemo] = useState(nemoPre);
    const [inputToggle, setInputToggle] = useState(false);
    const [rect, setRect] = useState(null);
    const [videos, setVideos] = useState();
    // nemoPre.videos !== undefined && [...nemoPre.videos]
    const [double, setDouble] = useState(nemo.double);
    const [rotate, setRotate] = useState(false);
    const [modalOn, setModalOn] = useState(false);

    const spanRef = useRef();
    const sonRef = useRef();
    const editTitle = () => {
      setInputToggle((inputToggle) => !inputToggle);
    };
    const onDelete = (e) => {
      deleteNemo(nemo.nemoId);
      console.log(nemo);
    };
    const onChange = (e) => {
      const newNemo = { ...nemo, newTitle: e.target.value };
      setNemo(newNemo);
      changeNemo(newNemo);
    };
    const onSubmit = (e) => {
      e.preventDefault();
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
      setNemo(newNemo);
      changeNemo(newNemo);
      setDouble((double) => !double);
    };

    const onRefresh = (e) => {
      setRotate(true);
      addNemo(nemo.nemoId, nemo);
      setTimeout(() => {
        setRotate(false);
      }, 2400);
    };
    //플레이어
    const nemoPlayer = (videoId) => {
      videoId && pagePlayer(nemo.nemoId, videoId);
    };

    useEffect(() => {
      setNemo(nemo);
      setVideos(nemo.videos !== undefined && [...nemo.videos]);
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
      setNemo(newNemo);
      changeNemo(newNemo);
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
          column: nemo.column,
          row: nemo.row,
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
        id={nemo.nemoId}
        className={styles.nemo}
        ref={previewRef}
        style={{
          opacity: isDragging ? '0.3' : '1',
          gridColumn: nemo.column === 9 ? `auto/span 10` : `auto/span ${nemo.column}`,
          gridRow: `auto/span ${nemo.row}`,
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
                  value={nemo.newTitle ? nemo.newTitle : ''}
                  onChange={onChange}
                />
              </form>
            )}
            {!inputToggle && (nemo.newTitle || nemo.nemoTitle || '제목을 지어주세요!')}
            <i className="far fa-edit" onClick={editTitle} title="제목을 수정합니다." />
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
              {nemo.newTitle || nemo.nemoTitle || '제목을 지어주세요!'}
            </span>
          )}
        </div>
        <div
          ref={sonRef}
          className={styles.imgs}
          style={{
            gridTemplateColumns: `repeat(${
              nemo.column - (nemo.column % gridRatio)
            }, 1fr)`,
            gridTemplateRows: `repeat(${nemo.row - (nemo.row % gridRatio)}, 1fr)`,
            border: isResizing ? `solid 2px ${COLORS.mainColorL}` : 'none',
            backgroundColor: darkTheme ? COLORS.Dgrey3 : COLORS.Lgrey3,
            display: videos ? 'grid' : 'flex',
            zIndex: modalOn && 100,
          }}
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
          {!videos && (
            <div
              className={`${styles.btnContainer}`}
              style={{
                minHeight: nemo.row * 50,
              }}
            >
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.chBtn} ${themeClass}`}
                  onClick={() => setModalOn('Channel')}
                >
                  채널 추가하기
                </button>
              </div>
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.listBtn} ${themeClass}`}
                  onClick={() => setModalOn('List')}
                >
                  재생목록 추가하기
                </button>
              </div>
              <div className={`${styles.btnDiv} ${themeClass}`}>
                <button
                  className={`${styles.videoBtn} ${themeClass}`}
                  onClick={() => setModalOn('Video')}
                >
                  영상 추가하기
                </button>
              </div>
            </div>
          )}
          {modalOn && (
            <AddNemo
              youtube={youtube}
              modalOn={modalOn}
              setModalOn={setModalOn}
              addNemo={addNemo}
              darkTheme={darkTheme}
            />
          )}
        </div>

        <button className={`${styles.drag} ${themeClass}`} ref={resizeRef}></button>
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
