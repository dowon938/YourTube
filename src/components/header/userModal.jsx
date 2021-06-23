import React from 'react';
import { COLORS } from '../../common/colors';
import styles from './userModal.module.css';

const UserModal = ({ user, logOut, darkTheme }) => {
  return (
    <div
      className={styles.userModal}
      style={{ backgroundColor: darkTheme ? COLORS.Dgrey1 : COLORS.Lgrey1 }}
    >
      <div
        className={styles.triangle}
        style={{ borderBottomColor: darkTheme ? COLORS.Dgrey1 : COLORS.Lgrey1 }}
      />
      <div className={styles.userFlex} style={{ fontSize: 1 + 'rem' }}>
        <div className={styles.userFlex2}>
          <button
            className={styles.logOut}
            onClick={logOut}
            style={{ backgroundColor: COLORS.mainColorL, color: COLORS.vWhite }}
          >
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
