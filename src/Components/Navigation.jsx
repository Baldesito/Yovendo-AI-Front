import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import FormAccedi from "./FormAccedi";
import ProfiloDrpDown from "./ProfiloDrpDown";

const Navigation = ({ user, onLogout }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container className="pt-3 mb-3" style={{ position: "relative", zIndex: 1050 }}>
      <Navbar expand="lg" variant="dark" className="custom-navbar glass-nav px-4">
        <Navbar.Brand href="/" className="d-flex align-items-center">
          {/* Logo Ingrandito e Spostato a Sinistra */}
          <img src="/yovendo-ai.svg" alt="Logo" className="me-3" style={{ width: "45px", height: "auto" }} />
          <span className="nome-sito fw-bold text-white fs-4">Yovendo.<span className="text-primary">AI</span></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="text-white hover-primary me-3 fw-semibold">Home</Nav.Link>

            {user ? (
              <Dropdown align="end">
                <ProfiloDrpDown user={user} onLogout={onLogout} />
              </Dropdown>
            ) : (
              <Button
                className="btn-cta rounded-pill px-4 py-2 fw-bold"
                onClick={() => setShowModal(true)}
              >
                Accedi
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <FormAccedi show={showModal} onHide={() => setShowModal(false)} />
    </Container>
  );
};

export default Navigation;