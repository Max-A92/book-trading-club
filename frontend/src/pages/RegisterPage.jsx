import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Fehler löschen wenn User tippt
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Passwort-Validierung
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);

    try {
      // confirmPassword nicht an Backend senden
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // Bei Erfolg zu Books-Seite weiterleiten
      navigate('/books');
    } catch (err) {
      // Fehler wird im AuthContext behandelt
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card__header">
            <h1>Registrierung</h1>
            <p>Erstelle einen Account um Bücher zu tauschen</p>
          </div>

          {/* Error Messages */}
          {(error || validationError) && (
            <div className="alert alert-danger">
              {validationError || error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Dein Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={3}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="deine@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Passwort * (min. 6 Zeichen)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Passwort"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Passwort bestätigen *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Passwort wiederholen"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Vollständiger Name (optional)
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                placeholder="Max Mustermann"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                Stadt (optional)
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="form-input"
                placeholder="Berlin"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* State/Country */}
            <div className="form-group">
              <label htmlFor="state" className="form-label">
                Bundesland/Land (optional)
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="form-input"
                placeholder="Deutschland"
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
              {loading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </form>

          {/* Footer - Link zu Login */}
          <div className="auth-card__footer">
            <p>
              Bereits registriert?{' '}
              <Link to="/login" className="auth-link">
                Zum Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;