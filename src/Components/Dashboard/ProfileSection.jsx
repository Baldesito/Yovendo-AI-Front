import React, { useState, useEffect } from "react";
import { Card, Button, Form, Alert, Row, Col, Badge } from "react-bootstrap";
import { FaUser, FaEdit, FaSave, FaKey } from "react-icons/fa";


const ProfileSection = ({ user, setUser }) => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    nome: "",
    cognome: "",
    password: "",
    confirmPassword: ""
  });
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Carica i dati del profilo
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        nome: user.nome || "",
        cognome: user.cognome || "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  // Handler per aggiornare i campi del profilo
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handler per aggiornare il profilo
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileData.username || !profileData.email) {
      setUpdateError("Username e email sono obbligatori");
      return;
    }
    
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setUpdateError("Le password non corrispondono");
      return;
    }
    
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      // In una implementazione reale, aggiorneremmo il profilo nel backend
      // await updateUserProfile(user.token, profileData);
      
      // Simuliamo un ritardo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUpdateSuccess(true);
      
      // Aggiorna i dati dell'utente nel localStorage
      const updatedUser = { 
        ...user, 
        username: profileData.username, 
        email: profileData.email,
        nome: profileData.nome,
        cognome: profileData.cognome
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Reset del campo password
      setProfileData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Errore nell'aggiornamento del profilo:", error);
      setUpdateError("Si è verificato un errore durante l'aggiornamento del profilo");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0 fw-bold">Il tuo Profilo</h2>
      </div>
      
      {updateSuccess && (
        <Alert variant="success" className="mb-4 glass-card border-0 text-white" style={{background: 'rgba(104, 211, 145, 0.2)'}}>
          Profilo aggiornato con successo!
        </Alert>
      )}
      
      {updateError && (
        <Alert variant="danger" className="mb-4 glass-card border-0 text-white" style={{background: 'rgba(252, 129, 129, 0.2)'}}>
          {updateError}
        </Alert>
      )}
      
      <Card className="glass-card mb-5 border-0">
        <Card.Body className="p-4 p-md-5">
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0 border-end border-secondary border-opacity-25">
              <div 
                className="profile-avatar mx-auto mb-4 shadow" 
                style={{ 
                  width: "120px", height: "120px", 
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))", 
                  color: "white", borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px" 
                }}
              >
                {profileData.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <h4 className="fw-bold text-white">{profileData.username || "Utente"}</h4>
              <p className="text-light opacity-75">{profileData.email || "email@example.com"}</p>
              <Badge bg={user?.role === "ADMIN" ? "danger" : "primary"} className="px-3 py-2 rounded-pill shadow-sm mb-3">
                {user?.role || "USER"}
              </Badge>
              
              <div className="mt-3 text-start bg-dark bg-opacity-25 p-3 rounded-3">
                <p className="mb-2 text-light">
                  <strong className="opacity-50 me-2 text-uppercase small">Ultimo accesso:</strong><br/>
                  {new Date().toLocaleDateString()}
                </p>
                <p className="mb-1 text-light">
                  <strong className="opacity-50 me-2 text-uppercase small">Organizzazione:</strong><br/>
                  {user?.nomeOrganizzazione || "Nessuna"}
                </p>
              </div>
            </Col>
            
            <Col md={8} className="ps-md-5">
              <h5 className="mb-4 text-primary fw-bold">
                <FaEdit className="me-2" /> Informazioni Personali
              </h5>
              <Form onSubmit={handleUpdateProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-uppercase text-white tracking-wide">Username</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="username" 
                        value={profileData.username} 
                        onChange={handleProfileChange} 
                        className="glass-input text-white" 
                        placeholder="Username"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-uppercase text-white tracking-wide">Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email" 
                        value={profileData.email} 
                        onChange={handleProfileChange} 
                        className="glass-input text-white" 
                        placeholder="Email"
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-white text-uppercase tracking-wide">Nome</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="nome" 
                        value={profileData.nome} 
                        onChange={handleProfileChange} 
                        className="glass-input text-white placeholder-light" 
                        placeholder="Nome"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="opacity-75 small text-white text-uppercase tracking-wide">Cognome</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="cognome" 
                        value={profileData.cognome} 
                        onChange={handleProfileChange} 
                        className="glass-input text-white placeholder-light" 
                        placeholder="Cognome"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h5 className="mt-4 mb-4 text-primary fw-bold">
                  <FaKey className="me-2" /> Cambio Password
                </h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="opacity-75 small text-white text-uppercase tracking-wide">Nuova Password</Form.Label>
                      <Form.Control 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={profileData.password}
                        onChange={handleProfileChange}
                        className="glass-input text-white placeholder-light"
                        placeholder="Lascia vuoto per non cambiare"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="opacity-75 small text-white text-uppercase tracking-wide">Conferma Password</Form.Label>
                      <Form.Control 
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileChange}
                        className="glass-input text-white placeholder-light"
                        placeholder="Conferma la nuova password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label="Mostra password" 
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="text-light opacity-75"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-end mt-4 pt-4 border-top border-secondary border-opacity-25">
                  <Button variant="primary" type="submit" className="btn-cta rounded-pill px-5 py-2 fw-bold" disabled={updating}>
                    {updating ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Aggiornamento...</>
                    ) : (
                      <><FaSave className="me-2" /> Salva Modifiche</>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="glass-card border-0 mb-5">
        <Card.Header className="border-0 bg-transparent pt-4 pb-0 px-4 px-md-5">
          <h5 className="mb-0 text-primary fw-bold">Impostazioni Account</h5>
        </Card.Header>
        <Card.Body className="p-4 p-md-5">
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <h6 className="text-white fw-bold mb-3">Preferenze di Notifica</h6>
              <div className="bg-dark bg-opacity-25 p-4 rounded-4">
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    label="Notifiche email per nuove conversazioni" 
                    defaultChecked
                    className="text-light"
                  />
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Check 
                    type="checkbox" 
                    label="Notifiche email per documenti elaborati" 
                    defaultChecked
                    className="text-light"
                  />
                </Form.Group>
              </div>
            </Col>
            <Col md={6}>
              <h6 className="text-white fw-bold mb-3">Sicurezza</h6>
              <div className="bg-dark bg-opacity-25 p-4 rounded-4 h-100 d-flex flex-column justify-content-center">
                <Form.Group className="mb-4">
                  <Form.Check 
                    type="switch"
                    id="2fa-switch"
                    label="Abilita autenticazione a due fattori (2FA)" 
                    className="text-light"
                  />
                </Form.Group>
                <Button variant="outline-light" className="rounded-pill align-self-start opacity-75 hover-primary">
                  Gestisci dispositivi connessi
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileSection;