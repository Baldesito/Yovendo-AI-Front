
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
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Il tuo Profilo</h2>
      </div>
      
      {updateSuccess && (
        <Alert variant="success" className="mb-4">
          Profilo aggiornato con successo!
        </Alert>
      )}
      
      {updateError && (
        <Alert variant="danger" className="mb-4">
          {updateError}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              <div 
                className="profile-avatar mx-auto mb-3" 
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  backgroundColor: "#67A1CE", 
                  color: "white", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "60px" 
                }}
              >
                {profileData.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <h4>{profileData.username || "Utente"}</h4>
              <p className="text-muted">{profileData.email || "email@example.com"}</p>
              <Badge bg={user?.role === "ADMIN" ? "danger" : "primary"}>
                {user?.role || "USER"}
              </Badge>
              
              <div className="mt-3">
                <p className="mb-1">
                  <strong>Ultimo accesso:</strong> {new Date().toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Organizzazione:</strong> {user?.nomeOrganizzazione || "Nessuna"}
                </p>
              </div>
            </Col>
            <Col md={8}>
              <h5 className="mb-4">
                <FaEdit className="me-2" /> 
                Modifica Informazioni Personali
              </h5>
              <Form onSubmit={handleUpdateProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        placeholder="Username"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="Email"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="nome"
                        value={profileData.nome}
                        onChange={handleProfileChange}
                        placeholder="Nome"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cognome</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="cognome"
                        value={profileData.cognome}
                        onChange={handleProfileChange}
                        placeholder="Cognome"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h5 className="mt-4 mb-3">
                  <FaKey className="me-2" /> 
                  Cambio Password
                </h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuova Password</Form.Label>
                      <Form.Control 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={profileData.password}
                        onChange={handleProfileChange}
                        placeholder="Lascia vuoto per non cambiare"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Conferma Password</Form.Label>
                      <Form.Control 
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileChange}
                        placeholder="Conferma la nuova password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="checkbox" 
                    label="Mostra password" 
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </Form.Group>
                
                <Form.Text className="text-muted d-block mb-3">
                  Compila i campi password solo se desideri cambiarla. La password deve essere di almeno 6 caratteri.
                </Form.Text>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="rounded-pill"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Aggiornamento in corso...
                      </>
                    ) : (
                      <>
                        <FaSave className="me-2" /> Aggiorna Profilo
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Impostazioni Account</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Preferenze di Notifica</h6>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Notifiche email per nuove conversazioni" 
                  defaultChecked
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Notifiche email per documenti elaborati" 
                  defaultChecked
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <h6>Sicurezza</h6>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Abilita autenticazione a due fattori" 
                />
              </Form.Group>
              <Button variant="outline-secondary" size="sm" className="mt-2">
                Gestisci dispositivi connessi
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfileSection;