import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import { enhancedFetch } from "./Dashboard/API1";


const FormAccedi = ({ show, onHide, onLogin }) => { 
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState(""); 
  const [organizzazioni, setOrganizzazioni] = useState([]);
  const [organizzazioneId, setOrganizzazioneId] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('online');

  const navigate = useNavigate(); 

  // Verifica lo stato del server all'apertura del modale
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        setServerStatus('connecting');
        await enhancedFetch('/health');
        setServerStatus('online');
      } catch (error) {
        console.error("Problema nella connessione al server:", error);
        setServerStatus('offline');
      }
    };

    if (show) {
      checkServerStatus();
    }
  }, [show]);

  // Carica le organizzazioni per il form di registrazione
  useEffect(() => {
    const fetchOrganizzazioni = async () => {
      if (!show || isLogin) return; // Carica solo se stiamo registrando
      
      try {
        setIsLoading(true);
        const data = await enhancedFetch('/organizzazioni');
        setOrganizzazioni(data);
      } catch (error) {
        console.error("Errore nel caricamento delle organizzazioni:", error);
        setMessage({ 
          type: "warning", 
          text: "Non è stato possibile caricare le organizzazioni. Riprova più tardi."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizzazioni();
  }, [show, isLogin]);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setNome("");
    setCognome(""); 
    setOrganizzazioneId(""); 
    setMessage(null);
  };

  // IL METODO DI SUBMIT REALE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? '/auth/login' : '/auth/register';  

    const payload = isLogin
      ? { email, password }
      : { 
          username, 
          email, 
          password,
          nome, 
          cognome, 
          organizzazioneId: organizzazioneId ? Number(organizzazioneId) : null  
        };

    try {
      setIsLoading(true);
      setMessage(null);
      
      const data = await enhancedFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (isLogin) {
        // LOGIN SUCCESSO
        localStorage.setItem("user", JSON.stringify(data));
        setMessage({ type: "success", text: "Login effettuato con successo!" });

        // TRANSIZIONE FLUIDA
        setTimeout(() => {
          setMessage(null);
          onHide(); // Chiude il modale
          
          if (onLogin) {
            onLogin(data); // Avvisa App.jsx per aggiornare l'interfaccia (Navbar, ecc.)
          }
          
          // Naviga istantaneamente alla dashboard senza ricaricare la pagina
          navigate('/dashboard'); 
        }, 1000);
      } else {
        // REGISTRAZIONE SUCCESSO
        setMessage({ type: "success", text: "Registrazione completata! Ora puoi accedere." });
        
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Si è verificato un errore durante l'operazione.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "Il server sta impiegando troppo tempo a rispondere.";
      } else if (error.message.includes("fetch")) {
        errorMessage = "Impossibile connettersi al server.";
      } else {
        errorMessage = error.message;
      }
      
      setMessage({ type: "danger", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const renderServerStatus = () => {
    if (serverStatus === 'online') return null;
    
    return (
      <Alert variant={serverStatus === 'connecting' ? 'warning' : 'danger'} className="glass-alert border-0 text-white" style={{background: serverStatus === 'connecting' ? 'rgba(246, 224, 94, 0.2)' : 'rgba(252, 129, 129, 0.2)'}}>
        {serverStatus === 'connecting' ? (
          <><Spinner animation="border" size="sm" className="me-2" /> Connessione in corso...</>
        ) : (
          <>Server offline. Riprova più tardi.</>
        )}
      </Alert>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal border-0">
      <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-3 text-white">
          {isLogin ? "Bentornato" : "Crea un Account"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 pb-4 pt-2">
        {renderServerStatus()}
        {message && (
          <Alert variant={message.type} className="border-0 text-white" style={{background: message.type === 'success' ? 'rgba(104, 211, 145, 0.2)' : 'rgba(252, 129, 129, 0.2)'}}>
            {message.text}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Control className="glass-input text-white placeholder-light" type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} disabled={isLoading} />
              </div>
              <div className="col-md-6 mb-3">
                <Form.Control className="glass-input text-white placeholder-light" type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} disabled={isLoading} />
              </div>
              <div className="col-12 mb-3">
                <Form.Control className="glass-input text-white placeholder-light" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} disabled={isLoading} />
              </div>
              
              {organizzazioni.length > 0 && (
                <div className="col-12 mb-3">
                  <Form.Select 
                    className="glass-input text-white placeholder-light" 
                    value={organizzazioneId} 
                    onChange={(e) => setOrganizzazioneId(e.target.value)} 
                    disabled={isLoading}
                  >
                    <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>Seleziona organizzazione (Opzionale)</option>
                    {organizzazioni.map((org) => (
                      <option key={org.id} value={org.id} style={{ backgroundColor: '#1e293b', color: 'white' }}>
                        {org.nome}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              )}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Control className="glass-input text-white placeholder-light py-2" type="email" placeholder="Indirizzo E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control className="glass-input text-white placeholder-light py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} />
          </Form.Group>

          <Button className="btn-cta w-100 rounded-pill py-2 fw-bold text-white" type="submit" disabled={isLoading || serverStatus === 'offline'}>
            {isLoading ? <Spinner animation="border" size="sm" /> : (isLogin ? "Accedi" : "Registrati")}
          </Button>

          <div className="text-center mt-4 text-light opacity-75">
            {isLogin ? (
              <p className="mb-0">Nuovo su Yovendo? <a href="#" className="text-primary-light fw-bold text-decoration-none hover-primary" onClick={(e) => { e.preventDefault(); resetForm(); setIsLogin(false); }}>Registrati ora</a></p>
            ) : (
              <p className="mb-0">Hai già un account? <a href="#" className="text-primary-light fw-bold text-decoration-none hover-primary" onClick={(e) => { e.preventDefault(); resetForm(); setIsLogin(true); }}>Accedi</a></p>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormAccedi;