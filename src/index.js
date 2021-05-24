import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.css';
import App from './app';
import AuthService from './service/auth_service';
import DbService from './service/db';
import 'font-awesome/css/font-awesome.min.css';
import Youtube from './service/youtube';

const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);
const authService = new AuthService();
const dbService = new DbService();

ReactDOM.render(
  <React.StrictMode>
    <App authService={authService} dbService={dbService} youtube={youtube} />
  </React.StrictMode>,
  document.getElementById('root')
);
