import { useState } from 'react';
import styles from './app.module.css';
import Header from './components/header/header';
import Home from './components/home/home';

function App({ authService, dbService }) {
  const [user, setUser] = useState({});
  return (
    <div>
      <Header authService={authService} setUser={setUser} />
      <Home authService={authService} dbService={dbService} />
    </div>
  );
}

export default App;
