
import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Badge, Table, Row, Col } from "react-bootstrap";
import { FaSearch, FaWhatsapp, FaLink, FaTimes, FaSync } from "react-icons/fa";
import { fetchMessages } from "./API1";

const ConversationsSection = ({ 
  user, 
  conversations, 
  testWhatsApp, 
  sendTestMessage, 
  closeConversation, 
  reopenConversation, 
  refreshData 
}) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const [newConversationPhone, setNewConversationPhone] = useState("");
  const [newConversationMessage, setNewConversationMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Effetto per caricare i messaggi della conversazione selezionata
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // Funzione per caricare i messaggi
  const loadMessages = async (conversationId) => {
    setLoadingMessages(true);
    
    try {
      const messagesData = await fetchMessages(user.token, conversationId);
      setMessages(messagesData);
    } catch (error) {
      console.error(`Errore nel caricamento dei messaggi per la conversazione ${conversationId}:`, error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handler per selezionare una conversazione
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Handler per inviare un nuovo messaggio a una conversazione esistente
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      // Implementare la chiamata API per inviare un messaggio
      alert("Funzionalità da implementare con l'API di invio messaggi");
      setNewMessage("");
    } catch (error) {
      console.error("Errore nell'invio del messaggio:", error);
    }
  };

  // Handler per testare la connessione WhatsApp
const handleTestConnection = async () => {
  try {
    console.log("Tentativo di test della connessione WhatsApp...");
    const response = await testWhatsApp(user.token);
    console.log("Risposta dal server:", response);
    alert("Test connessione completato: " + response);
  } catch (error) {
    console.error("Errore nel test della connessione WhatsApp:", error);
    alert("Errore nel test della connessione WhatsApp: " + (error.message || "Errore server"));
  }
};

  // Handler per inviare un messaggio di test tramite WhatsApp
  const handleTestMessage = async () => {
    if (!newConversationPhone.trim() || !newConversationMessage.trim()) {
      alert("Inserisci sia il numero di telefono che il messaggio");
      return;
    }
    
    try {
      await sendTestMessage(user.token, newConversationPhone, newConversationMessage);
      setShowNewConversationForm(false);
      setNewConversationPhone("");
      setNewConversationMessage("");
      // Aggiorna le conversazioni dopo l'invio
      refreshData("conversations");
    } catch (error) {
      console.error("Errore nell'invio del messaggio di test:", error);
      alert("Errore nell'invio del messaggio di test");
    }
  };

  // Handler per chiudere una conversazione
  const handleCloseConversation = async (id) => {
    try {
      await closeConversation(user.token, id);
      refreshData("conversations");
      
      if (selectedConversation && selectedConversation.id === id) {
        // Aggiorna lo stato selezionato se è la conversazione corrente
        setSelectedConversation(prev => ({ ...prev, stato: "chiusa" }));
      }
    } catch (error) {
      console.error("Errore nella chiusura della conversazione:", error);
      alert("Errore nella chiusura della conversazione");
    }
  };

  // Handler per riaprire una conversazione
  const handleReopenConversation = async (id) => {
    try {
      await reopenConversation(user.token, id);
      refreshData("conversations");
      
      if (selectedConversation && selectedConversation.id === id) {
        // Aggiorna lo stato selezionato se è la conversazione corrente
        setSelectedConversation(prev => ({ ...prev, stato: "attiva" }));
      }
    } catch (error) {
      console.error("Errore nella riapertura della conversazione:", error);
      alert("Errore nella riapertura della conversazione");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Conversazioni WhatsApp</h2>
        <div>
          <Button 
            variant="outline-primary" 
            className="rounded-pill me-2" 
            onClick={handleTestConnection}
          >
            <FaLink className="me-2" /> Test Connessione
          </Button>
          <Button 
            variant="primary" 
            className="rounded-pill" 
            onClick={() => setShowNewConversationForm(!showNewConversationForm)}
          >
            <FaWhatsapp className="me-2" /> Nuovo Messaggio
          </Button>
        </div>
      </div>
      
      {/* Form per nuovo messaggio di test */}
      {showNewConversationForm && (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Invia Messaggio WhatsApp di Test</h5>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Numero di Telefono</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Formato: +39 123 4567890" 
                  value={newConversationPhone}
                  onChange={(e) => setNewConversationPhone(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Inserisci il numero completo con prefisso internazionale
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Messaggio</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Digita il messaggio da inviare..." 
                  value={newConversationMessage}
                  onChange={(e) => setNewConversationMessage(e.target.value)}
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2 rounded-pill" 
                  onClick={() => setShowNewConversationForm(false)}
                >
                  Annulla
                </Button>
                <Button 
                  variant="primary" 
                  className="rounded-pill" 
                  onClick={handleTestMessage}
                >
                  Invia Messaggio
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="mb-4">
        <Card.Body className="p-3 p-md-4">
          <div className="mb-4">
            <InputGroup>
              <Form.Control 
                placeholder="Cerca conversazioni..." 
                aria-label="Cerca conversazioni"
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>
          
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Stato</th>
                  <th>Data Inizio</th>
                  <th>Messaggi</th>
                  <th>Ultimo Messaggio</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <tr 
                      key={conv.id} 
                      className={selectedConversation?.id === conv.id ? "table-active" : ""}
                      onClick={() => handleSelectConversation(conv)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>#{conv.id}</td>
                      <td>{conv.telefonoCliente}</td>
                      <td>
                        <Badge bg={conv.stato === "attiva" ? "success" : "secondary"}>
                          {conv.stato === "attiva" ? "Attiva" : "Chiusa"}
                        </Badge>
                      </td>
                      <td>{new Date(conv.orarioInizio).toLocaleString()}</td>
                      <td>{conv.numeroMessaggi}</td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {conv.ultimoMessaggioTesto}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectConversation(conv);
                          }}
                        >
                          <FaSearch /> Dettagli
                        </Button>
                        {conv.stato === "attiva" ? (
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseConversation(conv.id);
                            }}
                          >
                            <FaTimes /> Chiudi
                          </Button>
                        ) : (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReopenConversation(conv.id);
                            }}
                          >
                            <FaSync /> Riapri
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <FaWhatsapp size={40} className="text-muted mb-3" />
                      <p>Non ci sono conversazioni disponibili.</p>
                      <Button 
                        variant="primary" 
                        className="rounded-pill"
                        onClick={() => setShowNewConversationForm(true)}
                      >
                        <FaWhatsapp className="me-2" /> Nuovo Messaggio
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Dettaglio conversazione selezionata */}
      {selectedConversation && (
        <Card>
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Conversazione con: {selectedConversation.telefonoCliente}</h5>
            <Badge bg={selectedConversation.stato === "attiva" ? "success" : "secondary"}>
              {selectedConversation.stato === "attiva" ? "Attiva" : "Chiusa"}
            </Badge>
          </Card.Header>
          <Card.Body className="p-0">
            {loadingMessages ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Caricamento messaggi...</span>
                </div>
                <p className="mt-3">Caricamento messaggi...</p>
              </div>
            ) : (
              <div className="chat-container p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`chat-message ${msg.daCliente ? 'client' : 'system'} mb-3`}
                    >
                      <div 
                        className={`message-bubble p-3 rounded ${msg.daCliente ? 'bg-black text-white' : 'bg-primary text-white'}`}
                        style={{ 
                          maxWidth: "80%", 
                          marginLeft: msg.daCliente ? "0" : "auto",
                          marginRight: msg.daCliente ? "auto" : "0"
                        }}
                      >
                        {msg.contenuto}
                        <div className="message-time small mt-1 text-end">
                          {new Date(msg.orarioInvio).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">Nessun messaggio disponibile per questa conversazione.</p>
                  </div>
                )}
              </div>
            )}
            <div className="chat-input p-3 border-top">
              <InputGroup>
                <Form.Control
                  placeholder="Scrivi un messaggio..."
                  aria-label="Scrivi un messaggio"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={selectedConversation.stato !== "attiva"}
                />
                <Button 
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={selectedConversation.stato !== "attiva" || !newMessage.trim()}
                >
                  Invia
                </Button>
              </InputGroup>
              <small className="text-muted mt-1 d-block">
                I messaggi saranno elaborati dall'IA e inviati al cliente tramite WhatsApp
              </small>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ConversationsSection;