// src/components/Dashboard/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";

import Sidebar from "./Sidebar";
import DashboardSection from "./DashboardSection";
import ConversationsSection from "./ConversationsSection";
import DocumentsSection from "./DocumentsSection";
import UsersSection from "./UsersSection";
import OrganizationsSection from "./OrganizationsSection";
import AISettingsSection from "./AISettingsSection";
import ProfileSection from "./ProfileSection";

import * as api from "./api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stati per i dati
  const [statistics, setStatistics] = useState({
    totalCalls: 0,
    successRate: 0,
    topSeller: "",
    conversationCount: 0,
    messageCount: 0,
    documentCount: 0,
    processedDocuments: 0
  });
  const [conversations, setConversations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Caricamento dati dell'utente al mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  
  // Caricamento dei dati quando l'utente è disponibile
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  // Funzione per caricare tutti i dati necessari
const loadData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // Carica tutti i dati necessari in parallelo
    const [statsData, convsData, orgsData, docsData, usersData] = await Promise.allSettled([
      api.fetchStatistics(user.token),
      api.fetchConversations(user.token, user.organizzazioneId),
      api.fetchOrganizations(user.token),
      api.fetchDocuments(user.token, user.organizzazioneId),
      api.fetchUsers(user.token, user.organizzazioneId)
    ]);
    
    // Gestisci i risultati anche se alcune chiamate falliscono
    setStatistics({
      totalCalls: statsData.status === 'fulfilled' ? statsData.value?.totalCalls || 0 : 0,
      successRate: statsData.status === 'fulfilled' ? statsData.value?.successRate || 0 : 0,
      topSeller: statsData.status === 'fulfilled' ? statsData.value?.topSellerName || "Connessione al server fallita" : "Connessione al server fallita",
      conversationCount: statsData.status === 'fulfilled' ? statsData.value?.totalConversazioni || 0 : 0,
      messageCount: statsData.status === 'fulfilled' ? statsData.value?.messaggiTotali || 0 : 0,
      documentCount: statsData.status === 'fulfilled' ? statsData.value?.documentiTotali || 0 : 0,
      processedDocuments: statsData.status === 'fulfilled' ? statsData.value?.documentiElaborati || 0 : 0
    });
    
    setConversations(convsData.status === 'fulfilled' ? convsData.value || [] : []);
    setOrganizations(orgsData.status === 'fulfilled' ? orgsData.value || [] : []);
    setDocuments(docsData.status === 'fulfilled' ? docsData.value || [] : []);
    setUsers(usersData.status === 'fulfilled' ? usersData.value || [] : []);
    
    // Imposta un errore se tutte le chiamate falliscono
    if ([statsData, convsData, orgsData, docsData, usersData].every(result => result.status === 'rejected')) {
      setError("Impossibile connettersi al server. Assicurati che il backend sia in esecuzione.");
    }
  } catch (err) {
    console.error("Errore nel caricamento dei dati:", err);
    setError("Si è verificato un errore nel caricamento dei dati. Probabilmente il server non è raggiungibile.");
  } finally {
    setLoading(false);
  }
};

  // Funzione per aggiornare un tipo specifico di dati
  const refreshData = async (dataType) => {
    try {
      switch (dataType) {

        case "conversations":
          // eslint-disable-next-line no-case-declarations
          const convsData = await api.fetchConversations(user.token, user.organizzazioneId);
          setConversations(convsData);
          break;
        case "documents":
          // eslint-disable-next-line no-case-declarations
          const docsData = await api.fetchDocuments(user.token, user.organizzazioneId);
          setDocuments(docsData);
          break;
        case "organizations":
          // eslint-disable-next-line no-case-declarations
          const orgsData = await api.fetchOrganizations(user.token);
          setOrganizations(orgsData);
          break;
        case "users":
          // eslint-disable-next-line no-case-declarations
          const usersData = await api.fetchUsers(user.token, user.organizzazioneId);
          setUsers(usersData);
          break;
      case "statistics":
  // eslint-disable-next-line no-case-declarations
  const statsData = await api.fetchStatistics(user.token);
  setStatistics(prev => ({
    ...prev,
    totalCalls: statsData.totalCalls || prev.totalCalls,
    // Aggiorna anche il topSeller quando aggiorni le statistiche
    topSeller: statsData.topSellerName || prev.topSeller,
    conversationCount: statsData.totalConversazioni || prev.conversationCount,
    messageCount: statsData.messaggiTotali || prev.messageCount,
    documentCount: statsData.documentiTotali || prev.documentCount,
    processedDocuments: statsData.documentiElaborati || prev.processedDocuments
  }));
  break;
        default:
          // Se il tipo non è specificato, ricarica tutti i dati
          await loadData();
      }
    } catch (err) {
      console.error(`Errore nell'aggiornamento dei dati di tipo ${dataType}:`, err);
    }
  };
  
  // Funzione per toggle della sidebar su mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Funzione per cambiare sezione
  const changeSection = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  
  // Renderizzazione condizionale in base alla sezione attiva
  const renderActiveSection = () => {
    const commonProps = {
      user,
      refreshData
    };
    
    switch (activeSection) {
      case "conversations":
        return (
          <ConversationsSection 
            {...commonProps} 
            conversations={conversations}
            testWhatsApp={api.testWhatsAppConnection}
            sendTestMessage={api.sendTestMessage}
            closeConversation={api.closeConversation}
            reopenConversation={api.reopenConversation}
          />
        );
      case "documents":
        return (
          <DocumentsSection 
            {...commonProps} 
            documents={documents}
            organizations={organizations}
            uploadDocument={api.uploadDocument}
          />
        );
      case "users":
        return (
          <UsersSection 
            {...commonProps} 
            users={users}
            organizations={organizations}
            createUser={api.createUser}
          />
        );
      case "organizations":
        return (
          <OrganizationsSection 
            {...commonProps} 
            organizations={organizations}
            createOrganization={api.createOrganization}
          />
        );
      case "settings":
        return (
          <AISettingsSection 
            {...commonProps} 
            testWhatsApp={api.testWhatsAppConnection}
          />
        );
      case "profile":
        return (
          <ProfileSection 
            {...commonProps} 
            setUser={setUser}
          />
        );
      default:
        return (
          <DashboardSection 
            {...commonProps} 
            statistics={statistics} 
            conversations={conversations.slice(0, 3)} 
            documents={documents.slice(0, 3)} 
            changeSection={changeSection}
          />
        );
    }
  };

  // Se c'è un errore, mostra un messaggio
  if (error) {
    return (
      <div className="error-container text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button 
          variant="primary" 
          onClick={loadData}
          className="mt-3"
        >
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle Button */}
      <div className="sidebar-toggle d-md-none" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      <Container fluid className="p-0">
        <Row className="g-0">
          {/* Sidebar */}
          <Sidebar 
            activeSection={activeSection} 
            changeSection={changeSection} 
            sidebarOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
          />

          {/* Main Content */}
          <Col md={10} className="main-content p-3 p-md-4">
            {loading ? (
              <div className="loading-container text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Caricamento...</span>
                </div>
                <p>Caricamento dati in corso...</p>
              </div>
            ) : (
              renderActiveSection()
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;