import { useState, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';
import Player from './components/player/player';
import Help from './components/help/help';

function App({ authService, dbService, youtube }) {
  const [cookies, setCookie, removeCookie] = useCookies(['popUp']);
  const [user, setUser] = useState({});
  const [player, setPlayer] = useState(false);
  const [help, setHelp] = useState(false);
  const [dbTheme, setDbTheme] = useState();
  const [darkTheme, setDarkTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  //플레이어
  const onPlayer = (findPage, nemoId, video) => {
    findPage && nemoId && video && setPlayer({ findPage, nemoId, video });
  };

  const logOut = useCallback(() => {
    authService.logout();
    setUser({});
  }, [authService]);
  const helpToggle = () => {
    setHelp((help) => !help);
  };

  useEffect(() => {
    authService.onAuthChange((data) => {
      data &&
        setUser({
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
    });
  }, [authService, setUser]);

  useEffect(() => {
    const stopRead = dbService.readTheme(user.uid, setDbTheme);
    return () => stopRead();
  }, [dbService, user.uid, setDbTheme]);
  useEffect(() => {
    dbTheme !== null
      ? setDarkTheme(dbTheme)
      : setDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [dbTheme, setDarkTheme]);
  useEffect(() => {
    if (cookies.popUp === undefined) {
      setHelp(true);
    } else {
      setHelp(false);
    }
  }, [setHelp, cookies]);
  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div
      className={`${styles.app} ${themeClass}`}
      style={{
        height: (player || help) && '100vh',
        overflow: (player || help) && 'hidden',
      }}
    >
      <Header
        user={user}
        logOut={logOut}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        authService={authService}
        dbService={dbService}
        helpToggle={helpToggle}
      />
      <Home
        authService={authService}
        dbService={dbService}
        youtube={youtube}
        userId={user.uid}
        onPlayer={onPlayer}
        setPlayer={setPlayer}
        darkTheme={darkTheme}
      />
      {player && (
        <Player
          player={player}
          setPlayer={setPlayer}
          findPage={player.findPage}
          order={player.findPage.order}
          youtube={youtube}
          darkTheme={darkTheme}
        />
      )}
      {help && (
        <Help helpToggle={helpToggle} setCookie={setCookie} removeCookie={removeCookie} />
      )}
    </div>
  );
}

export default App;
