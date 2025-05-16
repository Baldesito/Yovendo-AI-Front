// src/Components/Dashboard/AISettingsSection.jsx
import React, { useState, useEffect } from "react";
import { Card, Button, Form, Accordion, Alert, Row, Col } from "react-bootstrap";
import { FaRobot, FaClipboard, FaWhatsapp, FaLink, FaCog, FaSave } from "react-icons/fa";

const AISettingsSection = ({ user, testWhatsApp }) => {
  const [aiSettings, setAiSettings] = useState({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    embeddingModel: "text-embedding-ada-002",
    maxDocsPerQuery: 5,
    maxChunkSize: 1000,
    provider: "twilio",
    twilioAccountSid: "",
    twilioAuthToken: "",
    defaultWhatsappNumber: ""
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Carica le impostazioni correnti
  useEffect(() => {
    // In una implementazione reale, caricheremmo queste impostazioni dal backend
    // fetchAISettings();
    
    // Per ora, simuliamo un ritardo di caricamento
    const timer = setTimeout(() => {
      // Valori di esempio
      setAiSettings({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        embeddingModel: "text-embedding-ada-002",
        maxDocsPerQuery: 5,
        maxChunkSize: 1000,
        provider: "twilio",
        twilioAccountSid: "AC***************",
        twilioAuthToken: "***************",
        defaultWhatsappNumber: "+39 345 1234567"
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handler per aggiornare i campi delle impostazioni
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setAiSettings(prev => ({ ...prev, [name]: value }));
  };

  // Handler per salvare le impostazioni
  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // In una implementazione reale, salveremmo queste impostazioni nel backend
      // await updateAISettings(user.token, aiSettings);
      
      // Simuliamo un ritardo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Errore nel salvataggio delle impostazioni:", error);
      setSaveError("Si è verificato un errore durante il salvataggio delle impostazioni.");
    } finally {
      setSaving(false);
    }
  };

  // Handler per testare la connessione WhatsApp
  const handleTestWhatsApp = async () => {
    try {
      const response = await testWhatsApp(user.token);
      alert(response);
    } catch (error) {
      alert("Errore nel test della connessione WhatsApp: " + error.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Impostazioni AI</h2>
        <Button 
          variant="primary" 
          className="rounded-pill"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Salvataggio...
            </>
          ) : (
            <>
              <FaSave className="me-2" /> Salva Impostazioni
            </>
          )}
        </Button>
      </div>
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4">
          Impostazioni salvate con successo!
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="danger" className="mb-4">
          {saveError}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body className="p-3 p-md-4">
          <h5 className="mb-4">
            <FaCog className="me-2" />
            Configurazione Intelligenza Artificiale
          </h5>
          
          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FaRobot className="me-2" /> Modello AI
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Modello di AI da utilizzare</Form.Label>
                  <Form.Select
                    name="model"
                    value={aiSettings.model}
                    onChange={handleSettingChange}
                  >
                    <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                    <option value="gpt-4">OpenAI GPT-4</option>
                    <option value="gemini-pro">Google Gemini Pro</option>
                    <option value="claude-3-opus">Anthropic Claude 3 Opus</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Il modello scelto influisce sulla qualità delle risposte e sui costi
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Temperatura di risposta: {aiSettings.temperature}</Form.Label>
                  <Form.Range 
                    min="0" 
                    max="10" 
                    step="1" 
                    name="temperature"
                    value={aiSettings.temperature * 10}
                    onChange={e => setAiSettings(prev => ({ 
                      ...prev, 
                      temperature: parseFloat(e.target.value) / 10 
                    }))}
                  />
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Preciso (0.0)</span>
                    <span className="text-muted small">Bilanciato (0.7)</span>
                    <span className="text-muted small">Creativo (1.0)</span>
                  </div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FaClipboard className="me-2" /> Sistema RAG
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Modello di embedding</Form.Label>
                  <Form.Select
                    name="embeddingModel"
                    value={aiSettings.embeddingModel}
                    onChange={handleSettingChange}
                  >
                    <option value="text-embedding-ada-002">OpenAI Ada 002</option>
                    <option value="text-embedding-3-small">OpenAI Embedding 3 Small</option>
                    <option value="text-embedding-3-large">OpenAI Embedding 3 Large</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Numero massimo di documenti per query</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1" 
                    max="10" 
                    name="maxDocsPerQuery"
                    value={aiSettings.maxDocsPerQuery}
                    onChange={handleSettingChange}
                  />
                  <Form.Text className="text-muted">
                    Quanti documenti rilevanti includere nel contesto per ogni query
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Dimensione massima chunk</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="100" 
                    max="8000" 
                    step="100" 
                    name="maxChunkSize"
                    value={aiSettings.maxChunkSize}
                    onChange={handleSettingChange}
                  />
                  <Form.Text className="text-muted">
                    Dimensione massima in caratteri per ogni chunk di documento
                  </Form.Text>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <FaWhatsapp className="me-2" /> Configurazione WhatsApp
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Provider WhatsApp</Form.Label>
                  <Form.Select
                    name="provider"
                    value={aiSettings.provider}
                    onChange={handleSettingChange}
                  >
                    <option value="twilio">Twilio</option>
                    <option value="360dialog">360Dialog</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Twilio Account SID</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="twilioAccountSid"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                    value={aiSettings.twilioAccountSid}
                    onChange={handleSettingChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                 
                  <Form.Label>Twilio Auth Token</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="twilioAuthToken"
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                    value={aiSettings.twilioAuthToken}
                    onChange={handleSettingChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Numero WhatsApp Predefinito</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="defaultWhatsappNumber"
                    placeholder="+39 123 4567890" 
                    value={aiSettings.defaultWhatsappNumber}
                    onChange={handleSettingChange}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  className="rounded-pill"
                  onClick={handleTestWhatsApp}
                >
                  <FaLink className="me-2" /> Test Connessione WhatsApp
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <Row className="mt-4">
            <Col>
              <h5 className="mb-3">Prompts Predefiniti</h5>
              <Form.Group className="mb-3">
                <Form.Label>Prompt di Benvenuto</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="welcomePrompt"
                  placeholder="Inserisci il messaggio di benvenuto che verrà inviato all'inizio di ogni conversazione"
                  value={aiSettings.welcomePrompt || "👋 Benvenuto! Sono l'assistente virtuale di Yovendo. Come posso aiutarti oggi?"}
                  onChange={handleSettingChange}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              className="rounded-pill"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Salvataggio in corso...
                </>
              ) : (
                <>
                  <FaSave className="me-2" /> Salva Impostazioni
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Note sull'Utilizzo</h5>
        </Card.Header>
        <Card.Body>
          <h6>Gestione delle API</h6>
          <p>
            Per utilizzare i modelli di intelligenza artificiale, è necessario configurare correttamente le API key.
            Assicurati di non condividere queste chiavi con persone non autorizzate.
          </p>
          
          <h6>Best Practices per RAG</h6>
          <ul>
            <li>Utilizza documenti di qualità per migliorare le risposte</li>
            <li>Dividi documenti lunghi in chunk più piccoli per una migliore ricerca</li>
            <li>Usa temperature più basse (0.2-0.4) per risposte più fattuali</li>
            <li>Aumenta la temperature (0.7-0.9) per risposte più creative</li>
          </ul>
          
          <h6>Integrazione WhatsApp</h6>
          <p>
            Per l'integrazione con WhatsApp Business API, è necessario avere un account Twilio o 360Dialog attivo.
            Il numero WhatsApp deve essere verificato e approvato per l'utilizzo con l'API.
          </p>
        </Card.Body>
      </Card>
    </>
  );
};

export default AISettingsSection;