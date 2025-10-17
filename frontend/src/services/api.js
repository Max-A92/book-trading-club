// API SERVICE - Axios Instance
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// AXIOS INSTANCE erstellen

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 Sekunden Timeout
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Token aus localStorage holen
    const token = localStorage.getItem('token');
    
    // Wenn Token existiert, zu Authorization Header hinzufügen
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    // Erfolgreiche Response direkt zurückgeben
    return response;
  },
  (error) => {
    // Fehlerbehandlung
    if (error.response) {
      // Server hat mit Fehlercode geantwortet
      const { status } = error.response;
      
      // 401 Unauthorized - Token ungültig 
      if (status === 401) {
        // Token und User aus localStorage entfernen
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Zur Login-Seite weiterleiten 
        window.location.href = '/login';
      }
      
      // 403 Forbidden
      if (status === 403) {
        console.error('Zugriff verweigert');
      }
      
      // 404 Not Found
      if (status === 404) {
        console.error('Ressource nicht gefunden');
      }
      
      // 500 Server Error
      if (status >= 500) {
        console.error('Server-Fehler');
      }
    } else if (error.request) {
      // Request wurde gesendet aber keine Response erhalten
      console.error('Keine Response vom Server erhalten');
    } else {
      // Fehler beim Erstellen des Requests
      console.error('Request-Fehler:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;