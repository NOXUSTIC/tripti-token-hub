
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { clearAllUserData } from './utils/dataUtils.ts';

// Clear all user data when the app starts
// Note: In a production app, you would remove this line
clearAllUserData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
