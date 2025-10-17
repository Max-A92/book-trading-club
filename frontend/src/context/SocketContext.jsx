import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Nur verbinden wenn User eingeloggt ist
    if (isAuthenticated && user) {
      console.log('🔌 Connecting to Socket.io...');
      
      // Socket.io Verbindung erstellen
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });
      
      newSocket.on('connect', () => {
        console.log('✅ Socket.io connected:', newSocket.id);
        setIsConnected(true);
        
        // Registriere User bei Socket.io
        newSocket.emit('register', user.id || user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket.io disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔴 Socket.io connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup bei Unmount oder Logout
      return () => {
        console.log('🔌 Disconnecting Socket.io...');
        newSocket.disconnect();
      };
    } else {
      // User nicht eingeloggt, Socket trennen falls vorhanden
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};