import './app.css';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';

function App({ authService, dbService }) {
  const hi = [];
  return (
    <div>
      <Header authService={authService} />
      <Home authService={authService} dbService={dbService} />
    </div>
  );
}

export default App;
