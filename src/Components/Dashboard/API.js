
const API_BASE_URL = "/api";

// Funzione per ottenere gli headers con il token JWT
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Statistiche
export const fetchStatistics = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistiche/dashboard`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero delle statistiche:", error);
    throw error;
  }
};

// Conversazioni
export const fetchConversations = async (token, orgId) => {
  try {
    const url = orgId 
      ? `${API_BASE_URL}/conversazioni/organizzazione/${orgId}`
      : `${API_BASE_URL}/conversazioni`;
      
    const response = await fetch(url, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero delle conversazioni:", error);
    throw error;
  }
};

// Messaggi
export const fetchMessages = async (token, conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversazioni/${conversationId}/messaggi`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Errore nel recupero dei messaggi per la conversazione ${conversationId}:`, error);
    throw error;
  }
};

// Organizzazioni
export const fetchOrganizations = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/organizzazioni`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero delle organizzazioni:", error);
    throw error;
  }
};

// Documenti
export const fetchDocuments = async (token, orgId) => {
  try {
    const url = orgId 
      ? `${API_BASE_URL}/documenti/organizzazione/${orgId}`
      : `${API_BASE_URL}/documenti`;
      
    const response = await fetch(url, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero dei documenti:", error);
    throw error;
  }
};

// Utenti
export const fetchUsers = async (token, orgId) => {
  try {
    const url = orgId 
      ? `${API_BASE_URL}/utenti/organizzazione/${orgId}`
      : `${API_BASE_URL}/utenti`;
      
    const response = await fetch(url, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error);
    throw error;
  }
};

// Creazione utente
export const createUser = async (token, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    throw error;
  }
};

// Altre funzioni API...
export const uploadDocument = async (token, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documenti`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nel caricamento del documento:", error);
    throw error;
  }
};

export const createOrganization = async (token, organizationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/organizzazioni`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(organizationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Errore nella creazione dell'organizzazione:", error);
    throw error;
  }
};

export const closeConversation = async (token, conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversazioni/${conversationId}/chiudi`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Errore nella chiusura della conversazione ${conversationId}:`, error);
    throw error;
  }
};

export const reopenConversation = async (token, conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversazioni/${conversationId}/riapri`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Errore nella riapertura della conversazione ${conversationId}:`, error);
    throw error;
  }
};

export const testWhatsAppConnection = async (token) => {
  try {
    console.log("Invio richiesta test connessione a:", `${API_BASE_URL}/webhook/test-twilio-connection`);
    
    const response = await fetch(`${API_BASE_URL}/webhook/test-twilio-connection`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      // timeout se necessario
      // signal: AbortSignal.timeout(10000), // 10 secondi di timeout
    });
    
    console.log("Status risposta:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore risposta:", errorText);
      throw new Error(`Errore API: ${response.status}. Dettagli: ${errorText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Errore nella richiesta:", error);
    throw error;
  }
};

export const sendTestMessage = async (token, phoneNumber, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/webhook/test-twilio-send`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        to: phoneNumber,
        body: message
      })
    });
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Errore nell'invio del messaggio di test:", error);
    throw error;
  }
};