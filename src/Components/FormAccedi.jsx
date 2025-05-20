import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { enhancedFetch } from "./API"; // Importa enhancedFetch dal file API aggiornato

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
  const [serverStatus, setServerStatus] = useState('online'); // 'online', 'connecting', 'offline'

  // Verifica lo stato del server 
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

  // Carica le organizzazioni al montaggio del componente
  useEffect(() => {
    const fetchOrganizzazioni = async () => {
      if (!show) return;
      
      try {
        setIsLoading(true);
        const data = await enhancedFetch('/organizzazioni');
        setOrganizzazioni(data);
      } catch (error) {
        console.error("Errore nel caricamento delle organizzazioni:", error);
        setMessage({ 
          type: "warning", 
          text: "Non è stato possibile caricare le organizzazioni. " + 
                (error.message || "Verifica la tua connessione internet.")
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizzazioni();
  }, [show]);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setNome("");
    setCognome(""); 
    setOrganizzazioneId(""); 
    setMessage(null);
  };

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
          organizzazioneId: organizzazioneId || null  
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
        // In caso di login, salva i dati utente e token
        localStorage.setItem("user", JSON.stringify(data));
        setMessage({ 
          type: "success", 
          text: "Login effettuato con successo!"
        });

        setTimeout(() => {
          setMessage(null);
          onHide();
          onLogin(data);
        }, 1000);
      } else {
        // In caso di registrazione, mostra messaggio di successo
        setMessage({ 
          type: "success", 
          text: "Registrazione completata! Ora puoi accedere con le tue credenziali."
        });
        
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      // Gestione degli errori più descrittiva
      let errorMessage = "Si è verificato un errore durante l'operazione.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "Il server sta impiegando troppo tempo a rispondere. Potrebbe essere in fase di avvio o sovraccarico.";
      } else if (error.message.includes("fetch")) {
        errorMessage = "Impossibile connettersi al server. Verifica la tua connessione internet.";
      } else {
        errorMessage = error.message;
      }
      
      setMessage({ type: "danger", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Rendering condizionale per lo stato del server
  const renderServerStatus = () => {
    if (serverStatus === 'online') return null;
    
    return (
      <Alert variant={serverStatus === 'connecting' ? 'warning' : 'danger'}>
        {serverStatus === 'connecting' ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Connessione al server in corso...
          </>
        ) : (
          <>
            Impossibile connettersi al server. Riprova più tardi o verifica la tua connessione internet.
          </>
        )}
      </Alert>
    );
  };

  return (
    <Modal show={show} onHide={onHide} className="modal-form">
      <Modal.Header closeButton className="header-accedi bg-black">
        {" "}
        <Modal.Title className="w-100 text-center ">
          {isLogin ? "Accedi" : "Registrati"}
        </Modal.Title>
      </Modal.Header>{" "}
      <Modal.Body className="modal-body bg-black ">
        {" "}
        {renderServerStatus()}
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Form.Group className="mb-3 ">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={50}
                  disabled={isLoading}
                />
              </Form.Group>

              {/* Campi aggiuntivi per la registrazione */}
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={50}
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci cognome"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  maxLength={50}
                  disabled={isLoading}
                />
              </Form.Group>

              {/* Select per l'organizzazione */}
              {organizzazioni.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Organizzazione</Form.Label>
                  <Form.Select
                    value={organizzazioneId}
                    onChange={(e) => setOrganizzazioneId(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Seleziona un'organizzazione</option>
                    {organizzazioni.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={50}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Inserisci password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={100}
              disabled={isLoading}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              className="btn accedi-form rounded-pill" 
              type="submit"
              disabled={isLoading || serverStatus !== 'online'}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isLogin ? "Accesso in corso..." : "Registrazione in corso..."}
                </>
              ) : (
                isLogin ? "Accedi" : "Registrati"
              )}
            </Button>
          </div>

          <div className="text-center mt-3">
            {isLogin ? (
              <span>
                Non hai un account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    resetForm();
                    setIsLogin(false);
                  }}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                >
                  Registrati ora
                </a>
              </span>
            ) : (
              <span>
                Hai già un account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    resetForm();
                    setIsLogin(true);
                  }}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                >
                  Accedi ora
                </a>
              </span>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormAccedi;