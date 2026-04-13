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
        // Implementare la chiamata API reale qui
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
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2 className="mb-0 fw-bold">Documenti</h2>
        <Button className="btn-cta rounded-pill px-4 fw-bold" onClick={() => setShowUploadForm(!showUploadForm)}>
          <FaPlus className="me-2" /> Carica Documento
        </Button>
      </div>
      
      {showUploadForm && (
        <Card className="glass-card mb-5 border-0">
          <Card.Header className="border-0 pt-4 px-4 bg-transparent">
            <h5 className="mb-0 fw-bold">Carica Nuovo Documento</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleUploadDocument}>
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">Titolo Documento</Form.Label>
                <Form.Control 
                  type="text" 
                  className="glass-input text-white" 
                  placeholder="Inserisci titolo" 
                  value={documentTitle} 
                  onChange={(e) => setDocumentTitle(e.target.value)} 
                  required 
                />
              </Form.Group>
              
              {organizations.length > 0 && !user.organizzazioneId && (
                <Form.Group className="mb-4">
                  <Form.Label className="opacity-75 small text-uppercase">Organizzazione</Form.Label>
                  <Form.Select 
                    className="glass-input text-white" 
                    value={selectedOrganization} 
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                  >
                    <option value="" style={{color: 'black'}}>Seleziona un'organizzazione</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id} style={{color: 'black'}}>{org.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              
              <Form.Group className="mb-4">
                <Form.Label className="opacity-75 small text-uppercase">File (PDF, Word, TXT)</Form.Label>
                <Form.Control 
                  type="file" 
                  className="glass-input text-white" 
                  accept=".pdf,.doc,.docx,.txt" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  required 
                />
                <Form.Text className="text-light opacity-50 d-block mt-2">
                  Formati supportati: PDF, Word, Text (max 10MB)
                </Form.Text>
              </Form.Group>
              
              <div className="d-flex justify-content-end mt-4">
                <Button variant="outline-light" className="me-2 rounded-pill px-4" onClick={() => setShowUploadForm(false)} disabled={uploading}>
                  Annulla
                </Button>
                <Button className="btn-cta rounded-pill px-4 fw-bold" type="submit" disabled={uploading}>
                  {uploading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Caricamento...</>
                  ) : "Carica Documento"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      
      <Card className="glass-card border-0 mb-5">
        <Card.Body className="p-4">
          <InputGroup className="mb-4">
            <Form.Control className="glass-input text-white placeholder-light" placeholder="Cerca documenti..." />
            <Button variant="primary" className="border-0"><FaSearch /></Button>
          </InputGroup>
          
          <div className="table-responsive">
            <Table hover className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titolo</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="opacity-50">#{doc.id}</td>
                      <td className="fw-semibold">{doc.titolo}</td>
                      <td>{doc.tipoContenuto?.includes("pdf") ? "PDF" : doc.tipoContenuto?.includes("word") ? "Word" : "Testo"}</td>
                      <td className="opacity-75">{new Date(doc.dataCaricamento).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={doc.elaborato ? "success" : "warning"} className="rounded-pill px-3 py-2 text-dark fw-bold">
                          {doc.elaborato ? "Elaborato" : "In attesa"}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-light" size="sm" className="me-2 rounded-pill opacity-75 hover-primary">
                          <FaSearch className="me-1"/> Vis
                        </Button>
                        <Button variant="danger" size="sm" className="rounded-pill" onClick={() => handleDeleteDocument(doc.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 opacity-50">
                      <FaFileAlt size={40} className="mb-3" />
                      <p>Nessun documento disponibile.</p>
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

export default DocumentsSection;