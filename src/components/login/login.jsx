import React from 'react';
import styles from './login.module.css';

const Login = ({ authService, className }) => {
  const onlogin = (event) => {
    authService.login(event.target.dataset.auth);
  };

  return (
    <div className={(className, styles.container)}>
      <i
        className={`fab fa-google ${styles.google}`}
        onClick={onlogin}
        data-auth={'Google'}
      ></i>
      <i
        className={`fab fa-github ${styles.github}`}
        onClick={onlogin}
        data-auth={'Github'}
      ></i>
    </div>
  );
};

export default Login;
