import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import tradeService from '../../services/tradeService';
import './BookCard.css';

const BookCard = ({ book, showOwner = true, onDelete, onEdit }) => {
  const { user, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  
  const isOwnBook = user && book.owner && (
    book.owner._id === user.id || 
    book.owner._id === user._id ||
    book.owner.username === user.username
  );

  const handleRequestTrade = async () => {
    if (!user) {
      alert('Bitte melde dich an, um einen Trade anzufragen!');
      return;
    }

    if (window.confirm(`Möchtest du "${book.title}" anfragen?`)) {
      try {
        await tradeService.createTradeRequest(book._id);  
        alert('Trade-Anfrage erfolgreich gesendet! ✓');
      } catch (error) {
        console.error('Error creating trade request:', error);
        alert(
          error.response?.data?.message || 
          'Fehler beim Senden der Trade-Anfrage'
        );
      }
    }
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      alert('Bitte melde dich an, um zu chatten!');
      navigate('/login');
      return;
    }
    navigate(`/chat/${book.owner._id}`);
  };

  const imageUrl = book.imageUrl || null;  

  return (
    <div className="book-card">
      {/* Book Cover */}
      <div className="book-card__cover">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={book.title}
              loading="lazy"
              onError={(e) => {
                const coverDiv = e.target.parentElement;  
                e.target.remove();  
                
                if (coverDiv) {
                  const placeholder = coverDiv.querySelector('.book-card__cover-placeholder');
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }
              }}
            />
            <div 
              className="book-card__cover-placeholder" 
              style={{ display: 'none' }}
            >
              📚
            </div>
          </>
        ) : (
          <div className="book-card__cover-placeholder">
            📚
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="book-card__content">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">
          von {Array.isArray(book.author) ? book.author.join(', ') : book.author}
        </p>

        {book.description && (
          <p className="book-card__description">{book.description}</p>
        )}

        {/* Owner Info */}
        {showOwner && book.owner && (
          <div className="book-card__owner">
            <span className="book-card__owner-icon">👤</span>
            <span className="book-card__owner-name">{book.owner.username}</span>
            {book.owner.city && (
              <>
                <span className="book-card__separator">•</span>
                <span className="book-card__owner-location">
                  📍 {book.owner.city}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="book-card__actions">
        {isOwnBook && (onEdit || onDelete) ? (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(book)}
                className="btn btn-primary btn-sm"
              >
                Bearbeiten
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(book._id)}
                className="btn btn-danger btn-sm"
              >
                Löschen
              </button>
            )}
          </>
        ) : !isOwnBook ? (
          <>
            <button
              onClick={handleRequestTrade}
              className="btn btn-primary btn-sm"
              disabled={!user}
            >
              Trade anfragen
            </button>
          
            <button
              onClick={handleStartChat}
              className="btn btn-outline btn-sm"
              disabled={!isAuthenticated}
            >
              💬 Chat
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BookCard;