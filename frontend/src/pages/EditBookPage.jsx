import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../services/bookService';
import './AddBookPage.css';

const EditBookPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(bookId);
      const book = response.book;
      
      setFormData({
        title: book.title || '',
        // Author ist Array, aber zeigen es als String im Form
        author: Array.isArray(book.author) ? book.author.join(', ') : book.author || '',
        description: book.description || '',
        imageUrl: book.imageUrl || book.imageUrl || '',
      });
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Fehler beim Laden des Buches');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Titel und Autor sind Pflichtfelder');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Author zurück in Array umwandeln 
      const authorArray = formData.author
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const updateData = {
        title: formData.title.trim(),
        author: authorArray,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
      };

      await bookService.updateBook(bookId, updateData);
      navigate('/my-books');
    } catch (err) {
      console.error('Error updating book:', err);
      setError(
        err.response?.data?.message || 'Fehler beim Aktualisieren des Buches'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-book-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Buch wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-book-page">
      <div className="container">
        <div className="add-book-card">
          {/* Header */}
          <div className="add-book-card__header">
            <h1>Buch bearbeiten</h1>
            <p className="add-book-card__subtitle">
              Aktualisiere die Informationen deines Buches
            </p>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="add-book-form">
            {/* Titel */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Buchtitel *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                placeholder="z.B. Clean Code"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            {/* Autor */}
            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Autor *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                className="form-input"
                placeholder="z.B. Robert C. Martin (mehrere mit Komma trennen)"
                value={formData.author}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              <small className="form-help">
                Mehrere Autoren mit Komma trennen
              </small>
            </div>

            {/* Beschreibung */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Beschreibung (optional)
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Kurze Beschreibung des Buches..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            {/* Cover URL */}
            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">
                Cover Bild URL (optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="form-input"
                placeholder="https://example.com/book-cover.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                disabled={submitting}
              />
              <small className="form-help">
                Füge eine URL zu einem Bild-Cover hinzu
              </small>
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => navigate('/my-books')}
                disabled={submitting}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;