import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormAccedi from "./FormAccedi";
import { FaRobot, FaWhatsapp, FaChartLine } from "react-icons/fa";

function Home({ user, onLogin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Se siamo nella Home ma l'utente esiste (cioè ha fatto login), lo "cacciamo" subito verso la dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    if (onLogin) onLogin(userData);
    navigate('/dashboard'); // Navigazione forzata lato client
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-transparent">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Non mostrare nulla mentre avviene il redirect
  if (user) return null; 

  return (
    <div className="homepage public-home">
      <Container>
        <Row className="justify-content-center py-5 mt-4">
          <Col md={9} lg={8} className="text-center">
            <div className="hero-section glass-card py-5 px-4 mb-5">
              <h1 className="display-4 mb-4 fw-bold text-white">
                Benvenuto in <span className="text-primary-light">Yovendo.ai</span>
              </h1>
              <p className="lead mb-4 text-light">La piattaforma di intelligenza artificiale per far decollare le tue performance di vendita.</p>
              <Button variant="primary" size="lg" className="rounded-pill px-5 py-3 btn-cta fw-bold text-white" onClick={() => setShowLoginModal(true)}>
                Inizia ora
              </Button>
            </div>
          </Col>
        </Row>
        
        <Row className="py-4 mb-5 g-4">
          <Col md={4}>
            <div className="text-center glass-card feature-card h-100">
              <div className="feature-icon-wrapper mb-4"><FaRobot size={40} className="text-primary" /></div>
              <h3 className="h4 text-white mb-3">Assistente AI</h3>
              <p className="text-light opacity-75">Utilizza l'intelligenza artificiale per migliorare le tue conversazioni con i clienti.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center glass-card feature-card h-100">
              <div className="feature-icon-wrapper mb-4"><FaWhatsapp size={40} className="text-success" /></div>
              <h3 className="h4 text-white mb-3">Integrazione WhatsApp</h3>
              <p className="text-light opacity-75">Rispondi alle domande dei tuoi clienti direttamente su WhatsApp.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center glass-card feature-card h-100">
              <div className="feature-icon-wrapper mb-4"><FaChartLine size={40} className="text-warning" /></div>
              <h3 className="h4 text-white mb-3">Analisi Dettagliate</h3>
              <p className="text-light opacity-75">Monitora le tue performance di vendita e ottieni suggerimenti.</p>
            </div>
          </Col>
        </Row>
      </Container>
      
      <FormAccedi show={showLoginModal} onHide={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} />
    </div>
  );
}

export default Home;