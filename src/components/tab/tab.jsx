import React from 'react';
import styles from './tab.module.css';

const Tab = ({ page, setSelected, selected }) => {
  const onSelect = (event) => {
    setSelected(event.target.dataset.id);
  };
  const selectedOn = selected === page.id ? styles.on : '';
  return (
    <div data-id={page.id} onClick={onSelect} className={`${styles.tab} ${selectedOn}`}>
      {page.pageTitle}
    </div>
  );
};

export default Tab;
