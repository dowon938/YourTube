import React from 'react';
import styles from './userModal.module.css';

const UserModal = ({ user, logOut, darkTheme }) => {
  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div className={`${styles.userModal} ${themeClass}`}>
      <div className={`${styles.triangle} ${themeClass}`} />
      <div className={styles.userFlex}>
        <div className={styles.userFlex2}>
          <button className={`${styles.logOut} ${themeClass}`} onClick={logOut}>
            LogOut!
          </button>
          <img src={user.photoURL} alt="user" className={styles.userImg} />
        </div>
        <span>{user.displayName}</span>
        <span>{user.email}</span>
      </div>
    </div>
  );
};

export default UserModal;
