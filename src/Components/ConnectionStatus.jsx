import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';


const ConnectionStatus = ({ apiUrl }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'sleeping'
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(''); // CORRETTO: da errorMess a errorMessage
  const [visible, setVisible] = useState(true);
  
  // Usiamo un ref per tracciare se il componente è ancora montato
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    const controller = new AbortController();
    
    const checkConnection = async () => {
      try {
        if (isMounted.current) setStatus('checking');
        
        // Timeout di 15 secondi
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const healthEndpoint = apiUrl.endsWith('/api') ? `${apiUrl}/health` : `${apiUrl}/api/health`;
        
        console.log(`Verifica connessione a: ${healthEndpoint}`);
        
        const response = await fetch(healthEndpoint, { 
          signal: controller.signal,
          mode: 'cors', 
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        
        if (!isMounted.current) return; // Evita di aggiornare lo stato se smontato

        if (response.ok) {
          console.log('Connessione al server stabilita con successo');
          setStatus('online');
          setErrorMessage('');
          setTimeout(() => { if (isMounted.current) setVisible(false); }, 3000);
        } else if (response.status === 503) {
          console.log('Server in fase di avvio (503)');
          setStatus('sleeping');
          setErrorMessage(`Risposta del server: ${response.status}`);
          setTimeout(() => { if (isMounted.current) setRetryCount(c => c + 1); }, 5000);
        } else {
          console.log(`Errore nella risposta del server: ${response.status}`);
          setStatus('offline');
          setErrorMessage(`Codice errore: ${response.status}`);
          setTimeout(() => { if (isMounted.current) setRetryCount(c => c + 1); }, 10000);
        }
      } catch (error) {
        if (!isMounted.current) return;
        
        console.error('Errore nella verifica della connessione:', error);
        
        // Se è un AbortError (Timeout)
        if (error.name === 'AbortError') {
          console.log('Timeout nella connessione al server');
          setStatus('sleeping');
          setErrorMessage('Timeout nella connessione (il server potrebbe essere in avvio)');
          setTimeout(() => { if (isMounted.current) setRetryCount(c => c + 1); }, 5000);
        } else {
          // Se è un altro tipo di errore (es. rete staccata o server spento)
          setStatus('offline');
          setErrorMessage(error.message || 'Errore di rete');
          setTimeout(() => { if (isMounted.current) setRetryCount(c => c + 1); }, 10000);
        }
      }
    };
    
    if (visible) {
      checkConnection();
    }
    
    // Funzione di cleanup che viene chiamata quando il componente viene distrutto o prima del prossimo re-render
    return () => {
      isMounted.current = false;
      controller.abort(); // Interrompe eventuali fetch in corso per evitare errori in console
    };
  }, [apiUrl, retryCount, visible]);

  const handleRetry = () => {
    console.log("Tentativo manuale di riconnessione");
    setRetryCount(c => c + 1);
  };

  if (!visible || status === 'online') return null;

  const getStatusConfig = () => {
    switch(status) {
      case 'checking': 
        return { bg: 'rgba(52, 144, 220, 0.2)', border: 'var(--primary)', icon: <Spinner size="sm" className="me-2 text-primary"/>, text: "Verifica connessione..." };
      case 'sleeping': 
        return { bg: 'rgba(246, 224, 94, 0.2)', border: 'var(--warning)', icon: <Spinner size="sm" className="me-2 text-warning"/>, text: "Risveglio server in corso..." };
      case 'offline': 
        return { bg: 'rgba(252, 129, 129, 0.2)', border: 'var(--danger)', icon: <span className="me-2 text-danger fw-bold">!</span>, text: "Server offline" };
      default: 
        return { bg: 'rgba(0,0,0,0)', border: 'transparent', icon: null, text: "" };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className="position-fixed d-flex align-items-center px-4 py-2 glass-card shadow"
      style={{ 
        top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1060,
        backgroundColor: config.bg, border: `1px solid ${config.border}`
      }}
    >
      {config.icon}
      <span className="text-white fw-semibold small">
        {config.text} 
        {/* Mostriamo un piccolo tooltip al passaggio del mouse se c'è un errore specifico */}
        {errorMessage && status === 'offline' && <span title={errorMessage} style={{cursor: 'help'}}> ℹ️</span>}
      </span>
      {status === 'offline' && (
        <button 
          onClick={handleRetry} 
          className="btn btn-sm text-white ms-3 p-0 fw-bold border-0 bg-transparent text-decoration-none opacity-75 hover-primary"
        >
          Riprova
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;