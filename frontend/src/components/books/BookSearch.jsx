import { useState } from 'react';
import openLibraryService from '../../services/openLibraryService';
import Pagination from './Pagination';
import './BookSearch.css';

const BookSearch = ({ onSelectBook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Bitte gib einen Suchbegriff ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (searchType === 'isbn') {
        // ISBN Suche (keine Pagination nötig - nur 1 Ergebnis)
        const book = await openLibraryService.searchByISBN(searchQuery);
        response = {
          results: [book],
          totalResults: 1,
          currentPage: 1,
          totalPages: 1
        };
      } else {
        // ⭐ Titel/Autor Suche MIT PAGINATION
        response = await openLibraryService.searchByQuery(
          searchQuery, 
          page, 
          resultsPerPage
        );
      }

      setSearchResults(response.results);
      setTotalResults(response.totalResults);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      
      if (response.results.length === 0) {
        setError('Keine Bücher gefunden');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Fehler bei der Suche');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch(null, newPage); // Suche mit neuer Page
  };

  const handleSelectBook = (book) => {
    onSelectBook(book);
    // Reset nach Auswahl
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalResults(0);
  };

  return (
    <div className="book-search">
      <div className="book-search__header">
        <h3>Buch in Bibliothek suchen</h3>
        <p className="book-search__subtitle">
          Finde Bücher automatisch über ISBN oder Titel
        </p>
      </div>

      <form onSubmit={handleSearch} className="book-search__form">
        <div className="book-search__input-group">
          <div className="book-search__toggle">
            <button
              type="button"
              className={`book-search__toggle-btn ${
                searchType === 'title' ? 'active' : ''
              }`}
              onClick={() => setSearchType('title')}
            >
              Titel/Autor
            </button>
            <button
              type="button"
              className={`book-search__toggle-btn ${
                searchType === 'isbn' ? 'active' : ''
              }`}
              onClick={() => setSearchType('isbn')}
            >
              ISBN
            </button>
          </div>

          <input
            type="text"
            className="book-search__input"
            placeholder={
              searchType === 'isbn'
                ? 'z.B. 978-0132350884'
                : 'z.B. Clean Code oder Robert Martin'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? 'Suche...' : 'Suchen'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger book-search__error">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="book-search__results">
          <h4>
            Suchergebnisse ({totalResults} gefunden, Seite {currentPage} von {totalPages})
          </h4>
          
          <div className="book-search__results-grid">
            {searchResults.map((book, index) => (
              <div key={index} className="book-search__result-card">
                <div className="book-search__result-cover">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} />
                  ) : (
                    <div className="book-search__result-cover-placeholder">
                      📚
                    </div>
                  )}
                </div>

                <div className="book-search__result-info">
                  <h5>{book.title}</h5>
                  <p className="book-search__result-author">
                    {Array.isArray(book.author)
                      ? book.author.join(', ')
                      : book.author}
                  </p>
                  {book.publishedYear && (
                    <p className="book-search__result-meta">
                      {book.publishedYear}
                    </p>
                  )}
                  {book.isbn && (
                    <p className="book-search__result-meta">
                      ISBN: {book.isbn}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleSelectBook(book)}
                >
                  Auswählen
                </button>
              </div>
            ))}
          </div>

          {searchType === 'title' && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showInfo={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
