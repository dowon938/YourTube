import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { CookiesProvider } from 'react-cookie';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.module.css';
import App from './app';
import AuthService from './service/auth_service';
import DbService from './service/db';
import Youtube from './service/youtube';

const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);
const authService = new AuthService();
const dbService = new DbService();

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <CookiesProvider>
        <App authService={authService} dbService={dbService} youtube={youtube} />
      </CookiesProvider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
