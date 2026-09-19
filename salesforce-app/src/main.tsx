import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const target = document.getElementById('root') || document.getElementById('heroScrollWrapper');
if (target) {
  ReactDOM.createRoot(target).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
