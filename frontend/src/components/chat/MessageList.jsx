import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const MessageList = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll zu neuester Nachricht
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Formatiere Timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // Heute: Zeige nur Uhrzeit
      return date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInDays === 1) {
      // Gestern
      return 'Gestern ' + date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInDays < 7) {
      // Diese Woche: Zeige Wochentag
      return date.toLocaleDateString('de-DE', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // Älter: Zeige Datum
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="message-list message-list--loading">
        <div className="spinner"></div>
        <p>Nachrichten werden geladen...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-list message-list--empty">
        <div className="message-list__empty-icon">💬</div>
        <h3>Noch keine Nachrichten</h3>
        <p>Schreib die erste Nachricht!</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg, index) => {
        const isOwnMessage = msg.sender._id === user.id || msg.sender._id === user._id;
        const showAvatar = index === 0 || messages[index - 1].sender._id !== msg.sender._id;

        return (
          <div
            key={msg._id}
            className={`message ${isOwnMessage ? 'message--own' : 'message--other'}`}
          >
            {/* Avatar (nur bei Sender-Wechsel) */}
            {!isOwnMessage && showAvatar && (
              <div className="message__avatar">
                {msg.sender.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            {!isOwnMessage && !showAvatar && (
              <div className="message__avatar-spacer"></div>
            )}

            {/* Message Content */}
            <div className="message__content">
              {/* Sender Name (nur bei fremden Nachrichten & Sender-Wechsel) */}
              {!isOwnMessage && showAvatar && (
                <div className="message__sender">
                  {msg.sender.fullName || msg.sender.username}
                </div>
              )}

              {/* Message Bubble */}
              <div className="message__bubble">
                <p className="message__text">{msg.text}</p>
                <span className="message__time">{formatTime(msg.createdAt)}</span>
              </div>

              {isOwnMessage && (
                <div className="message__status">
                  {msg.isRead ? '✓✓' : '✓'}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;