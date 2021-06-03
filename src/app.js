import { useState } from 'react';
import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App({ authService, dbService, youtube }) {
  const [user, setUser] = useState({});

  return (
    <div className={styles.app}>
      <DndProvider backend={HTML5Backend}>
        <Header authService={authService} setUser={setUser} />
        <Home
          authService={authService}
          dbService={dbService}
          youtube={youtube}
          userId={user.uid}
        />
      </DndProvider>
    </div>
  );
}

export default App;
