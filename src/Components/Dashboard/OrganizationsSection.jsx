
import React, { useState } from "react";
import { Card, Button, Form, InputGroup, Badge, Table } from "react-bootstrap";
import { FaPlus, FaSearch, FaUsers, FaTrash, FaEdit, FaWhatsapp } from "react-icons/fa";

const OrganizationsSection = ({ user, organizations, createOrganization, refreshData }) => {
  const [showNewOrgForm, setShowNewOrgForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrgData, setNewOrgData] = useState({
    nome: "",
    numeroWhatsapp: "",
    tonoDiVoce: "Professionale e formale"
  });
  const [creatingOrg, setCreatingOrg] = useState(false);

  // Handler per aggiornare i campi della nuova organizzazione
  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setNewOrgData(prev => ({ ...prev, [name]: value }));
  };

  // Handler per creare una nuova organizzazione
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    
    if (!newOrgData.nome) {
      alert("Il nome dell'organizzazione è obbligatorio");
      return;
    }
    
    setCreatingOrg(true);
    
    try {
      await createOrganization(user.token, newOrgData);
      alert("Organizzazione creata con successo");
      setShowNewOrgForm(false);
      setNewOrgData({
        nome: "",
        numeroWhatsapp: "",
        tonoDiVoce: "Professionale e formale"
      });
      refreshData("organizations");
    } catch (error) {
      alert(`Errore nella creazione dell'organizzazione: ${error.message}`);
    } finally {
      setCreatingOrg(false);
    }
  };

  // Funzione per eliminare un'organizzazione
  const handleDeleteOrg = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa organizzazione? Questa azione non può essere annullata.")) {
      try {
        // Implementare la chiamata API per eliminare un'organizzazione
        // await deleteOrganization(user.token, id);
        alert("Funzionalità da implementare con l'API di eliminazione organizzazioni");
        refreshData("organizations");
      } catch (error) {
        console.error("Errore nell'eliminazione dell'organizzazione:", error);
        alert("Errore nell'eliminazione dell'organizzazione");
      }
    }
  };

  // Filtraggio organizzazioni in base alla ricerca
  const filteredOrgs = organizations.filter(org => 
    org.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.numeroWhatsapp && org.numeroWhatsapp.includes(searchTerm))
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Gestione Organizzazioni</h2>
        <Button 
          variant="primary" 
          className="rounded-pill"
          onClick={() => setShowNewOrgForm(!showNewOrgForm)}
        >
          <FaPlus className="me-2" /> Nuova Organizzazione
        </Button>
      </div>
      
      {/* Form per creare una nuova organizzazione */}
      {showNewOrgForm && (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Aggiungi Nuova Organizzazione</h5>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            <Form onSubmit={handleCreateOrg}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Organizzazione</Form.Label>
                <Form.Control 
                  type="text" 
                  name="nome"
                  placeholder="Inserisci nome organizzazione"
                  value={newOrgData.nome}
                  onChange={handleOrgChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Numero WhatsApp</Form.Label>
                <Form.Control 
                  type="text" 
                  name="numeroWhatsapp"
                  placeholder="Formato: +39 123 4567890"
                  value={newOrgData.numeroWhatsapp}
                  onChange={handleOrgChange}
                />
                <Form.Text className="text-muted">
                  Il numero WhatsApp deve essere già registrato su WhatsApp Business
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Tono di Voce</Form.Label>
                <Form.Select
                  name="tonoDiVoce"
                  value={newOrgData.tonoDiVoce}
                  onChange={handleOrgChange}
                >
                  <option value="Professionale e formale">Professionale e formale</option>
                  <option value="Professionale e amichevole">Professionale e amichevole</option>
                  <option value="Informale e casual">Informale e casual</option>
                  <option value="Tecnico e dettagliato">Tecnico e dettagliato</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2 rounded-pill"
                  onClick={() => setShowNewOrgForm(false)}
                  disabled={creatingOrg}
                >
                  Annulla
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="rounded-pill"
                  disabled={creatingOrg}
                >
                  {creatingOrg ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creazione in corso...
                    </>
                  ) : (
                    <>Crea Organizzazione</>
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
                placeholder="Cerca organizzazioni..." 
                aria-label="Cerca organizzazioni"
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
                  <th>Numero WhatsApp</th>
                  <th>Tono di Voce</th>
                  <th>Data Creazione</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length > 0 ? (
                  filteredOrgs.map((org) => (
                    <tr key={org.id}>
                      <td>#{org.id}</td>
                      <td>{org.nome}</td>
                      <td>
                        {org.numeroWhatsapp ? (
                          <span>
                            {org.numeroWhatsapp}{" "}
                            <FaWhatsapp className="text-success" />
                          </span>
                        ) : (
                          "Non impostato"
                        )}
                      </td>
                      <td>{org.tonoDiVoce || "Non impostato"}</td>
                      <td>{new Date(org.dataCreazione).toLocaleDateString()}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <FaEdit /> Modifica
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteOrg(org.id)}
                        >
                          <FaTrash /> Elimina
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <FaUsers size={40} className="text-muted mb-3" />
                      <p>
                        {searchTerm 
                          ? "Nessuna organizzazione corrisponde alla ricerca" 
                          : "Non ci sono organizzazioni disponibili."}
                      </p>
                      <Button 
                        variant="primary" 
                        className="rounded-pill"
                        onClick={() => setShowNewOrgForm(true)}
                      >
                        <FaPlus className="me-2" /> Nuova Organizzazione
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

export default OrganizationsSection;