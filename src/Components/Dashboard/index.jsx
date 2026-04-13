import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { FaBars, FaTimes, FaExclamationTriangle } from "react-icons/fa";

import Sidebar from "./Sidebar";
import DashboardSection from "./DashboardSection";
import ConversationsSection from "./ConversationsSection";
import DocumentsSection from "./DocumentsSection";
import UsersSection from "./UsersSection";
import OrganizationsSection from "./OrganizationsSection";
import AISettingsSection from "./AISettingsSection";
import ProfileSection from "./ProfileSection";

import * as api from "./API1";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  //eslint-disable-next-line
  const [error, setError] = useState(null);
  
  const [statistics, setStatistics] = useState({
    totalCalls: 0, successRate: 0, topSeller: "",
    conversationCount: 0, messageCount: 0,
    documentCount: 0, processedDocuments: 0
  });
  const [conversations, setConversations] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // ASCOLTATORI EVENTI DAL MENU DROPDOWN
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveSection(event.detail); // event.detail contiene 'profile' o 'settings'
    };

    // Mettiti in ascolto del segnale
    window.addEventListener('cambiaSezioneDashboard', handleTabChange);

    // Pulizia dell'ascoltatore quando il componente viene chiuso
    return () => {
      window.removeEventListener('cambiaSezioneDashboard', handleTabChange);
    };
  }, []);
  useEffect(() => {
    if (user) { loadData(); } else if (user === null && !loading) { setLoading(false); }
    // eslint-disable-next-line
  }, [user]);
  
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, convsData, orgsData, docsData, usersData] = await Promise.allSettled([
        api.fetchStatistics(user.token),
        api.fetchConversations(user.token, user.organizzazioneId),
        api.fetchOrganizations(user.token),
        api.fetchDocuments(user.token, user.organizzazioneId),
        api.fetchUsers(user.token, user.organizzazioneId)
      ]);
      
      setStatistics({
        totalCalls: statsData.status === 'fulfilled' ? statsData.value?.totalCalls || 0 : 0,
        successRate: statsData.status === 'fulfilled' ? statsData.value?.successRate || 0 : 0,
        topSeller: statsData.status === 'fulfilled' ? statsData.value?.topSellerName || "N/A" : "N/A",
        conversationCount: statsData.status === 'fulfilled' ? statsData.value?.totalConversazioni || 0 : 0,
        messageCount: statsData.status === 'fulfilled' ? statsData.value?.messaggiTotali || 0 : 0,
        documentCount: statsData.status === 'fulfilled' ? statsData.value?.documentiTotali || 0 : 0,
        processedDocuments: statsData.status === 'fulfilled' ? statsData.value?.documentiElaborati || 0 : 0
      });
      
      setConversations(convsData.status === 'fulfilled' ? convsData.value || [] : []);
      setOrganizations(orgsData.status === 'fulfilled' ? orgsData.value || [] : []);
      setDocuments(docsData.status === 'fulfilled' ? docsData.value || [] : []);
      setUsers(usersData.status === 'fulfilled' ? usersData.value || [] : []);
    //eslint-disable-next-line
    } catch (error) {
      setError("Errore nel caricamento dati.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (dataType) => {
    try {
      switch (dataType) {
        case "conversations": {
          const data = await api.fetchConversations(user.token, user.organizzazioneId);
          setConversations(data);
          break;
        }
        case "documents": {
          const data = await api.fetchDocuments(user.token, user.organizzazioneId);
          setDocuments(data);
          break;
        }
        case "organizations": {
          const data = await api.fetchOrganizations(user.token);
          setOrganizations(data);
          break;
        }
        case "users": {
          const data = await api.fetchUsers(user.token, user.organizzazioneId);
          setUsers(data);
          break;
        }
        case "statistics": {
          const data = await api.fetchStatistics(user.token);
          setStatistics(prev => ({ ...prev, ...data }));
          break;
        }
        default:
          await loadData();
      }
    } catch (err) { console.error(err); }
  };
  
  const renderActiveSection = () => {
    const commonProps = { user, refreshData };
    switch (activeSection) {
      case "conversations": return <ConversationsSection {...commonProps} conversations={conversations} testWhatsApp={api.testWhatsAppConnection} sendTestMessage={api.sendTestMessage} closeConversation={api.closeConversation} reopenConversation={api.reopenConversation} />;
      case "documents": return <DocumentsSection {...commonProps} documents={documents} organizations={organizations} uploadDocument={api.uploadDocument} />;
      case "users": return <UsersSection {...commonProps} users={users} organizations={organizations} createUser={api.createUser} />;
      case "organizations": return <OrganizationsSection {...commonProps} organizations={organizations} createOrganization={api.createOrganization} />;
      case "settings": return <AISettingsSection {...commonProps} testWhatsApp={api.testWhatsAppConnection} />;
      case "profile": return <ProfileSection {...commonProps} setUser={setUser} />;
      default: return <DashboardSection {...commonProps} statistics={statistics} conversations={conversations.slice(0, 3)} documents={documents.slice(0, 3)} changeSection={setActiveSection} />;
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="text-white">Caricamento Dashboard...</p></div>;

  return (
    <div className="dashboard-container" style={{ background: "transparent" }}>
      <div className="sidebar-toggle d-md-none glass-card" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "white", padding: "10px", cursor: "pointer" }}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
      <Container fluid className="p-0">
        <Row className="g-0">
          <Sidebar activeSection={activeSection} changeSection={setActiveSection} sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
          <Col md={10} className="main-content p-3 p-md-4" style={{ background: "transparent" }}>
            {renderActiveSection()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;