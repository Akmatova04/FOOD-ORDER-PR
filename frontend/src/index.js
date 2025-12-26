// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. BrowserRouter'ду импорт кылуу

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. <App /> компонентин <BrowserRouter> менен ороп коёбуз */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);