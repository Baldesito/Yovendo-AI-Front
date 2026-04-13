import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { Spinner } from 'react-bootstrap'; 
import Navigation from './Components/Navigation';
import Home from './Components/Home';
import Footer from './Components/Footer';
import ConnectionStatus from './Components/ConnectionStatus';
import './App.css';
import './index.css';
import { checkServerHealth } from './Components/Dashboard/API1';
import Dashboard from './Components/Dashboard';

function App() {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { // <-- RIMOSSO (e)
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'https://yovendo-ai.onrender.com/api';

 useEffect(() => {
    const init = async () => {
      try { 
        await checkServerHealth(); 
      } catch { // <-- RIMOSSO (e)
        // Ignoriamo l'errore silenziosamente
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  if (isLoading) return <div className="min-vh-100 d-flex justify-content-center align-items-center bg-black text-white"><Spinner animation="border" /></div>;

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ConnectionStatus apiUrl={apiUrl} />
        <Navigation user={user} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
            {/* ROTTA PROTETTA: Se l'utente c'è, mostra Dashboard. Altrimenti torna a Home */}
            <Route 
              path="/dashboard/*" 
              element={user ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!user && <Footer />}
      </div>
    </Router>
  );
}

export default App;