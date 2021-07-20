import { useState } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback } from 'react';
import { useEffect } from 'react';
import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';
import Player from './components/player/player';
import Help from './components/help/help';

function App({ authService, dbService, youtube }) {
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

  const themeClass = darkTheme ? styles.dark : styles.light;

  return (
    <div className={`${styles.app} ${themeClass}`}>
      <Header
        user={user}
        logOut={logOut}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        authService={authService}
        dbService={dbService}
        helpToggle={helpToggle}
      />
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            height: (player || help) && '90vh',
            overflow: (player || help) && 'hidden',
          }}
        >
          <Home
            authService={authService}
            dbService={dbService}
            youtube={youtube}
            userId={user.uid}
            onPlayer={onPlayer}
            setPlayer={setPlayer}
            darkTheme={darkTheme}
          />
        </div>
      </DndProvider>
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
      {help && <Help helpToggle={helpToggle} />}
    </div>
  );
}

export default App;
