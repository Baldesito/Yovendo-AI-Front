
import { useState } from "react";
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

  // Handler per aggiornare i campi del nuovo utente
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handler per creare un nuovo utente
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
        username: "",
        email: "",
        password: "",
        nome: "",
        cognome: "",
        organizzazioneId: "",
        ruolo: "USER"
      });
      refreshData("users");
    } catch (error) {
      alert(`Errore nella creazione dell'utente: ${error.message}`);
    } finally {
      setCreatingUser(false);
    }
  };

  // Funzione per eliminare un utente
  const handleDeleteUser = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.")) {
      try {
        // Implementare la chiamata API per eliminare un utente
        // await deleteUser(user.token, id);
        alert("Funzionalità da implementare con l'API di eliminazione utenti");
        refreshData("users");
      } catch (error) {
        console.error("Errore nell'eliminazione dell'utente:", error);
        alert("Errore nell'eliminazione dell'utente");
      }
    }
  };

  // Filtraggio utenti in base alla ricerca
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.nome && user.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.cognome && user.cognome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Gestione Utenti</h2>
        <Button 
          variant="primary" 
          className="rounded-pill"
          onClick={() => setShowNewUserForm(!showNewUserForm)}
        >
          <FaPlus className="me-2" /> Nuovo Utente
        </Button>
      </div>
      
      {/* Form per creare un nuovo utente */}
      {showNewUserForm && (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Aggiungi Nuovo Utente</h5>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            <Form onSubmit={handleCreateUser}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="nome"
                      placeholder="Inserisci nome"
                      value={newUserData.nome}
                      onChange={handleUserChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="cognome"
                      placeholder="Inserisci cognome"
                      value={newUserData.cognome}
                      onChange={handleUserChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="username"
                      placeholder="Inserisci username"
                      value={newUserData.username}
                      onChange={handleUserChange}
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
                      placeholder="Inserisci email"
                      value={newUserData.email}
                      onChange={handleUserChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Inserisci password"
                      value={newUserData.password}
                      onChange={handleUserChange}
                      required
                      minLength={6}
                    />
                    <Form.Text className="text-muted">
                      La password deve essere di almeno 6 caratteri
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ruolo</Form.Label>
                    <Form.Select
                      name="ruolo"
                      value={newUserData.ruolo}
                      onChange={handleUserChange}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              {organizations.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Organizzazione</Form.Label>
                  <Form.Select
                    name="organizzazioneId"
                    value={newUserData.organizzazioneId}
                    onChange={handleUserChange}
                  >
                    <option value="">Seleziona un'organizzazione</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2 rounded-pill"
                  onClick={() => setShowNewUserForm(false)}
                  disabled={creatingUser}
                >
                  Annulla
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="rounded-pill"
                  disabled={creatingUser}
                >
                  {creatingUser ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creazione in corso...
                    </>
                  ) : (
                    <>Crea Utente</>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="mb-4">
        <Card.Body className="p-3 p-md-4">
          <div className="mb-4">
            <InputGroup>
              <Form.Control 
                placeholder="Cerca utenti..." 
                aria-label="Cerca utenti"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>
          
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Organizzazione</th>
                  <th>Ruolo</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((userItem) => (
                    <tr key={userItem.id}>
                      <td>#{userItem.id}</td>
                      <td>{userItem.nome} {userItem.cognome}</td>
                      <td>{userItem.username}</td>
                      <td>{userItem.email}</td>
                      <td>{userItem.nomeOrganizzazione || "Nessuna"}</td>
                      <td>
                        <Badge bg={userItem.ruolo === "ADMIN" ? "danger" : "primary"}>
                          {userItem.ruolo}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <FaEdit /> Modifica
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(userItem.id)}
                          disabled={userItem.id === user.id} // Non permettere di eliminare sé stessi
                        >
                          <FaTrash /> Elimina
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <FaUsers size={40} className="text-muted mb-3" />
                      <p>
                        {searchTerm 
                          ? "Nessun utente corrisponde alla ricerca" 
                          : "Non ci sono utenti disponibili."}
                      </p>
                      <Button 
                        variant="primary" 
                        className="rounded-pill"
                        onClick={() => setShowNewUserForm(true)}
                      >
                        <FaPlus className="me-2" /> Nuovo Utente
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UsersSection;