import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import userService from '../services/userService';
import './UsersPage.css';

const UsersPage = () => {
  const { user: currentUser, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Fehler beim Laden der User');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (userId) => {
    if (!isAuthenticated) {
      alert('Bitte melde dich an, um zu chatten!');
      navigate('/login');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const UserCard = ({ user }) => {
    const isCurrentUser = currentUser && (
      user._id === currentUser.id || 
      user._id === currentUser._id ||
      user.username === currentUser.username
    );

    return (
      <div className="user-card">
        <div className="user-card__avatar">
          <span className="user-card__avatar-icon">👤</span>
        </div>

        <div className="user-card__content">
          <h3 className="user-card__username">{user.username}</h3>

          {user.fullName && (
            <p className="user-card__fullname">{user.fullName}</p>
          )}

          <div className="user-card__location">
            {user.city && (
              <span className="user-card__city">
                📍 {user.city}
                {user.state && `, ${user.state}`}
              </span>
            )}
          </div>

          <div className="user-card__stats">
            <div className="user-card__stat">
              <span className="user-card__stat-value">
                {user.addedBooks?.length || 0}
              </span>
              <span className="user-card__stat-label">Bücher</span>
            </div>
          </div>
        </div>

        {!isCurrentUser && isAuthenticated && (
          <div className="user-card__actions">
            <button
              onClick={() => handleStartChat(user._id)}
              className="btn btn-primary btn-sm"
            >
              💬 Chat starten
            </button>
          </div>
        )}

        <div className="user-card__footer">
          <span className="user-card__member-since">
            Mitglied seit {new Date(user.createdAt).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>User werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={fetchUsers} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="container">
        {/* Header */}
        <div className="users-page__header">
          <div>
            <h1>Unsere Community</h1>
            <p className="users-page__subtitle">
              {users.length} {users.length === 1 ? 'Mitglied' : 'Mitglieder'} im
              Book Trading Club
            </p>
          </div>
        </div>

        {/* Users Grid */}
        {users.length === 0 ? (
          <div className="users-empty">
            <div className="users-empty__icon">👥</div>
            <h2>Noch keine User</h2>
            <p>Sei der Erste und registriere dich!</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;