import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        city: user.city || '',
        state: user.state || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
      // Success-Message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Fehler beim Aktualisieren des Profils');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-card__header">
            <div className="profile-card__avatar">
              <span className="profile-card__avatar-icon">👤</span>
            </div>
            <h1>{user?.username}</h1>
            <p className="profile-card__email">{user?.email}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="alert alert-success">
              ✓ Profil erfolgreich aktualisiert!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* Profile Info */}
          <div className="profile-info">
            <h2>Account Informationen</h2>
            <div className="profile-info__grid">
              <div className="profile-info__item">
                <span className="profile-info__label">Username:</span>
                <span className="profile-info__value">{user?.username}</span>
              </div>
              <div className="profile-info__item">
                <span className="profile-info__label">Email:</span>
                <span className="profile-info__value">{user?.email}</span>
              </div>
              <div className="profile-info__item">
                <span className="profile-info__label">Mitglied seit:</span>
                <span className="profile-info__value">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('de-DE')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="profile-edit">
            <h2>Profil bearbeiten</h2>
            <p className="profile-edit__subtitle">
              Aktualisiere deinen Namen, Stadt und Bundesland
            </p>

            <form onSubmit={handleSubmit} className="profile-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Vollständiger Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="z.B. Max Mustermann"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  Stadt
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder="z.B. Berlin"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* State/Country */}
              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  Bundesland/Land
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="form-input"
                  placeholder="z.B. Deutschland"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Wird gespeichert...' : 'Profil aktualisieren'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;