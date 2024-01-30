import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/enregistrement_expo.css";
import "./styles/liste-expos.css";
import "./styles/qrcode.css"
import "./styles/historique.css"
import "./styles/form-register.css"
import "./styles/register-form-visitor.css"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);