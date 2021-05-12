import React, { useEffect, useRef, useState } from 'react';
import Login from '../login/login';

const Header = ({ authService }) => {
  const [loginToggle, setLoginToggle] = useState(false);
  const ontoggle = (event) => {
    console.log(event.target);
    loginToggle === false ? setLoginToggle(true) : setLoginToggle(false);
  };

  useEffect(() => {
    authService.onAuthChange((user) => user && console.log(user));
  }, authService);

  return (
    <div>
      <button>YourTube</button>
      <button onClick={ontoggle}>Login</button>
      <input type="checkbox" id="login" onChange={ontoggle} />
      <label htmlFor="login">Login</label>
      {loginToggle ? <Login authService={authService} /> : <div />}
    </div>
  );
};

export default Header;
