import React from 'react';
import ReactDOM from 'react-dom/client';  // Ensure this import
import App from './App';
import './App.css'; // Or the correct path to your global CSS file


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
