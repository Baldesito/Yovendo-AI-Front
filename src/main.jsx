import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Polyfill globale per useLayoutEffect
React.useLayoutEffect = React.useEffect;

// Assicurati che l'app venga renderizzata solo nel browser
if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
    } catch (error) {
      console.error('Errore durante il rendering:', error);
      // Fallback in caso di errore
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px; margin: 20px;">
          <h2>Si è verificato un errore durante il caricamento</h2>
          <button onclick="window.location.reload()">Ricarica pagina</button>
        </div>
      `;
    }
  }
}