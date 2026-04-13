# 🚀 Yovendo.ai

Yovendo.ai è una piattaforma SaaS avanzata che integra intelligenza artificiale e automazione WhatsApp per ottimizzare i processi di vendita e supporto clienti. 

Il sistema offre un assistente AI conversazionale in grado di elaborare documenti, gestire conversazioni in tempo reale e fornire risposte contestualizzate basate sui dati aziendali, aiutando i team di vendita a migliorare le proprie performance.

## ✨ Caratteristiche Principali

* **🤖 Assistente AI Intelligente:** Integrazione con OpenAI per risposte contestuali tramite sistema RAG (Retrieval-Augmented Generation) sui documenti aziendali.
* **📱 Integrazione WhatsApp:** Gestione diretta delle conversazioni con i clienti tramite l'API di Twilio.
* **📊 Dashboard Analitica:** Pannello di controllo interattivo per monitorare il tasso di successo, le conversazioni e le performance dei venditori.
* **🏢 Architettura Multi-Tenant:** Gestione sicura e separata per diverse organizzazioni e utenti all'interno della stessa piattaforma.
* **🎨 UI/UX Moderna:** Interfaccia utente elegante e responsiva realizzata in stile *Glassmorphism* per un'esperienza visiva premium.

---

## 🛠 Stack Tecnologico

### Backend
* **Java 21 + Spring Boot 3.4.5:** Core application framework
* **Spring Security + JWT:** Autenticazione e autorizzazione sicura
* **PostgreSQL:** Database relazionale per la persistenza dei dati
* **Hibernate/JPA:** ORM per la gestione dei dati
* **Twilio API:** Servizio di messaggistica WhatsApp
* **OpenAI API:** Motore di intelligenza artificiale (LLM e Embeddings)

### Frontend
* **React 18 + Vite:** Libreria UI e build tool ultrarapido
* **React Bootstrap:** Componenti UI strutturati e responsivi
* **React Router Dom:** Gestione della navigazione (SPA)
* **Chart.js / React-Chartjs-2:** Visualizzazione dati e statistiche
* **Axios:** Client HTTP per le chiamate API RESTful

---

## ⚙️ Installazione e Avvio Locale

### Prerequisiti
* Java 21 installato
* Node.js (v18 o superiore)
* PostgreSQL in esecuzione
* Account Twilio e OpenAI con relative API Keys

### Setup Backend
1. Clona il repository.
2. Configura il file `application.properties` con le credenziali del database e le API keys.
3. Avvia l'applicazione Spring Boot.

### Setup Frontend
1. Naviga nella cartella del frontend: `cd client` (o nome della cartella).
2. Installa le dipendenze: `npm install`
3. Crea un file `.env` e configura l'URL dell'API backend (es. `VITE_API_URL=http://localhost:8080/api`).
4. Avvia il server di sviluppo: `npm run dev`

---

## 🔒 Sicurezza e Gestione Dati
L'accesso alla piattaforma è protetto da un sistema di login/registrazione crittografato. I dati dei clienti, i documenti elaborati e le statistiche sono isolati tramite `organizzazioneId`, garantendo la massima privacy tra i diversi tenant della piattaforma SaaS.