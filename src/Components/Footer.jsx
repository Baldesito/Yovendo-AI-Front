import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";


function Footer() {
  // Ottiene l'anno corrente dinamicamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ft text-light py-5 mt-auto glass-card" style={{ borderRadius: "24px 24px 0 0", borderBottom: "none" }}>
      <Container className="footer-container">
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 mb-4">
          <Col className="footer-links mb-3">
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Privacy</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Contattaci</a></p>
          </Col>
          <Col className="footer-links mb-3">
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Relazioni con gli investitori</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Note legali</a></p>
          </Col>
          <Col className="footer-links mb-3">
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Centro assistenza</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Lavora con noi</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Preferenze cookie</a></p>
          </Col>
          <Col className="footer-links mb-3">
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Carte regalo</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Termini di utilizzo</a></p>
            <p><a href="#" className="text-light opacity-75 text-decoration-none hover-primary">Informazioni aziendali</a></p>
          </Col>
        </Row>
        <hr className="bg-light opacity-25" />
        <Row className="align-items-center mt-3">
          <Col md={6} className="mb-2 mb-md-0 text-md-start text-center">
            <Button
              variant="outline-light"
              size="sm"
              className="rounded-pill px-4"
              href="https://7vzefn.mimo.run/index.html"
              target="_blank"
            >
              Codice Servizio
            </Button>
          </Col>
          <Col md={6} className="text-md-end text-center opacity-50">
            <small>© {currentYear} Yovendo. Tutti i diritti riservati.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;