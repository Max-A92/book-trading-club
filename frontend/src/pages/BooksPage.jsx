import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';
import BookCard from '../components/books/BookCard';
import Pagination from '../components/books/Pagination';
import { useAuth } from '../context/AuthContext';
import './BooksPage.css';

const BooksPage = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 12;

  
  useEffect(() => {
    fetchBooks();
  }, [currentPage]); 

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookService.getAllBooks(currentPage, booksPerPage);
      
      setBooks(response.books || []);
      setTotalBooks(response.totalBooks || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Fehler beim Laden der Bücher');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="books-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Bücher werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={fetchBooks} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="container">
        <div className="books-page__header">
          <div>
            <h1>Alle Bücher</h1>
            <p className="books-page__subtitle">
              {totalBooks} {totalBooks === 1 ? 'Buch' : 'Bücher'} verfügbar
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/add-book" className="btn btn-primary">
              + Buch hinzufügen
            </Link>
          )}
        </div>

        {books.length === 0 ? (
          <div className="books-page__empty">
            <div className="books-page__empty-icon">📚</div>
            <h2>Noch keine Bücher vorhanden</h2>
            <p>Sei der Erste und füge ein Buch hinzu!</p>
            {isAuthenticated && (
              <Link to="/add-book" className="btn btn-primary btn-lg">
                Erstes Buch hinzufügen
              </Link>
            )}
          </div>
        ) : (
          <>
    
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} showOwner={true} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showInfo={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BooksPage;