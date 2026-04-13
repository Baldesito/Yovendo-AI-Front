import React, { useState, useEffect } from "react";

import { Card, Button, Form, Accordion, Alert, Row, Col, Badge } from "react-bootstrap";
import { FaRobot, FaClipboard, FaWhatsapp, FaLink, FaCog, FaSave } from "react-icons/fa";

const AISettingsSection = ({ user, testWhatsApp }) => {
  const [aiSettings, setAiSettings] = useState({
    model: "gpt-3.5-turbo", temperature: 0.7, embeddingModel: "text-embedding-ada-002",
    maxDocsPerQuery: 5, maxChunkSize: 1000, provider: "twilio", twilioAccountSid: "",
    twilioAuthToken: "", defaultWhatsappNumber: ""
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAiSettings({
        model: "gpt-3.5-turbo", temperature: 0.7, embeddingModel: "text-embedding-ada-002",
        maxDocsPerQuery: 5, maxChunkSize: 1000, provider: "twilio", 
        twilioAccountSid: "AC***************", twilioAuthToken: "***************", defaultWhatsappNumber: "+39 345 1234567"
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = (e) => { setAiSettings(prev => ({ ...prev, [e.target.name]: e.target.value })); };

  const handleSaveSettings = async () => {
    setSaving(true); setSaveSuccess(false); setSaveError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } //eslint-disable-next-line
    catch  (error) {
      setSaveError("Errore salvataggio impostazioni.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    try {
      const response = await testWhatsApp(user.token);
      alert(response);
    } catch (error) {
      alert("Errore test WhatsApp: " + error.message);
    }
  };

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0 fw-bold">Impostazioni AI</h2>
        <Button className="btn-cta rounded-pill px-4 fw-bold d-flex align-items-center" onClick={handleSaveSettings} disabled={saving}>
          {saving ? <><span className="spinner-border spinner-border-sm me-2"></span> Salvataggio...</> : <><FaSave className="me-2" /> Salva Tutto</>}
        </Button>
      </div>
      
      {saveSuccess && <Alert variant="success" className="glass-card border-0 text-white" style={{background:'rgba(104,211,145,0.2)'}}>Impostazioni salvate!</Alert>}
      {saveError && <Alert variant="danger" className="glass-card border-0 text-white" style={{background:'rgba(252,129,129,0.2)'}}>{saveError}</Alert>}
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4 p-md-5">
          <h5 className="mb-4 text-primary fw-bold d-flex align-items-center"><FaCog className="me-2 fs-4" /> Configurazione AI Base</h5>
          
          <Accordion defaultActiveKey="0" className="mb-5 custom-accordion">
            
            <Accordion.Item eventKey="0" className="mb-3 rounded-3 overflow-hidden">
              <Accordion.Header><FaRobot className="me-2 text-primary" /> Modello Generativo (LLM)</Accordion.Header>
              <Accordion.Body className="p-4">
                <Form.Group className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Provider & Modello</Form.Label>
                  <Form.Select name="model" className="glass-input text-white" value={aiSettings.model} onChange={handleSettingChange}>
                    <option value="gpt-3.5-turbo" style={{color:'black'}}>OpenAI GPT-3.5 Turbo (Veloce/Economico)</option>
                    <option value="gpt-4" style={{color:'black'}}>OpenAI GPT-4 (Complesso/Lento)</option>
                    <option value="gemini-pro" style={{color:'black'}}>Google Gemini Pro</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <Form.Label className="opacity-75 small text-uppercase m-0">Temperatura / Creatività</Form.Label>
                    <Badge bg="primary" className="rounded-pill px-3">{aiSettings.temperature}</Badge>
                  </div>
                  <Form.Range min="0" max="10" step="1" className="custom-range" value={aiSettings.temperature * 10} onChange={e => setAiSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) / 10 }))} />
                  <div className="d-flex justify-content-between mt-2 opacity-50 small">
                    <span>Robotica (0.0)</span><span>Equilibrata (0.7)</span><span>Creativa (1.0)</span>
                  </div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1" className="mb-3 rounded-3 overflow-hidden">
              <Accordion.Header><FaClipboard className="me-2 text-warning" /> Sistema RAG (Lettura Documenti)</Accordion.Header>
              <Accordion.Body className="p-4">
                <Row>
                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label className="opacity-75 small text-uppercase">Modello Embeddings</Form.Label>
                      <Form.Select name="embeddingModel" className="glass-input text-white" value={aiSettings.embeddingModel} onChange={handleSettingChange}>
                        <option value="text-embedding-ada-002" style={{color:'black'}}>OpenAI Ada-002</option>
                        <option value="text-embedding-3-small" style={{color:'black'}}>OpenAI 3-Small</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="opacity-75 small text-uppercase">Max Doc per Query</Form.Label>
                      <Form.Control type="number" className="glass-input text-white" min="1" max="10" name="maxDocsPerQuery" value={aiSettings.maxDocsPerQuery} onChange={handleSettingChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="opacity-75 small text-uppercase">Chunk Size (Caratteri)</Form.Label>
                      <Form.Control type="number" className="glass-input text-white" min="100" max="8000" step="100" name="maxChunkSize" value={aiSettings.maxChunkSize} onChange={handleSettingChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="2" className="rounded-3 overflow-hidden">
              <Accordion.Header><FaWhatsapp className="me-2 text-success" /> API WhatsApp</Accordion.Header>
              <Accordion.Body className="p-4">
                <Row>
                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label className="opacity-75 small text-uppercase">Provider Messaging</Form.Label>
                      <Form.Select name="provider" className="glass-input text-white" value={aiSettings.provider} onChange={handleSettingChange}>
                        <option value="twilio" style={{color:'black'}}>Twilio API</option>
                        <option value="360dialog" style={{color:'black'}}>360Dialog</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-uppercase">Account SID</Form.Label>
                      <Form.Control type="text" className="glass-input text-white placeholder-light" name="twilioAccountSid" placeholder="ACxxx..." value={aiSettings.twilioAccountSid} onChange={handleSettingChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-uppercase">Auth Token</Form.Label>
                      <Form.Control type="password" className="glass-input text-white placeholder-light" name="twilioAuthToken" placeholder="Tokens segreto" value={aiSettings.twilioAuthToken} onChange={handleSettingChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex align-items-center justify-content-between border-top border-secondary border-opacity-25 pt-4 mt-2">
                  <div>
                    <Form.Label className="opacity-75 small text-uppercase mb-1">Numero Bot</Form.Label>
                    <p className="fw-bold mb-0 text-success">{aiSettings.defaultWhatsappNumber}</p>
                  </div>
                  <Button variant="outline-light" className="rounded-pill hover-primary opacity-75" onClick={handleTestWhatsApp}>
                    <FaLink className="me-2" /> Ping Twilio
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <h5 className="mb-4 mt-5 text-primary fw-bold">Prompts di Sistema</h5>
          <Form.Group className="mb-3">
            <Form.Label className="opacity-75 text-secondary small text-uppercase">Prompt di Benvenuto Iniziale</Form.Label>
            <Form.Control 
              as="textarea" rows={4} 
              className="glass-input text-white placeholder-light" 
              name="welcomePrompt"
              placeholder="Messaggio inviato al primo contatto"
              value={aiSettings.welcomePrompt || "👋 Benvenuto! Sono l'assistente virtuale. Come posso aiutarti?"}
              onChange={handleSettingChange}
            />
          </Form.Group>
        </Card.Body>
      </Card>
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4 p-md-5">
          <h5 className="fw-bold mb-4 text-white">Guida Rapida</h5>
          <Row className="g-4 opacity-75">
            <Col md={4}>
              <h6 className="text-warning">RAG (Retrieval)</h6>
              <p className="small">Il sistema RAG usa i documenti caricati per fornire risposte pertinenti. Chunk più piccoli aumentano la precisione ma riducono il contesto.</p>
            </Col>
            <Col md={4}>
              <h6 className="text-primary">Modelli LLM</h6>
              <p className="small">GPT-3.5 è perfetto per l'assistenza rapida clienti. Passa a GPT-4 solo se il bot deve analizzare lunghi contratti o ragionare profondamente.</p>
            </Col>
            <Col md={4}>
              <h6 className="text-success">WhatsApp</h6>
              <p className="small">Le API Twilio permettono di usare un sandbox per test limitati. Per produzione occorre verificare il business su Meta.</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AISettingsSection;