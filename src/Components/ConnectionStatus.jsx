import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const ConnectionStatus = ({ apiUrl }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'sleeping'
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('checking');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setStatus('online');
          setRetryCount(0);
        } else if (response.status === 503) {
          setStatus('sleeping');
          // Riprova dopo 5 secondi
          setTimeout(() => setRetryCount(c => c + 1), 5000);
        } else {
          setStatus('offline');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          setStatus('sleeping');
          // Riprova dopo 5 secondi
          setTimeout(() => setRetryCount(c => c + 1), 5000);
        } else {
          setStatus('offline');
        }
      }
    };
    
    checkConnection();
  }, [apiUrl, retryCount]);
  
  if (status === 'online') {
    return null; // Non mostrare nulla se la connessione è attiva
  }
  
  return (
    <Alert 
      variant={status === 'checking' ? 'info' : status === 'sleeping' ? 'warning' : 'danger'}
      className="connection-alert"
    >
      {status === 'checking' && (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Verifica connessione al server...
        </>
      )}
      {status === 'sleeping' && (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Il server è in fase di avvio. Potrebbe richiedere fino a 30 secondi...
        </>
      )}
      {status === 'offline' && (
        <>
          <span className="me-2">⚠️</span>
          Non è possibile connettersi al server. Verifica la tua connessione internet.
        </>
      )}
    </Alert>
  );
};

export default ConnectionStatus;