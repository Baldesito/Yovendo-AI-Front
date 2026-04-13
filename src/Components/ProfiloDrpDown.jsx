import React from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserEdit, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- NUOVO IMPORT

const ProfiloDrpDown = ({ user, onLogout }) => {
  const navigate = useNavigate(); // Inizializziamo il navigatore

  const nome = user?.nome || user?.username || "Utente";
  const cognome = user?.cognome || "";
  const iniziale = nome.charAt(0).toUpperCase();
  const ruolo = user?.ruolo || "Admin";

  // La magia avviene qui: naviga alla dashboard e lancia un segnale per cambiare scheda
  const goToSection = (section) => {
    navigate('/dashboard'); // Assicurati di essere nella rotta giusta
    window.dispatchEvent(new CustomEvent('cambiaSezioneDashboard', { detail: section }));
  };

  return (
    <>
      <Dropdown.Toggle 
        variant="transparent" 
        id="dropdown-profile" 
        className="d-flex align-items-center border-0 p-0 shadow-none"
        style={{ background: "transparent" }}
      >
        <div 
          className="d-flex justify-content-center align-items-center shadow"
          style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            color: "white",
            fontSize: "1.3rem",
            fontWeight: "bold",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            cursor: "pointer",
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {iniziale}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-custom mt-3 p-3">
        <div className="text-center mb-3 pb-3 border-bottom border-secondary border-opacity-25">
          <div 
            className="mx-auto mb-3 d-flex justify-content-center align-items-center shadow"
            style={{ 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              color: "white",
              fontSize: "1.8rem",
              fontWeight: "bold",
              border: "3px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            {iniziale}
          </div>
          <h5 className="text-white mb-0 fw-bold">{nome} {cognome}</h5>
          <div className="text-primary-light small text-uppercase fw-bold opacity-75 mt-1">{ruolo}</div>
          <div className="text-light opacity-50 small mt-1">{user?.email}</div>
        </div>

        {/* Qui abbiamo sostituito href con onClick che chiama la nostra nuova funzione */}
        <Dropdown.Item onClick={() => goToSection('profile')} className="text-white hover-primary py-2 d-flex align-items-center bg-transparent">
          <FaUserEdit className="me-3 text-primary-light fs-5" /> Gestione Profilo
        </Dropdown.Item>
        
        <Dropdown.Item onClick={() => goToSection('settings')} className="text-white hover-primary py-2 d-flex align-items-center bg-transparent">
          <FaCog className="me-3 text-warning fs-5" /> Impostazioni Preferenze
        </Dropdown.Item>
        
        <div className="border-top border-secondary border-opacity-25 my-2"></div>
        
        <Dropdown.Item onClick={onLogout} className="text-danger py-2 d-flex align-items-center bg-transparent fw-bold hover-primary">
          <FaSignOutAlt className="me-3 fs-5" /> Esci dall'account
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};

export default ProfiloDrpDown;