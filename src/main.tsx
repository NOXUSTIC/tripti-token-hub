
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { clearAllUserData } from './utils/dataUtils.ts';

// Clear all user data when the app starts
clearAllUserData();
console.log("All user data cleared on app start");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
