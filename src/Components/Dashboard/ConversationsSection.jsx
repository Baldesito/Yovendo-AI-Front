import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Badge, Table } from "react-bootstrap";
import { FaSearch, FaWhatsapp, FaLink, FaTimes, FaSync } from "react-icons/fa";
import { fetchMessages } from "./API1";


const ConversationsSection = ({ 
  user, conversations, testWhatsApp, sendTestMessage, 
  closeConversation, reopenConversation, refreshData 
}) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const [newConversationPhone, setNewConversationPhone] = useState("");
  const [newConversationMessage, setNewConversationMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }// eslint-disable-next-line
  }, [selectedConversation]);

  const loadMessages = async (conversationId) => {
    setLoadingMessages(true);
    try {
      const messagesData = await fetchMessages(user.token, conversationId);
      setMessages(messagesData);
    } catch (error) {
      console.error(`Errore caricamento messaggi conv ${conversationId}:`, error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conversation) => { setSelectedConversation(conversation); };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      alert("Funzionalità da implementare con l'API di invio messaggi");
      setNewMessage("");
    } catch (error) {
      console.error("Errore invio messaggio:", error);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await testWhatsApp(user.token);
      alert("Test connessione completato: " + response);
    } catch (error) {
      alert("Errore test connessione WhatsApp: " + (error.message || "Errore server"));
    }
  };

  const handleTestMessage = async () => {
    if (!newConversationPhone.trim() || !newConversationMessage.trim()) {
      alert("Inserisci numero di telefono e messaggio");
      return;
    }
    try {
      await sendTestMessage(user.token, newConversationPhone, newConversationMessage);
      setShowNewConversationForm(false);
      setNewConversationPhone("");
      setNewConversationMessage("");
      refreshData("conversations");
      // eslint-disable-next-line
    } catch (error) {
      alert("Errore invio messaggio test");
    }
  };

  const handleCloseConversation = async (id) => {
    try {
      await closeConversation(user.token, id);
      refreshData("conversations");
      if (selectedConversation?.id === id) {
        setSelectedConversation(prev => ({ ...prev, stato: "chiusa" }));
      }
      // eslint-disable-next-line
    } catch (error) {
      alert("Errore chiusura conversazione");
    }
  };

  const handleReopenConversation = async (id) => {
    try {
      await reopenConversation(user.token, id);
      refreshData("conversations");
      if (selectedConversation?.id === id) {
        setSelectedConversation(prev => ({ ...prev, stato: "attiva" }));
      }
  // eslint-disable-next-line
    } catch (error) {
      alert("Errore riapertura conversazione");
    }
  };

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 flex-wrap gap-3">
        <h2 className="mb-0 fw-bold">Conversazioni WhatsApp</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-light" className="rounded-pill opacity-75 hover-primary" onClick={handleTestConnection}>
            <FaLink className="me-2" /> Test Connessione
          </Button>
          <Button className="btn-cta rounded-pill px-4 fw-bold" onClick={() => setShowNewConversationForm(!showNewConversationForm)}>
            <FaWhatsapp className="me-2 fs-5" /> Nuovo
          </Button>
        </div>
      </div>
      
      {showNewConversationForm && (
        <Card className="glass-card mb-5 border-0">
          <Card.Header className="border-0 pt-4 px-4 bg-transparent"><h5 className="mb-0 fw-bold">Invia Messaggio Test</h5></Card.Header>
          <Card.Body className="p-4">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Numero Destinatario</Form.Label>
                <Form.Control type="text" className="glass-input text-white placeholder-light" placeholder="+39 123 4567890" value={newConversationPhone} onChange={(e) => setNewConversationPhone(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Messaggio</Form.Label>
                <Form.Control as="textarea" rows={3} className="glass-input text-white placeholder-light" placeholder="Digita..." value={newConversationMessage} onChange={(e) => setNewConversationMessage(e.target.value)} />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="outline-light" className="me-2 rounded-pill px-4 opacity-75" onClick={() => setShowNewConversationForm(false)}>Annulla</Button>
                <Button className="btn-cta rounded-pill px-4 fw-bold" onClick={handleTestMessage}>Invia</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4">
          <InputGroup className="mb-4">
            <Form.Control className="glass-input text-white placeholder-light" placeholder="Cerca conversazioni..." />
            <Button variant="primary" className="border-0"><FaSearch /></Button>
          </InputGroup>
          
          <div className="table-responsive">
            <Table hover className="glass-table">
              <thead><tr><th>ID</th><th>Cliente</th><th>Stato</th><th>Inizio</th><th>Msgs</th><th>Ultimo</th><th>Azioni</th></tr></thead>
              <tbody>
                {conversations.length > 0 ? conversations.map((conv) => (
                  <tr 
                    key={conv.id} 
                    onClick={() => handleSelectConversation(conv)}
                    style={{ cursor: "pointer", background: selectedConversation?.id === conv.id ? 'rgba(52, 144, 220, 0.15)' : 'transparent' }}
                  >
                    <td className="opacity-50">#{conv.id}</td>
                    <td className="fw-semibold">{conv.telefonoCliente}</td>
                    <td><Badge bg={conv.stato === "attiva" ? "success" : "secondary"} className="rounded-pill px-2">{conv.stato === "attiva" ? "Attiva" : "Chiusa"}</Badge></td>
                    <td className="opacity-75 small">{new Date(conv.orarioInizio).toLocaleString()}</td>
                    <td>{conv.numeroMessaggi}</td>
                    <td className="text-truncate opacity-75" style={{ maxWidth: "150px" }}>{conv.ultimoMessaggioTesto}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2 rounded-pill" onClick={(e) => { e.stopPropagation(); handleSelectConversation(conv); }}>
                        Dettagli
                      </Button>
                      {conv.stato === "attiva" ? (
                        <Button variant="outline-warning" size="sm" className="rounded-pill opacity-75" onClick={(e) => { e.stopPropagation(); handleCloseConversation(conv.id); }}><FaTimes/></Button>
                      ) : (
                        <Button variant="outline-success" size="sm" className="rounded-pill opacity-75" onClick={(e) => { e.stopPropagation(); handleReopenConversation(conv.id); }}><FaSync/></Button>
                      )}
                    </td>
                  </tr>
                )) : <tr><td colSpan="7" className="text-center py-5 opacity-50"><p>Nessuna conversazione.</p></td></tr>}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* SEZIONE CHAT (MESSAGGI) */}
      {selectedConversation && (
        <Card className="glass-card border-0 shadow-lg mb-5 mt-4" style={{ overflow: 'hidden' }}>
          <Card.Header className="bg-primary bg-opacity-25 border-0 d-flex justify-content-between align-items-center p-4">
            <h5 className="mb-0 fw-bold text-white d-flex align-items-center">
              <FaWhatsapp className="me-2 text-success fs-4"/> {selectedConversation.telefonoCliente}
            </h5>
            <Badge bg={selectedConversation.stato === "attiva" ? "success" : "secondary"} className="rounded-pill px-3 py-2 text-dark fw-bold">
              {selectedConversation.stato === "attiva" ? "Attiva" : "Chiusa"}
            </Badge>
          </Card.Header>
          
          <Card.Body className="p-0" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {loadingMessages ? (
              <div className="text-center py-5 opacity-50"><div className="spinner-border text-primary" role="status"></div></div>
            ) : (
              <div className="chat-container p-4" style={{ height: "400px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {messages.length > 0 ? messages.map((msg) => (
                  <div key={msg.id} className={`d-flex mb-3 ${msg.daCliente ? 'justify-content-start' : 'justify-content-end'}`}>
                    <div 
                      className={`p-3 rounded-4 shadow-sm ${msg.daCliente ? 'bg-dark text-light border' : 'text-white'}`}
                      style={{ 
                        maxWidth: "75%", 
                        border: msg.daCliente ? "1px solid rgba(255,255,255,0.1)" : "none",
                        background: msg.daCliente ? "" : "linear-gradient(135deg, var(--primary), var(--secondary))",
                        borderBottomLeftRadius: msg.daCliente ? "4px" : "1rem",
                        borderBottomRightRadius: msg.daCliente ? "1rem" : "4px"
                      }}
                    >
                      <p className="mb-1">{msg.contenuto}</p>
                      <div className={`small ${msg.daCliente ? 'opacity-50 text-end' : 'text-white-50 text-start'}`} style={{fontSize: '0.7rem'}}>
                        {new Date(msg.orarioInvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                )) : <div className="text-center py-5 opacity-50 mt-auto mb-auto"><p>Nessun messaggio in questa chat.</p></div>}
              </div>
            )}
            
            <div className="p-3 bg-dark bg-opacity-50 border-top border-secondary border-opacity-25">
              <InputGroup>
                <Form.Control className="glass-input text-white placeholder-light rounded-start-pill ps-4 py-3" placeholder="Scrivi un messaggio..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} disabled={selectedConversation.stato !== "attiva"} />
                <Button className="btn-cta rounded-end-pill px-4 fw-bold" onClick={handleSendMessage} disabled={selectedConversation.stato !== "attiva" || !newMessage.trim()}>
                  Invia
                </Button>
              </InputGroup>
              <div className="text-center mt-2"><small className="text-light opacity-50">L'IA elaborerà e invierà questo messaggio via WhatsApp</small></div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ConversationsSection;