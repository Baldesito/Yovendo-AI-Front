import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

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

  // Carica le organizzazioni al montaggio del componente
  useEffect(() => {
    const fetchOrganizzazioni = async () => {
      try {
        const response = await fetch("/api/organizzazioni");
        if (response.ok) {
          const data = await response.json();
          setOrganizzazioni(data);
        }
      } catch (error) {
        console.error("Errore nel caricamento delle organizzazioni:", error);
      }
    };

    fetchOrganizzazioni();
  }, []);

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

    const url = isLogin
      ? "/api/auth/login" 
      : "/api/auth/register";  

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
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Errore nella richiesta");
      }

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data));
        setMessage({ type: "success", text: "Login effettuato con successo!" });

        setTimeout(() => {
          setMessage(null);
          onHide();
          onLogin(data);
        }, 1000);
      } else {
        setMessage({ type: "success", text: "Registrazione completata!" });
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 1000);
      }
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    }
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
                />
              </Form.Group>

              {/* Select per l'organizzazione */}
              {organizzazioni.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Organizzazione</Form.Label>
                  <Form.Select
                    value={organizzazioneId}
                    onChange={(e) => setOrganizzazioneId(e.target.value)}
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
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button className="btn accedi-form rounded-pill" type="submit">
              {isLogin ? "Accedi" : "Registrati"}
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