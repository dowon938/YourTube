import { useState } from 'react';
import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback } from 'react';
import { useEffect } from 'react';
import Player from './components/player/player';
import { COLORS } from './common/colors';

function App({ authService, dbService, youtube }) {
  const [user, setUser] = useState({});
  const [player, setPlayer] = useState(false);
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
  return (
    <div
      className={styles.app}
      style={{
        backgroundColor: darkTheme ? COLORS.Dgrey2 : COLORS.Lgrey2,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <Header
          authService={authService}
          user={user}
          logOut={logOut}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
          dbService={dbService}
        />
        <div
          style={{
            height: player && '90vh',
            overflow: player && 'hidden',
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
    </div>
  );
}

export default App;
