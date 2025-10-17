// Haupt-Seite für 1:1 Chat zwischen Usern

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import messageService from '../services/messageService';
import ChatWindow from '../components/chat/ChatWindow';
import './ChatPage.css';

const ChatPage = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [partnerInfo, setPartnerInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      setConversations(response.conversations || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Fehler beim Laden der Konversationen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.partner._id === userId
      );
      if (conversation) {
        setPartnerInfo(conversation.partner);
      }
    }
  }, [userId, conversations]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInDays === 1) {
      return 'Gestern';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('de-DE', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="chat-page">
      <div className="container">
        <div className="chat-page__layout">
    
          <aside className="chat-page__sidebar">
            <div className="chat-page__sidebar-header">
              <h2>Nachrichten</h2>
              {conversations.length > 0 && (
                <span className="chat-page__count">
                  {conversations.length}
                </span>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="chat-page__sidebar-loading">
                <div className="spinner"></div>
                <p>Lade Konversationen...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="chat-page__sidebar-error">
                <p>⚠️ {error}</p>
                <button onClick={loadConversations} className="btn btn-sm">
                  Erneut versuchen
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && conversations.length === 0 && (
              <div className="chat-page__sidebar-empty">
                <div className="chat-page__empty-icon">💬</div>
                <h3>Noch keine Chats</h3>
                <p>Starte einen Chat mit anderen Usern!</p>
                <Link to="/users" className="btn btn-primary btn-sm">
                  User finden
                </Link>
              </div>
            )}

            {/* Conversations List */}
            {!loading && conversations.length > 0 && (
              <div className="chat-page__conversations">
                {conversations.map((conv) => (
                  <Link
                    key={conv.partner._id}
                    to={`/chat/${conv.partner._id}`}
                    className={`conversation-item ${
                      userId === conv.partner._id ? 'active' : ''
                    }`}
                  >
                    <div className="conversation-item__avatar">
                      {conv.partner.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="conversation-item__content">
                      <div className="conversation-item__header">
                        <h4 className="conversation-item__name">
                          {conv.partner.fullName || conv.partner.username}
                        </h4>
                        <span className="conversation-item__time">
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="conversation-item__footer">
                        <p className="conversation-item__preview">
                          {conv.lastMessage.sender === user.id || 
                           conv.lastMessage.sender === user._id
                            ? 'Du: '
                            : ''}
                          {conv.lastMessage.text.length > 40
                            ? conv.lastMessage.text.substring(0, 40) + '...'
                            : conv.lastMessage.text}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="conversation-item__badge">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </aside>

          <main className="chat-page__main">
            {userId && partnerInfo ? (
              <ChatWindow partnerId={userId} partnerInfo={partnerInfo} />
            ) : (
              <div className="chat-page__placeholder">
                <div className="chat-page__placeholder-icon">💬</div>
                <h2>Wähle eine Konversation</h2>
                <p>Oder starte einen neuen Chat mit einem User</p>
                {conversations.length === 0 && (
                  <Link to="/users" className="btn btn-primary">
                    User finden
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;