

// Per importare le variabili .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

console.log(`Ambiente: ${import.meta.env.MODE}, API URL: ${API_BASE_URL}`);

// Timeout predefinito per le richieste (30 secondi per dare tempo al servizio Render di "svegliarsi")
const DEFAULT_TIMEOUT = 30000;

// Funzione per ottenere gli headers con il token JWT
export const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Funzione di fetching avanzata con gestione timeout, retry e errori
export const enhancedFetch = async (endpoint, options = {}, retries = 2) => {
  // Aggiungi gestione timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);
  
  try {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    console.log(`Chiamata API a: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal
    });
    
    // Gestione errore 503 (servizio non disponibile, comune su Render dopo sleep)
    if (response.status === 503 && retries > 0) {
      console.log(`Servizio non disponibile (503), riprovo tra 3 secondi... Tentativi rimasti: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return enhancedFetch(endpoint, options, retries - 1);
    }
    
    // Gestione errore 401 (non autorizzato)
    if (response.status === 401) {
      console.error('Sessione scaduta o non autorizzata');
      // Qui potresti implementare un reindirizzamento alla pagina di login
      // o un refresh del token se implementi il refresh token
      localStorage.removeItem('user'); // Rimuovi l'utente salvato
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
        return null;
      }
    }
    
    // Errore generale
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage;
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Errore API: ${response.status}`;
      } else {
        errorMessage = await response.text() || `Errore API: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Determina il tipo di risposta
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Timeout nella richiesta a ${endpoint}`);
      throw new Error(`La richiesta ha impiegato troppo tempo. Il server potrebbe essere in fase di avvio (può richiedere fino a 30 secondi)`);
    }
    
    console.error(`Errore nella richiesta a ${endpoint}:`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Funzioni per l'autenticazione
export const login = async (email, password) => {
  try {
    const data = await enhancedFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Errore durante il login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    return await enhancedFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Errore nel parsing dei dati utente', e);
    localStorage.removeItem('user'); // Rimuovi i dati corrotti
    return null;
  }
};

// Funzione per verificare se il server è online
export const checkServerHealth = async () => {
  try {
    const response = await enhancedFetch('/health', {
      timeout: 10000 // timeout più breve per il controllo salute
    });
    return { online: true, data: response };
  } catch (error) {
    console.error('Server health check failed:', error);
    return { online: false, error };
  }
};

// Statistiche
export const fetchStatistics = async (token) => {
  try {
    return await enhancedFetch('/statistiche/dashboard', {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error("Errore nel recupero delle statistiche:", error);
    throw error;
  }
};

// Conversazioni
export const fetchConversations = async (token, orgId) => {
  try {
    const endpoint = orgId 
      ? `/conversazioni/organizzazione/${orgId}`
      : '/conversazioni';
      
    return await enhancedFetch(endpoint, {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error("Errore nel recupero delle conversazioni:", error);
    throw error;
  }
};

// Messaggi
export const fetchMessages = async (token, conversationId) => {
  try {
    return await enhancedFetch(`/conversazioni/${conversationId}/messaggi`, {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error(`Errore nel recupero dei messaggi per la conversazione ${conversationId}:`, error);
    throw error;
  }
};

// Organizzazioni
export const fetchOrganizations = async (token) => {
  try {
    return await enhancedFetch('/organizzazioni', {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error("Errore nel recupero delle organizzazioni:", error);
    throw error;
  }
};

// Documenti
export const fetchDocuments = async (token, orgId) => {
  try {
    const endpoint = orgId 
      ? `/documenti/organizzazione/${orgId}`
      : '/documenti';
      
    return await enhancedFetch(endpoint, {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error("Errore nel recupero dei documenti:", error);
    throw error;
  }
};

// Utenti
export const fetchUsers = async (token, orgId) => {
  try {
    const endpoint = orgId 
      ? `/utenti/organizzazione/${orgId}`
      : '/utenti';
      
    return await enhancedFetch(endpoint, {
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error);
    throw error;
  }
};

// Creazione utente
export const createUser = async (token, userData) => {
  try {
    return await enhancedFetch('/auth/register', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData)
    });
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    throw error;
  }
};

// Upload documento
export const uploadDocument = async (token, formData) => {
  try {
    // Per upload file non usiamo il Content-Type JSON
    return await enhancedFetch('/documenti', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
  } catch (error) {
    console.error("Errore nel caricamento del documento:", error);
    throw error;
  }
};

// Creazione organizzazione
export const createOrganization = async (token, organizationData) => {
  try {
    return await enhancedFetch('/organizzazioni', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(organizationData)
    });
  } catch (error) {
    console.error("Errore nella creazione dell'organizzazione:", error);
    throw error;
  }
};

// Gestione conversazioni
export const closeConversation = async (token, conversationId) => {
  try {
    return await enhancedFetch(`/conversazioni/${conversationId}/chiudi`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error(`Errore nella chiusura della conversazione ${conversationId}:`, error);
    throw error;
  }
};

export const reopenConversation = async (token, conversationId) => {
  try {
    return await enhancedFetch(`/conversazioni/${conversationId}/riapri`, {
      method: 'PUT',
      headers: getAuthHeaders(token)
    });
  } catch (error) {
    console.error(`Errore nella riapertura della conversazione ${conversationId}:`, error);
    throw error;
  }
};

// Test WhatsApp connection
export const testWhatsAppConnection = async (token) => {
  try {
    console.log("Invio richiesta test connessione WhatsApp");
    
    return await enhancedFetch('/webhook/test-twilio-connection', {
      headers: getAuthHeaders(token),
      timeout: 15000 // timeout più breve per test
    });
  } catch (error) {
    console.error("Errore nel test della connessione WhatsApp:", error);
    throw error;
  }
};

// Invio messaggio di test
export const sendTestMessage = async (token, phoneNumber, message) => {
  try {
    return await enhancedFetch('/webhook/test-twilio-send', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        to: phoneNumber,
        body: message
      })
    });
  } catch (error) {
    console.error("Errore nell'invio del messaggio di test:", error);
    throw error;
  }
};