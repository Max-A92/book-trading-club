// Haupt-Chat-Interface mit Echtzeit-Kommunikation

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import messageService from '../../services/messageService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = ({ partnerId, partnerInfo }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversation();
  }, [partnerId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageService.getConversation(partnerId);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Fehler beim Laden der Nachrichten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      console.log('📨 Received message via Socket.io:', data);

      // Nur Nachrichten für diese Konversation hinzufügen
      if (
        data.message.sender._id === partnerId ||
        data.message.receiver._id === partnerId
      ) {
        setMessages((prev) => {
          // Prüfe ob Nachricht bereits existiert (Duplikate vermeiden)
          const exists = prev.some(msg => msg._id === data.message._id);
          if (exists) return prev;
          
          return [...prev, data.message];
        });
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    // Cleanup
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, partnerId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);
      setError(null);

      const response = await messageService.sendMessage(partnerId, text);

      // Füge Nachricht zur Liste hinzu
      setMessages((prev) => [...prev, response.data]);

      if (socket && isConnected) {
        socket.emit('send_message', {
          receiverId: partnerId,
          message: response.data
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Fehler beim Senden der Nachricht');
      alert('Nachricht konnte nicht gesendet werden');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-window">
    
      <div className="chat-window__header">
        <div className="chat-window__partner-info">
          <div className="chat-window__avatar">
            {partnerInfo?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="chat-window__partner-name">
              {partnerInfo?.fullName || partnerInfo?.username || 'User'}
            </h3>
            <span className={`chat-window__status ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? '🟢 Online' : '⚪ Offline'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="chat-window__error">
          ⚠️ {error}
          <button onClick={loadConversation} className="btn btn-sm">
            Neu laden
          </button>
        </div>
      )}

      <div className="chat-window__messages">
        <MessageList messages={messages} loading={loading} />
      </div>

      <div className="chat-window__input">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={sending || !isConnected}
        />
      </div>
    </div>
  );
};

export default ChatWindow;