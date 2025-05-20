import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navigation from './Components/Navigation';
import Home from './Components/Home';
import Footer from './Components/Footer';
import ConnectionStatus from './Components/ConnectionStatus';
import './App.css';
import './index.css';
import { checkServerHealth, getCurrentUser } from './Components/Dashboard/API1';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  // All'avvio dell'app, controlla se c'è un utente salvato
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      try {
        // Controlla se c'è un utente salvato nel localStorage
        const storedUser = getCurrentUser();
        
        if (storedUser) {
       
          setUser(storedUser);
        }
        
        // Verifica che il server sia raggiungibile (opzionale)
        await checkServerHealth();
      } catch (error) {
        console.error('Errore durante l\'inizializzazione dell\'app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Funzione per gestire il login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Componente di caricamento
  if (isLoading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Inizializzazione dell'applicazione...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ConnectionStatus apiUrl={apiUrl} />
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
            {/* Rotte protette che richiedono autenticazione */}
            <Route 
              path="/dashboard/*" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/" />} 
            />
            {/* Rotta di fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;