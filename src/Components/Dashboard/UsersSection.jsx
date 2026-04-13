import React, { useState } from "react";
import { Card, Button, Form, InputGroup, Badge, Table, Row, Col } from "react-bootstrap";
import { FaPlus, FaSearch, FaUsers, FaTrash, FaEdit } from "react-icons/fa";


const UsersSection = ({ user, users, organizations, createUser, refreshData }) => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    nome: "",
    cognome: "",
    organizzazioneId: "",
    ruolo: "USER"
  });
  const [creatingUser, setCreatingUser] = useState(false);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUserData.username || !newUserData.email || !newUserData.password) {
      alert("Username, email e password sono obbligatori");
      return;
    }
    
    setCreatingUser(true);
    
    try {
      await createUser(user.token, newUserData);
      alert("Utente creato con successo");
      setShowNewUserForm(false);
      setNewUserData({
        username: "", email: "", password: "", nome: "", cognome: "", organizzazioneId: "", ruolo: "USER"
      });
      refreshData("users");
    } catch (error) {
      alert(`Errore nella creazione dell'utente: ${error.message}`);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.")) {
      try {
        // await deleteUser(user.token, id);
        alert("Funzionalità da implementare con l'API di eliminazione utenti");
        refreshData("users");
      } catch (error) {
        console.error("Errore nell'eliminazione dell'utente:", error);
        alert("Errore nell'eliminazione dell'utente");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.nome && u.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.cognome && u.cognome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0 fw-bold">Gestione Utenti</h2>
        <Button className="btn-cta rounded-pill px-4 fw-bold" onClick={() => setShowNewUserForm(!showNewUserForm)}>
          <FaPlus className="me-2" /> Nuovo Utente
        </Button>
      </div>
      
      {showNewUserForm && (
        <Card className="glass-card mb-5 border-0">
          <Card.Header className="border-0 pt-4 px-4 bg-transparent">
            <h5 className="mb-0 fw-bold">Aggiungi Nuovo Utente</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleCreateUser}>
              <Row>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Nome</Form.Label>
                  <Form.Control type="text" name="nome" className="glass-input text-white placeholder-light" placeholder="Nome" value={newUserData.nome} onChange={handleUserChange} />
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Cognome</Form.Label>
                  <Form.Control type="text" name="cognome" className="glass-input text-white placeholder-light" placeholder="Cognome" value={newUserData.cognome} onChange={handleUserChange} />
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Username</Form.Label>
                  <Form.Control type="text" name="username" className="glass-input text-white placeholder-light" placeholder="Username" value={newUserData.username} onChange={handleUserChange} required />
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Email</Form.Label>
                  <Form.Control type="email" name="email" className="glass-input text-white placeholder-light" placeholder="Email" value={newUserData.email} onChange={handleUserChange} required />
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Password</Form.Label>
                  <Form.Control type="password" name="password" className="glass-input text-white placeholder-light" placeholder="Password (min. 6 caratteri)" value={newUserData.password} onChange={handleUserChange} required minLength={6} />
                </Col>
                <Col md={6} className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Ruolo</Form.Label>
                  <Form.Select name="ruolo" className="glass-input text-white" value={newUserData.ruolo} onChange={handleUserChange}>
                    <option value="USER" style={{color:'black'}}>User</option>
                    <option value="ADMIN" style={{color:'black'}}>Admin</option>
                  </Form.Select>
                </Col>
              </Row>
              
              {organizations.length > 0 && (
                <Form.Group className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Organizzazione</Form.Label>
                  <Form.Select name="organizzazioneId" className="glass-input text-white" value={newUserData.organizzazioneId} onChange={handleUserChange}>
                    <option value="" style={{color:'black'}}>Nessuna organizzazione</option>
                    {organizations.map(org => <option key={org.id} value={org.id} style={{color:'black'}}>{org.nome}</option>)}
                  </Form.Select>
                </Form.Group>
              )}
              
              <div className="d-flex justify-content-end mt-2">
                <Button variant="outline-light" className="me-2 rounded-pill px-4" onClick={() => setShowNewUserForm(false)} disabled={creatingUser}>Annulla</Button>
                <Button className="btn-cta rounded-pill px-4 fw-bold" type="submit" disabled={creatingUser}>
                  {creatingUser ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creazione...</>
                  ) : "Crea Utente"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4">
          <InputGroup className="mb-4">
            <Form.Control className="glass-input text-white placeholder-light" placeholder="Cerca utenti..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button variant="primary" className="border-0"><FaSearch /></Button>
          </InputGroup>
          
          <div className="table-responsive">
            <Table hover className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome e Cognome</th>
                  <th>Email</th>
                  <th>Organizzazione</th>
                  <th>Ruolo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="opacity-50">#{u.id}</td>
                    <td>
                      <span className="fw-semibold">{u.nome} {u.cognome}</span><br/>
                      <small className="opacity-50">@{u.username}</small>
                    </td>
                    <td>{u.email}</td>
                    <td className="opacity-75">{u.nomeOrganizzazione || "-"}</td>
                    <td>
                      <Badge bg={u.ruolo === "ADMIN" ? "danger" : "primary"} className="rounded-pill px-3 py-2 text-white">
                        {u.ruolo}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-light" size="sm" className="me-2 rounded-pill opacity-75 hover-primary"><FaEdit /></Button>
                      <Button variant="danger" size="sm" className="rounded-pill" onClick={() => handleDeleteUser(u.id)} disabled={u.id === user.id}><FaTrash /></Button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 opacity-50">
                      <FaUsers size={40} className="mb-3" />
                      <p>Nessun utente trovato.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UsersSection;