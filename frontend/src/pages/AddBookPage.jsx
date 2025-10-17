import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import BookSearch from '../components/books/BookSearch';
import './AddBookPage.css';

const AddBookPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const handleSelectBook = (book) => {
    // Auto-fill form mit ausgewähltem Buch
    setFormData({
      title: book.title || '',
      author: Array.isArray(book.author) 
        ? book.author.join(', ') 
        : book.author || '',
      description: book.description || '',
      imageUrl: book.imageUrl || '',
    });
    
    // Zeige manuelles Formular nach Auswahl
    setShowManualForm(true);
    
    // Scroll zum Formular
    setTimeout(() => {
      document.querySelector('.add-book-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
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
    setLoading(true);
    setError(null);

    try {
      await bookService.addBook(formData);
      // Bei Erfolg zu My Books weiterleiten
      navigate('/my-books');
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message || 'Fehler beim Hinzufügen des Buches');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      imageUrl: '',
    });
    setError(null);
    setShowManualForm(false);
  };

  const toggleManualForm = () => {
    setShowManualForm(!showManualForm);
  };

  return (
    <div className="add-book-page">
      <div className="container">
        <div className="add-book-card">
          {/* Header */}
          <div className="add-book-card__header">
            <h1>Buch hinzufügen</h1>
            <p>Suche in der Bibliothek oder füge manuell hinzu</p>
          </div>

          <div className="add-book-card__content">
            {/* Book Search Component */}
            {!showManualForm && (
              <>
                <BookSearch onSelectBook={handleSelectBook} />
                
                {/* Manual Entry Toggle */}
                <div className="add-book-divider">
                  <span>oder</span>
                </div>
                
                <div className="add-book-manual-toggle">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={toggleManualForm}
                  >
                    ✏️ Buch manuell hinzufügen
                  </button>
                </div>
              </>
            )}

            {/* Manual Form */}
            {showManualForm && (
              <>
                {/* Back to Search Button */}
                <div className="add-book-back">
                  <button
                    type="button"
                    className="btn btn-text"
                    onClick={toggleManualForm}
                  >
                    ← Zurück zur Suche
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                {/* Add Book Form */}
                <form onSubmit={handleSubmit} className="add-book-form">
                  {/* Title */}
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
                      disabled={loading}
                    />
                  </div>

                  {/* Author */}
                  <div className="form-group">
                    <label htmlFor="author" className="form-label">
                      Autor *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      className="form-input"
                      placeholder="z.B. Robert C. Martin"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Beschreibung (optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-textarea"
                      placeholder="Kurze Beschreibung des Buches..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={loading}
                      rows="4"
                    />
                  </div>

                  {/* Cover Image URL */}
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
                      disabled={loading}
                    />
                    <small className="form-help">
                      Füge eine URL zu einem Bild-Cover hinzu
                    </small>
                  </div>

                  {/* Preview */}
                  {formData.imageUrl && (
                    <div className="add-book-preview">
                      <p className="add-book-preview__label">Cover Vorschau:</p>
                      <div className="add-book-preview__image">
                        <img 
                          src={formData.imageUrl} 
                          alt="Cover Preview" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="add-book-actions">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? 'Wird hinzugefügt...' : 'Buch hinzufügen'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline btn-lg"
                      disabled={loading}
                    >
                      Zurücksetzen
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;