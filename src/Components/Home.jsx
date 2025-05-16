
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import FormAccedi from "./FormAccedi";
import Dashboard from "./Dashboard";
import { FaRobot, FaWhatsapp, FaChartLine } from "react-icons/fa";

function Home({ user, onLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuliamo un breve caricamento per mostrare lo spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se l'utente è autenticato, mostra la dashboard
  if (user) {
    return <Dashboard user={user} />;
  }

  // Altrimenti, mostra la pagina pubblica
  return (
    <div className="homepage public-home">
      <Container>
        <Row className="justify-content-center py-5">
          <Col md={8} className="text-center">
            <div className="hero-section py-5">
              <h1 className="display-4 mb-4">Benvenuto in Yovendo.ai</h1>
              <p className="lead mb-4">
                La piattaforma di intelligenza artificiale per migliorare le tue performance di vendita
              </p>
              <p className="mb-4">Accedi o registrati per iniziare a utilizzare il sistema</p>
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-pill px-4 py-2"
                onClick={() => setShowLoginModal(true)}
              >
                Inizia ora
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Sezione informativa */}
        <Row className="py-5">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="text-center">
              <div className="feature-icon mb-3">
                <FaRobot size={50} className="text-primary" />
              </div>
              <h3>Assistente AI</h3>
              <p>
                Utilizza l'intelligenza artificiale per migliorare le tue conversazioni con i clienti
                e aumentare le tue vendite.
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <div className="text-center">
              <div className="feature-icon mb-3">
                <FaWhatsapp size={50} className="text-primary" />
              </div>
              <h3>Integrazione WhatsApp</h3>
              <p>
                Rispondi alle domande dei tuoi clienti direttamente su WhatsApp con l'aiuto
                del nostro sistema di intelligenza artificiale.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <div className="feature-icon mb-3">
                <FaChartLine size={50} className="text-primary" />
              </div>
              <h3>Analisi Dettagliate</h3>
              <p>
                Monitora le tue performance di vendita e ottieni suggerimenti personalizzati
                per migliorare le tue capacità.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Modal di Login/Registrazione */}
      <FormAccedi 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        onLogin={onLogin}
      />
    </div>
  );
}

export default Home;
