import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import BookCard from '../components/books/BookCard';
import Pagination from '../components/books/Pagination';
import './MyBooksPage.css';

const MyBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 12;

  useEffect(() => {
    fetchMyBooks();
  }, [currentPage]); 

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookService.getMyBooks(currentPage, booksPerPage);
      
      setBooks(response.books || []);
      setTotalBooks(response.totalBooks || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (err) {
      console.error('Error fetching my books:', err);
      setError('Fehler beim Laden deiner Bücher');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Möchtest du dieses Buch wirklich löschen?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      
      const updatedBooks = books.filter((book) => book._id !== bookId);
      setBooks(updatedBooks);
      setTotalBooks(prev => prev - 1);

      // Wenn Seite jetzt leer ist und nicht Seite 1, gehe zu vorheriger Seite
      if (updatedBooks.length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Sonst neu laden um korrekte Pagination zu haben
        fetchMyBooks();
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Fehler beim Löschen des Buches');
      // Bei Fehler: Daten neu laden
      fetchMyBooks();
    }
  };

  const handleEdit = (book) => {
    navigate(`/edit-book/${book._id}`);
  };

  if (loading) {
    return (
      <div className="my-books-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Deine Bücher werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-books-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={fetchMyBooks} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-books-page">
      <div className="container">
    
        <div className="my-books-page__header">
          <div>
            <h1>Meine Bücher</h1>
            <p className="my-books-page__subtitle">
              {totalBooks} {totalBooks === 1 ? 'Buch' : 'Bücher'} in deiner Sammlung
            </p>
          </div>
          <Link to="/add-book" className="btn btn-primary">
            + Neues Buch hinzufügen
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="my-books-page__empty">
            <div className="my-books-page__empty-icon">📚</div>
            <h2>Noch keine Bücher</h2>
            <p>Füge dein erstes Buch hinzu, um mit dem Tauschen zu beginnen!</p>
            <Link to="/add-book" className="btn btn-primary btn-lg">
              Erstes Buch hinzufügen
            </Link>
          </div>
        ) : (
          <>
      
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  showOwner={false}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
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

export default MyBooksPage;