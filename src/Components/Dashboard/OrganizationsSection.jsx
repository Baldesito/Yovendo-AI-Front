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

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setNewOrgData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleDeleteOrg = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa organizzazione? Questa azione non può essere annullata.")) {
      try {
        // await deleteOrganization(user.token, id);
        alert("Funzionalità da implementare con l'API di eliminazione organizzazioni");
        refreshData("organizations");
      } catch (error) {
        console.error("Errore nell'eliminazione dell'organizzazione:", error);
        alert("Errore nell'eliminazione dell'organizzazione");
      }
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.numeroWhatsapp && org.numeroWhatsapp.includes(searchTerm))
  );

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0 fw-bold">Organizzazioni</h2>
        <Button className="btn-cta rounded-pill px-4 fw-bold" onClick={() => setShowNewOrgForm(!showNewOrgForm)}>
          <FaPlus className="me-2" /> Nuova Organizzazione
        </Button>
      </div>
      
      {showNewOrgForm && (
        <Card className="glass-card mb-5 border-0">
          <Card.Header className="border-0 pt-4 px-4 bg-transparent">
            <h5 className="mb-0 fw-bold">Aggiungi Nuova Organizzazione</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleCreateOrg}>
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Nome Organizzazione</Form.Label>
                <Form.Control 
                  type="text" 
                  name="nome" 
                  className="glass-input text-white" 
                  value={newOrgData.nome} 
                  onChange={handleOrgChange} 
                  required 
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Numero WhatsApp</Form.Label>
                <Form.Control 
                  type="text" 
                  name="numeroWhatsapp" 
                  className="glass-input text-white placeholder-light" 
                  placeholder="+39 123 4567890" 
                  value={newOrgData.numeroWhatsapp} 
                  onChange={handleOrgChange} 
                />
                <Form.Text className="text-light opacity-50 d-block mt-2">
                  Il numero WhatsApp deve essere già registrato su WhatsApp Business
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Tono di Voce AI</Form.Label>
                <Form.Select 
                  name="tonoDiVoce" 
                  className="glass-input text-white" 
                  value={newOrgData.tonoDiVoce} 
                  onChange={handleOrgChange}
                >
                  <option value="Professionale e formale" style={{color:'black'}}>Professionale e formale</option>
                  <option value="Professionale e amichevole" style={{color:'black'}}>Professionale e amichevole</option>
                  <option value="Informale e casual" style={{color:'black'}}>Informale e casual</option>
                  <option value="Tecnico e dettagliato" style={{color:'black'}}>Tecnico e dettagliato</option>
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex justify-content-end mt-4">
                <Button variant="outline-light" className="me-2 rounded-pill px-4" onClick={() => setShowNewOrgForm(false)} disabled={creatingOrg}>
                  Annulla
                </Button>
                <Button className="btn-cta rounded-pill px-4 fw-bold" type="submit" disabled={creatingOrg}>
                  {creatingOrg ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creazione...</>
                  ) : "Crea Organizzazione"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4">
          <InputGroup className="mb-4">
            <Form.Control 
              className="glass-input text-white placeholder-light" 
              placeholder="Cerca organizzazioni..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Button variant="primary" className="border-0"><FaSearch /></Button>
          </InputGroup>
          
          <div className="table-responsive">
            <Table hover className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>Tono di Voce</th>
                  <th>Data</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length > 0 ? (
                  filteredOrgs.map((org) => (
                  <tr key={org.id}>
                    <td className="opacity-50">#{org.id}</td>
                    <td className="fw-semibold">{org.nome}</td>
                    <td>
                      {org.numeroWhatsapp ? (
                        <span className="badge bg-success rounded-pill px-3 py-2">
                          <FaWhatsapp className="me-1"/> {org.numeroWhatsapp}
                        </span>
                      ) : (
                        <span className="opacity-50">Non impostato</span>
                      )}
                    </td>
                    <td className="opacity-75">{org.tonoDiVoce || "Default"}</td>
                    <td className="opacity-75">{new Date(org.dataCreazione).toLocaleDateString()}</td>
                    <td>
                      <Button variant="outline-light" size="sm" className="me-2 rounded-pill opacity-75 hover-primary">
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" className="rounded-pill" onClick={() => handleDeleteOrg(org.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 opacity-50">
                      <FaUsers size={40} className="mb-3" />
                      <p>Nessuna organizzazione trovata.</p>
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

export default OrganizationsSection;