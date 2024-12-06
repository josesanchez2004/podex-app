import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM's createRoot
import App from './App';

// Find the root element in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
