
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import FormAccedi from "./FormAccedi";
import "../index.css";
import { Dropdown } from "react-bootstrap";
import ProfiloDrpDown from "./ProfiloDrpDown";



const Navigation = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="gradient-bg">
      <Navbar defaultExpanded expand="lg" variant="dark" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/">
            <span className="nome-sito">Yovendo-AI</span>
            <img src="/yovendo-ai.svg" alt="Logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>

              {user ? (
                <Dropdown align="end">
                  <ProfiloDrpDown user={user} onLogout={handleLogout} />
                </Dropdown>
              ) : (
                <Button
                  variant="outline-light rounded-pill"
                  onClick={() => setShowModal(true)}
                >
                  Accedi
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <FormAccedi show={showModal} onHide={() => setShowModal(false)} />
    </div>

  );
};

export default Navigation;
