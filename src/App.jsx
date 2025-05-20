
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navigation from './Components/Navigation';
import Home from './Components/Home';
import Footer from './Components/Footer';
import './App.css';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  // All'avvio dell'app, controlla se c'è un utente salvato
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Verifica che il token sia ancora valido (opzionale)
      setUser(storedUser);
    }
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

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ConnectionStatus apiUrl={apiUrl} />
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
            {/* Rotte protette che richiedono autenticazione */}
            <Route path="/profile" element={user ? <Navigate to="/" /> : <Navigate to="/" />} />
            <Route path="/dashboard/*" element={user ? <Navigate to="/" /> : <Navigate to="/" />} />
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