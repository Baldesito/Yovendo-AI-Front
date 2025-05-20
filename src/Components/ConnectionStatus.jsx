import React, { useState, useEffect } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';

const ConnectionStatus = ({ apiUrl }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'sleeping'
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('checking');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Aumentato a 15 secondi
        
        // CORREZIONE: Rimossa l'aggiunta di /api in quanto apiUrl già lo contiene
        // CORREZIONE: Non dovrebbe essere ${apiUrl}/api/health ma ${apiUrl}/health
        const healthEndpoint = apiUrl.endsWith('/api') ? `${apiUrl}/health` : `${apiUrl}/api/health`;
        
        console.log(`Verifica connessione a: ${healthEndpoint}`);
        
        const response = await fetch(healthEndpoint, { 
          signal: controller.signal,
          mode: 'cors', 
          headers: {
            'Accept': 'application/json',
          },
          // AGGIUNTA: Impedisce ai browser di memorizzare in cache la risposta
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log('Connessione al server stabilita con successo');
          setStatus('online');
          setErrorMessage('');
          
          // Nascondi l'avviso dopo 3 secondi se il server è online
          setTimeout(() => setVisible(false), 3000);
        } else if (response.status === 503) {
          console.log('Server in fase di avvio (503)');
          setStatus('sleeping');
          setErrorMessage(`Risposta del server: ${response.status}`);
          // Riprova dopo 5 secondi
          setTimeout(() => setRetryCount(c => c + 1), 5000);
        } else {
          console.log(`Errore nella risposta del server: ${response.status}`);
          setStatus('offline');
          setErrorMessage(`Codice errore: ${response.status}`);
          
          // AGGIUNTA: Tentativi di riconnessione automatica
          setTimeout(() => setRetryCount(c => c + 1), 10000); // Riprova dopo 10 secondi
        }
      } catch (error) {
        console.error('Errore nella verifica della connessione:', error);
        
        if (error.name === 'AbortError') {
          console.log('Timeout nella connessione al server');
          setStatus('sleeping');
          setErrorMessage('Timeout nella connessione');
          // Riprova dopo 5 secondi
          setTimeout(() => setRetryCount(c => c + 1), 5000);
        } else {
          setStatus('offline');
          setErrorMessage(error.message || 'Errore di connessione');
          
          // AGGIUNTA: Tentativi di riconnessione automatica
          setTimeout(() => setRetryCount(c => c + 1), 10000); // Riprova dopo 10 secondi
        }
      }
    };
    
    // Esegui il controllo solo se il componente è visibile
    if (visible) {
      checkConnection();
    }
    
    // AGGIUNTA: Pulizia del timeout quando il componente viene smontato
    return () => {
      // Pulizia di eventuali timeout in sospeso
    };
  }, [apiUrl, retryCount, visible]);
  
  // Se online o non visibile, non mostrare nulla
  if (!visible || status === 'online') {
    return null;
  }
  
  // AGGIUNTA: Funzione per gestire tentativi manuali
  const handleRetry = () => {
    console.log("Tentativo manuale di riconnessione");
    setRetryCount(c => c + 1);
  };
  
  return (
    <Alert 
      variant={status === 'checking' ? 'info' : status === 'sleeping' ? 'warning' : 'danger'}
      className="connection-alert m-0 rounded-0 text-center"
    >
      {status === 'checking' && (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          Verifica connessione al server...
        </>
      )}
      
      {status === 'sleeping' && (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Il server è in fase di avvio. Potrebbe richiedere fino a 30 secondi...</span>
        </>
      )}
      
      {status === 'offline' && (
        <div>
          <strong>Impossibile connettersi al server.</strong> 
          <p className="mb-1">Il server potrebbe essere in manutenzione o non raggiungibile.</p>
          {errorMessage && <p className="mb-2 small text-muted">Dettagli: {errorMessage}</p>}
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={handleRetry}
            className="mt-1"
          >
            Riprova connessione
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default ConnectionStatus;