import { useState } from 'react';
import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCallback } from 'react';
import { useEffect } from 'react';
import Player from './components/player/player';

function App({ authService, dbService, youtube }) {
  const [user, setUser] = useState({});
  const [player, setPlayer] = useState(false);
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
  return (
    <div className={styles.app}>
      <DndProvider backend={HTML5Backend}>
        <Header authService={authService} user={user} logOut={logOut} />
        <div
          style={{
            position: player && 'fixed',
          }}
        >
          <Home
            authService={authService}
            dbService={dbService}
            youtube={youtube}
            userId={user.uid}
            onPlayer={onPlayer}
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
        />
      )}
    </div>
  );
}

export default App;
