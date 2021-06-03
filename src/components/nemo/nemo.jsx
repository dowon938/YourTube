import React from 'react';
import { useEffect, useRef, useState } from 'react/cjs/react.development';
import styles from './nemo.module.css';
import Video from './video';

import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/items';

const Nemo = ({ nemoPre, edit, deleteNemo, changeNemoTitle, moveNemo, findNemo }) => {
  const [nemo, setNemo] = useState(nemoPre);
  const [inputToggle, setInputToggle] = useState(false);
  const [grid, setGrid] = useState({
    column: nemoPre.column || 3,
    row: nemoPre.row || 3,
  });
  const [rect, setRect] = useState(null);
  const [videos, setVideos] = useState([...nemoPre.videos]);
  const [double, setDouble] = useState(false);

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
    changeNemoTitle(newNemo);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setInputToggle((inputToggle) => !inputToggle);
  };
  const changeDouble = () => {
    setDouble((double) => !double);
  };
  useEffect(() => {
    if (double) {
      let newColumn = grid.column;
      let newRow = grid.row;
      if (double) newColumn % 2 === 1 && newColumn++;
      if (double) newRow % 2 === 1 && newRow++;
      setGrid({ column: newColumn, row: newRow });
    }
  }, [double]);

  //드래그 앤 드랍
  const id = nemoPre.nemoId;
  const originalIndex = findNemo(id).index;
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
          moveNemo(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveNemo]
  );
  const [, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.Nemo,
      canDrop: () => false,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findNemo(id);
          moveNemo(draggedId, overIndex);
        }
      },
    }),
    [findNemo, moveNemo]
  );
  //드래그 리사이즈
  useEffect(() => {
    const width = sonRef.current.clientWidth;
    const height = sonRef.current.clientHeight;
    setRect({ width, height });
  }, [sonRef]);
  const [{ isResizing }, resizeRef, resizePreview] = useDrag(
    () => ({
      type: ItemTypes.Resize,
      item: {
        column: grid.column,
        row: grid.row,
        width: rect && rect.width,
        height: rect && rect.height,
        setGrid,
        double,
      },
      collect: (monitor) => ({
        isResizing: monitor.isDragging(),
      }),
    }),
    [grid, rect]
  );
  return (
    <div
      id={nemo.nemoId}
      className={`${styles.nemo} ${styles.number}`}
      ref={(node) => previewRef(dropRef(node))}
      style={{
        opacity: isDragging ? '0' : '1',
        gridColumn: `auto/span ${grid.column}`,
        gridRow: `auto/span ${grid.row}`,
      }}
    >
      {/* <div ref={sonRef} /> */}
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
          <i className="far fa-edit" onClick={editTitle}></i>
          <i className="fas fa-minus-circle" onClick={onDelete}></i>
          <i className="fas fa-photo-video" onClick={changeDouble}>
            x2
          </i>
        </div>
      )}
      <div className={styles.title} ref={dragRef}>
        {!inputToggle && (nemo.newTitle ? nemo.newTitle : nemo.nemoTitle)}
      </div>
      <div
        ref={sonRef}
        className={styles.imgs}
        style={{
          gridTemplateColumns: `repeat(${grid.column}, 1fr)`,
          gridTemplateRows: `repeat(${grid.row}, 1fr)`,
        }}
      >
        {double
          ? videos.map(
              (video, index) =>
                index < (grid.column * grid.row) / 4 && (
                  <Video key={index} video={video} double={double} />
                )
            )
          : videos.map(
              (video, index) =>
                index < grid.column * grid.row && (
                  <Video key={index} video={video} double={double} />
                )
            )}
      </div>
      <button className={styles.drag} ref={resizeRef}></button>
    </div>
  );
};

export default Nemo;
