import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import AuthService from './service/auth_service';
import DbService from './service/db';

const authService = new AuthService();
const dbService = new DbService();

ReactDOM.render(
  <React.StrictMode>
    <App authService={authService} dbService={dbService} />
  </React.StrictMode>,
  document.getElementById('root')
);
