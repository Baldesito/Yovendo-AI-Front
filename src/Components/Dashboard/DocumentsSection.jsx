
import React, { useState } from "react";
import { Card, Button, Form, InputGroup, Badge, Table } from "react-bootstrap";
import { FaPlus, FaSearch, FaFileAlt, FaTrash } from "react-icons/fa";

const DocumentsSection = ({ user, documents, organizations, uploadDocument, refreshData }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handler per caricare un documento
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    
    if (!documentTitle.trim() || !selectedFile) {
      alert("Titolo e file sono obbligatori");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("titolo", documentTitle);
    formData.append("organizzazioneId", selectedOrganization || user.organizzazioneId);
    
    setUploading(true);
    
    try {
      await uploadDocument(user.token, formData);
      alert("Documento caricato con successo");
      setShowUploadForm(false);
      setDocumentTitle("");
      setSelectedFile(null);
      refreshData("documents");
    } catch (error) {
      console.error("Errore nel caricamento del documento:", error);
      alert("Errore nel caricamento del documento");
    } finally {
      setUploading(false);
    }
  };

  // Funzione per eliminare un documento
  const handleDeleteDocument = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo documento? Questa azione non può essere annullata.")) {
      try {
        // Implementare la chiamata API per eliminare un documento
        // await deleteDocument(user.token, id);
        alert("Funzionalità da implementare con l'API di eliminazione documenti");
        refreshData("documents");
      } catch (error) {
        console.error("Errore nell'eliminazione del documento:", error);
        alert("Errore nell'eliminazione del documento");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 main-title">Documenti</h2>
        <Button 
          variant="primary" 
          className="rounded-pill"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <FaPlus className="me-2" /> Carica Documento
        </Button>
      </div>
      
      {/* Form per caricare un documento */}
      {showUploadForm && (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Carica Nuovo Documento</h5>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            <Form onSubmit={handleUploadDocument}>
              <Form.Group className="mb-3">
                <Form.Label>Titolo Documento</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Inserisci un titolo per il documento"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  required
                />
              </Form.Group>
              
              {organizations.length > 0 && !user.organizzazioneId && (
                <Form.Group className="mb-3">
                  <Form.Label>Organizzazione</Form.Label>
                  <Form.Select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                  >
                    <option value="">Seleziona un'organizzazione</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>File</Form.Label>
                <Form.Control 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                />
                <Form.Text className="text-muted">
                  Formati supportati: PDF, Word, Text (max 10MB)
                </Form.Text>
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2 rounded-pill"
                  onClick={() => setShowUploadForm(false)}
                  disabled={uploading}
                >
                  Annulla
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="rounded-pill"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Caricamento in corso...
                    </>
                  ) : (
                    <>Carica Documento</>
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
                placeholder="Cerca documenti..." 
                aria-label="Cerca documenti"
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
                  <th>Titolo</th>
                  <th>Tipo</th>
                  <th>Data Caricamento</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>#{doc.id}</td>
                      <td>{doc.titolo}</td>
                      <td>
                        {doc.tipoContenuto.includes("pdf") ? "PDF" : 
                         doc.tipoContenuto.includes("word") ? "Word" : 
                         doc.tipoContenuto.includes("plain") ? "Testo" : "Documento"}
                      </td>
                      <td>{new Date(doc.dataCaricamento).toLocaleString()}</td>
                      <td>
                        <Badge bg={doc.elaborato ? "success" : "warning"}>
                          {doc.elaborato ? "Elaborato" : doc.statoElaborazione === "in-elaborazione" ? "In elaborazione" : "In attesa"}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <FaSearch /> Visualizza
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <FaTrash /> Elimina
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <FaFileAlt size={40} className="text-muted mb-3" />
                      <p>Non ci sono documenti disponibili.</p>
                      <Button 
                        variant="primary" 
                        className="rounded-pill"
                        onClick={() => setShowUploadForm(true)}
                      >
                        <FaPlus className="me-2" /> Carica Documento
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

export default DocumentsSection;