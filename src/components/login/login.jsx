import React, { useEffect } from 'react';

const Login = ({ authService }) => {
  const onlogin = (event) => {
    authService.login(event.target.innerText);
  };
  return (
    <div>
      <button onClick={onlogin}>Google</button>
      <button onClick={onlogin}>Github</button>
    </div>
  );
};

export default Login;
