
import React from "react";
import { Col } from "react-bootstrap";
import { FaUser, FaPhoneAlt, FaChartLine, FaComments, FaFileAlt, FaUsers, FaCog, FaTimes } from "react-icons/fa";

const Sidebar = ({ activeSection, changeSection, sidebarOpen, toggleSidebar }) => {
  return (
    <Col 
      md={2} 
      className={`sidebar p-0 ${sidebarOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}`}
    >
      <div className="sidebar-header">
        <h3>Yovendo  <img src="/src/assets/yovendo-ai.svg" alt="Logo" width="40" height="40" /></h3>
        <div className="sidebar-close d-md-none" onClick={toggleSidebar}>
          <FaTimes />
        </div>
      </div>
      
      <div className="sidebar-title">
        <p>PRINCIPALE</p>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => changeSection("dashboard")}
        >
          <FaChartLine /> <span>Dashboard</span>
        </li>
        <li 
          className={activeSection === "analysis" ? "active" : ""}
          onClick={() => changeSection("analysis")}
        >
          <FaPhoneAlt /> <span>Analisi Chiamate</span>
        </li>
        <li 
          className={activeSection === "recordings" ? "active" : ""}
          onClick={() => changeSection("recordings")}
        >
          <FaPhoneAlt /> <span>Registrazioni Chiamate</span>
        </li>
        <li 
          className={activeSection === "conversations" ? "active" : ""}
          onClick={() => changeSection("conversations")}
        >
          <FaComments /> <span>Conversazioni</span>
        </li>
        <li 
          className={activeSection === "documents" ? "active" : ""}
          onClick={() => changeSection("documents")}
        >
          <FaFileAlt /> <span>Documenti</span>
        </li>
      </ul>
      
      <div className="sidebar-title">
        <p>IL TUO ACCOUNT</p>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeSection === "profile" ? "active" : ""}
          onClick={() => changeSection("profile")}
        >
          <FaUser /> <span>Profilo</span>
        </li>
      </ul>
      
      <div className="sidebar-title">
        <p>LA TUA AZIENDA</p>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeSection === "users" ? "active" : ""}
          onClick={() => changeSection("users")}
        >
          <FaUsers /> <span>Gestione Utenti</span>
        </li>
        <li 
          className={activeSection === "organizations" ? "active" : ""}
          onClick={() => changeSection("organizations")}
        >
          <FaUsers /> <span>Organizzazioni</span>
        </li>
        <li 
          className={activeSection === "settings" ? "active" : ""}
          onClick={() => changeSection("settings")}
        >
          <FaCog /> <span>Impostazioni AI</span>
        </li>
      </ul>
    </Col>
  );
};

export default Sidebar;