import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fix per l'errore useLayoutEffect in SSR
if (typeof window === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

// Gestione sicura del rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      // Rimuovi temporaneamente StrictMode per test
      //<React.StrictMode>
        <App />
      //</React.StrictMode>
    );
  } catch (error) {
    console.error('Errore durante il rendering dell\'applicazione:', error);
    
    // Fallback in caso di errore
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px;">
        <h2>Si è verificato un errore durante il caricamento dell'applicazione</h2>
        <p>Si prega di ricaricare la pagina o provare con un altro browser.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Ricarica pagina
        </button>
      </div>
    `;
  }
} else {
  console.error('Elemento con id "root" non trovato');
}