import React from 'react';
import { useEffect, useRef, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';

import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';
import _ from 'lodash';
import { memo } from 'react';

const Nemo = memo(
  ({
    nemoPre,
    edit,
    deleteNemo,
    changeNemo,
    moveNemo,
    findNemo,
    addNemo,
    pagePlayer,
  }) => {
    const [nemo, setNemo] = useState(nemoPre);
    const [inputToggle, setInputToggle] = useState(false);
    const [rect, setRect] = useState(null);
    const [videos, setVideos] = useState([...nemoPre.videos]);
    const [double, setDouble] = useState(nemoPre.double);
    const [rotate, setRotate] = useState(false);

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
      let newColumn = nemoPre.column;
      let newRow = nemoPre.row;
      newColumn % 2 === 1 && newColumn++;
      newRow % 2 === 1 && newRow++;
      const newNemo = double
        ? { ...nemo, double: false }
        : { ...nemo, column: newColumn, row: newRow, double: true };
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
      setNemo(nemoPre);
      setVideos([...nemoPre.videos]);
    }, [nemoPre]);
    //드래그 앤 드랍
    const id = nemoPre.nemoId;
    const originalIndex = findNemo(id).index;
    const throttleMoveNemo = _.throttle(
      (draggedId, overIndex) => moveNemo(draggedId, overIndex),
      100
    );
    const throttleFindNemo = _.throttle((id) => findNemo(id), 100);
    const [{ isDragging }, dragRef, previewRef] = useDrag(
      () => ({
        type: ItemTypes.Nemo,
        item: { id, originalIndex },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
          const { id: droppedId, originalIndex } = item;
          const didDrop = monitor.didDrop();
          if (!didDrop) {
            throttleMoveNemo(droppedId, originalIndex);
          }
        },
      }),
      [id, originalIndex, throttleMoveNemo]
    );

    const [, dropRef] = useDrop(
      () => ({
        accept: ItemTypes.Nemo,
        canDrop: () => false,
        hover({ id: draggedId }) {
          if (draggedId !== id) {
            const { index: overIndex } = throttleFindNemo(id);
            throttleMoveNemo(draggedId, overIndex);
          }
        },
      }),
      [throttleFindNemo, throttleMoveNemo]
    );
    //드래그 리사이즈
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
    }, [sonRef, nemoPre]);
    const [{ isResizing }, resizeRef] = useDrag(
      () => ({
        type: ItemTypes.Resize,
        item: {
          column: nemoPre.column,
          row: nemoPre.row,
          width: rect && rect.width,
          height: rect && rect.height,
          throttleGrid,
          double,
        },
        collect: (monitor) => ({
          isResizing: monitor.isDragging(),
        }),
      }),
      [nemoPre, rect, double, throttleGrid]
    );

    return (
      <div
        id={nemo.nemoId}
        className={styles.nemo}
        ref={(node) => previewRef(dropRef(node))}
        style={{
          opacity: isDragging ? '0.3' : '1',
          gridColumn: `auto/span ${nemoPre.column}`,
          gridRow: `auto/span ${nemoPre.row}`,
          border: isResizing ? 'solid 2px tomato' : 'none',
        }}
      >
        {edit && (
          <div className={styles.edit}>
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
            {!inputToggle && (nemo.newTitle ? nemo.newTitle : nemo.nemoTitle)}
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
          className={styles.title}
          ref={dragRef}
          title="다른 카드 위로 드래그해서 위치를 변경합니다."
        >
          {!inputToggle && (nemo.newTitle ? nemo.newTitle : nemo.nemoTitle)}
        </div>
        <div
          ref={sonRef}
          className={styles.imgs}
          style={{
            gridTemplateColumns: `repeat(${nemoPre.column}, 1fr)`,
            gridTemplateRows: `repeat(${nemoPre.row}, 1fr)`,
          }}
        >
          {double
            ? videos.map(
                (video, index) =>
                  index < (nemoPre.column * nemoPre.row) / 4 && (
                    <Video
                      key={index}
                      video={video}
                      double={double}
                      nemoPlayer={nemoPlayer}
                    />
                  )
              )
            : videos.map(
                (video, index) =>
                  index < nemoPre.column * nemoPre.row && (
                    <Video
                      key={index}
                      video={video}
                      double={double}
                      nemoPlayer={nemoPlayer}
                    />
                  )
              )}
          <button className={styles.drag} ref={resizeRef}></button>
        </div>
      </div>
    );
  }
);
export default Nemo;
