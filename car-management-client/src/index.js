// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LoadingProvider } from './context/LoadingContext';
import './index.css';

ReactDOM.render(
  <LoadingProvider>
    <App />
  </LoadingProvider>,
  document.getElementById('root')
);
