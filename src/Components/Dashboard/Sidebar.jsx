import React from "react";
import { Col } from "react-bootstrap";
import { FaUser, FaPhoneAlt, FaChartLine, FaComments, FaFileAlt, FaUsers, FaCog, FaTimes } from "react-icons/fa";

const Sidebar = ({ activeSection, changeSection, sidebarOpen, toggleSidebar }) => {
  return (
    <Col 
      md={2} 
      className={`sidebar p-0 ${sidebarOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}`}
      style={{ 
        background: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(10px)', 
        borderRight: '1px solid rgba(255,255,255,0.1)',
        borderTopRightRadius: '24px',      /* Bordo arrotondato in alto a destra */
        borderTopLeftRadius: '24px',      
        borderBottomRightRadius: '24px',   /* Bordo arrotondato in basso a destra */
        borderBottomLeftRadius: '24px',    /* Bordo arrotondato in basso a sinistra */
        overflow: 'hidden'                 /* Assicura che i menu non sbordino dagli angoli */
      }}
    >
      <div className="sidebar-header p-4 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
        <h4 className="mb-0 text-primary fw-bold d-flex align-items-center">
           <img src="/yovendo-ai.svg" alt="Logo" width="30" height="30" className="me-2" />
           Yovendo
        </h4>
        <div className="sidebar-close d-md-none text-white" onClick={toggleSidebar}>
          <FaTimes />
        </div>
      </div>
      
      <div className="sidebar-title px-4 pt-4 pb-2 text-primary-light opacity-75 small fw-bold tracking-wide">PRINCIPALE</div>
      <ul className="sidebar-menu list-unstyled m-0">
        <li className={`px-4 py-3 ${activeSection === "dashboard" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("dashboard")}>
          <FaChartLine className="me-3" /> <span>Dashboard</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "analysis" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("analysis")}>
          <FaPhoneAlt className="me-3" /> <span>Analisi Chiamate</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "recordings" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("recordings")}>
          <FaPhoneAlt className="me-3" /> <span>Registrazioni</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "conversations" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("conversations")}>
          <FaComments className="me-3" /> <span>Conversazioni</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "documents" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("documents")}>
          <FaFileAlt className="me-3" /> <span>Documenti</span>
        </li>
      </ul>
      
      <div className="sidebar-title px-4 pt-4 pb-2 text-primary-light opacity-75 small fw-bold tracking-wide">IL TUO ACCOUNT</div>
      <ul className="sidebar-menu list-unstyled m-0">
        <li className={`px-4 py-3 ${activeSection === "profile" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("profile")}>
          <FaUser className="me-3" /> <span>Profilo</span>
        </li>
      </ul>
      
      <div className="sidebar-title px-4 pt-4 pb-2 text-primary-light opacity-75 small fw-bold tracking-wide">LA TUA AZIENDA</div>
      <ul className="sidebar-menu list-unstyled m-0">
        <li className={`px-4 py-3 ${activeSection === "users" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("users")}>
          <FaUsers className="me-3" /> <span>Gestione Utenti</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "organizations" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("organizations")}>
          <FaUsers className="me-3" /> <span>Organizzazioni</span>
        </li>
        <li className={`px-4 py-3 ${activeSection === "settings" ? "active-nav-item" : "hover-primary text-white"}`} onClick={() => changeSection("settings")}>
          <FaCog className="me-3" /> <span>Impostazioni AI</span>
        </li>
      </ul>
    </Col>
  );
};

export default Sidebar;